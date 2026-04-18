import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Activity, Users, Car, CheckCircle2, 
  Camera, X, AlertCircle, ScanLine, Calendar, Clock 
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AdminDashboard() {
  const [data, setData] = useState([]); // Sensor Data
  const [userBookings, setUserBookings] = useState([]); // Real User Bookings
  const [loading, setLoading] = useState(true);

  // --- Verification States ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); 

  const fetchData = async () => {
    try {
      const sensorRes = await fetch("http://127.0.0.1:5000/api/dashboard");
      const sensorResult = await sensorRes.json();
      const formattedData = sensorResult.map(item => ({
        ...item,
        spot_map: typeof item.spot_map === 'string' ? JSON.parse(item.spot_map) : item.spot_map
      }));
      setData(formattedData);

      const bookingRes = await fetch("http://127.0.0.1:5000/api/all_bookings");
      const bookingResult = await bookingRes.json();
      setUserBookings(bookingResult);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const finalizeCheckIn = async (transactionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/verify_checkin/${transactionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUserBookings(prev => prev.filter(b => b.transactionId !== transactionId));
      }
    } catch (err) {
      console.error("Check-in sync failed:", err);
      setUserBookings(prev => prev.filter(b => b.transactionId !== transactionId));
    }
  };

  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render((decodedText) => {
        try {
          const parsedData = JSON.parse(decodedText);
          const match = userBookings.find(b => b.transactionId === parsedData.id || b.transactionId === parsedData.tid);
          if (match) {
            setScanResult({ status: 'success', data: match });
            finalizeCheckIn(match.transactionId);
          } else {
            setScanResult({ status: 'error', message: "INVALID OR EXPIRED PERMIT." });
          }
        } catch (e) {
          setScanResult({ status: 'error', message: "INVALID QR FORMAT." });
        }
        setIsScanning(false);
        scanner.clear();
      }, (err) => { });
    }
    return () => { if (scanner) scanner.clear(); };
  }, [isScanning, userBookings]);

  const latest = data[0] || { available_spaces: 0, occupied_spaces: 0 };
  const containerVars = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Verification Modals remain identical to your previous logic */}
      <AnimatePresence>
        {isScanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative">
              <button onClick={() => setIsScanning(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X /></button>
              <div className="text-center mb-6">
                <Camera className="mx-auto text-green-500 mb-2" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Verification Terminal</h2>
              </div>
              <div id="reader" className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-800"></div>
            </div>
          </motion.div>
        )}
        {scanResult && (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border-2 shadow-2xl ${scanResult.status === 'success' ? 'bg-slate-900 border-green-500/50' : 'bg-slate-900 border-red-500/50'}`}>
               <div className="text-center">
                 {scanResult.status === 'success' ? (
                   <>
                     <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                     <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Access Granted</h2>
                   </>
                 ) : (
                   <>
                     <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
                     <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">Denied</h2>
                     <p className="text-slate-400 mt-4 text-xs font-bold leading-relaxed">{scanResult.message}</p>
                   </>
                 )}
                 <button onClick={() => setScanResult(null)} className={`w-full mt-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] ${scanResult.status === 'success' ? 'bg-green-500 text-slate-950' : 'bg-red-500 text-white'}`}>Clear Terminal</button>
               </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVars} initial="initial" animate="animate" className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div variants={itemVars} className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tighter italic flex items-center gap-3 text-white leading-none">
              ADMIN<span className="text-green-500">LOGS</span>
              <ShieldCheck className="text-green-500" />
            </h1>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-[0.3em] font-medium">Urban Intelligence Hub</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsScanning(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all">
              <ScanLine size={18} /> VERIFY ENTRY
            </button>
            <button onClick={() => window.location.href = "http://127.0.0.1:5000/api/download_report"} className="bg-green-500 hover:bg-green-400 text-[#0f172a] font-bold px-8 py-3 rounded-full transition-all">
              DOWNLOAD REPORT →
            </button>
          </div>
        </motion.div>

        {/* Stats Section... same as before */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SENSOR DATA TABLE - UPDATED DATE/TIME COLUMN */}
          <motion.div variants={itemVars} className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-[3rem] overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center gap-2">
              <Activity size={16} className="text-green-500" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Activity History Feed</h3>
            </div>
            <div className="overflow-x-auto h-[500px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-900 z-10">
                  <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800">
                    <th className="px-8 py-5">Date & Time</th>
                    <th className="px-8 py-5 text-center">Free</th>
                    <th className="px-8 py-5 text-center">Busy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.map((item) => {
                    const dateObj = new Date(item.timestamp);
                    return (
                      <tr key={item.id} className="hover:bg-green-500/5 transition-all group">
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-300">
                              {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                              {dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center text-green-500 font-black">{item.available_spaces}</td>
                        <td className="px-8 py-4 text-center text-red-500 font-black">{item.occupied_spaces}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* USER VERIFICATION PANEL - UPDATED WITH DATE ICON */}
          <motion.div variants={itemVars} className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-8 text-blue-400">
              <Users size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Live User Reservations</h3>
            </div>
            <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {userBookings.map((booking) => {
                const method = (booking.paymentType || "").trim().toLowerCase();
                const isPayAtSpot = method === "pay on spot";

                return (
                  <div key={booking.transactionId} className="bg-slate-800/30 border border-white/5 p-6 rounded-[2rem] group hover:border-blue-500/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-600">REF: {booking.transactionId?.slice(0,10)}</span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar size={10} />
                          <span className="text-[9px] font-bold">{booking.bookingDate}</span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest border
                        ${isPayAtSpot ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : "bg-green-500 text-slate-950 border-transparent"}`}>
                        {isPayAtSpot ? "Cash Entry" : "Paid"}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white uppercase mb-2 tracking-tight italic">{booking.selectedLot?.name}</h4>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Plate</p>
                        <div className="flex items-center gap-2 text-green-500 font-black text-xl italic tracking-tighter leading-none">
                          <Car size={18} /> {booking.vehicle?.vehicleId}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Bay</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter leading-none">#{booking.selectedSlot}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}