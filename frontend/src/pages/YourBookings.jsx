import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, ArrowLeft, Trash2, ShoppingBag, ExternalLink, X, 
  Banknote, Smartphone, CreditCard, Wallet, ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // ✅ Import QR Generator

const YourBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const fullEmail = localStorage.getItem("userEmail") || "guest";
  const userPrefix = fullEmail.toLowerCase();
  const storageKey = `${userPrefix}_myBookings`;

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const sortedBookings = savedBookings.sort((a, b) => 
      new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );
    setBookings(sortedBookings);
  }, [storageKey]);

  const getStatus = (bookingDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const bDate = new Date(bookingDate).setHours(0, 0, 0, 0);
    return bDate < today ? "Completed" : "Active";
  };

  // Helper to render the correct payment icon
  const getPaymentIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes('spot')) return <Banknote size={14} className="text-amber-500" />;
    if (t.includes('upi')) return <Smartphone size={14} className="text-green-500" />;
    if (t.includes('card')) return <CreditCard size={14} className="text-blue-500" />;
    return <Wallet size={14} className="text-slate-400" />;
  };

  const removeBooking = (tid) => {
    const currentBookings = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updated = currentBookings.filter(b => b.transactionId !== tid);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setBookings(updated);
  };

  const clearHistory = () => {
    if (window.confirm("Delete your personal vault history?")) {
      localStorage.removeItem(storageKey);
      setBookings([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-12 pb-24 font-sans selection:bg-green-500/30">
      <div className="max-w-5xl mx-auto">
        {/* NAV HEADER */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Hub</span>
          </button>

          <div className="flex items-center gap-4">
            {bookings.length > 0 && (
              <button onClick={clearHistory} className="text-slate-600 hover:text-red-500 transition-colors text-[10px] font-black uppercase flex items-center gap-2">
                <Trash2 size={16} /> Clear Vault
              </button>
            )}
            <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
              <ShoppingBag size={14} className="text-green-500" />
              <span className="text-xs font-bold">{bookings.length} Records</span>
            </div>
          </div>
        </div>

        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
            My <span className="text-green-500">Vault</span>
          </h1>
          <p className="text-slate-500 mt-4 font-medium tracking-wide flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500/50" />
            Private history for <span className="text-slate-300">{fullEmail}</span>
          </p>
        </header>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
               <ClipboardList size={48} className="mx-auto mb-4 text-slate-800" />
               <p className="text-slate-500 font-bold uppercase tracking-widest">No private records found</p>
            </div>
          ) : (
            bookings.map((item) => {
              const status = getStatus(item.bookingDate);
              const isCompleted = status === "Completed";
              const isSpot = item.paymentType?.toLowerCase().includes('spot');

              // Payload for Admin Verification
              const qrPayload = JSON.stringify({
                tid: item.transactionId,
                plate: item.vehicle?.vehicleId,
                slot: item.selectedSlot,
                lot: item.selectedLot?.name,
                status: isSpot ? "UNPAID" : "PAID"
              });

              return (
                <div key={item.transactionId} className={`group relative overflow-hidden transition-all duration-500 rounded-[2.5rem] flex flex-col md:flex-row border ${isCompleted ? 'bg-slate-900/20 border-white/5 opacity-40 grayscale blur-[0.5px] hover:blur-0 hover:opacity-100' : 'bg-slate-900/40 border-green-500/30 shadow-2xl shadow-green-500/10'}`}>
                  
                  {isCompleted && (
                    <button onClick={() => removeBooking(item.transactionId)} className="absolute top-6 right-6 z-20 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <X size={18} />
                    </button>
                  )}

                  <div className={`w-2 ${isCompleted ? 'bg-slate-800' : isSpot ? 'bg-amber-500' : 'bg-green-500'}`} />
                  
                  {/* QR SECTION */}
                  <div className={`p-8 flex flex-col items-center justify-center md:w-56 ${isCompleted ? 'bg-slate-800/30' : 'bg-white'}`}>
                    <div className="p-2 bg-white rounded-xl shadow-lg">
                        <QRCodeSVG 
                            value={qrPayload} 
                            size={100} 
                            level="M"
                            fgColor={isCompleted ? "#64748b" : "#020617"} 
                        />
                    </div>
                    <p className={`mt-4 text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>Verify Pass</p>
                  </div>

                  {/* INFO SECTION */}
                  <div className="flex-1 p-8">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${isCompleted ? 'bg-slate-800 text-slate-500' : isSpot ? 'bg-amber-500 text-slate-950' : 'bg-green-500 text-slate-950'}`}>
                                {isSpot && !isCompleted ? "Pay at Entrance" : status}
                            </span>
                            <span className="text-slate-600 text-[10px] font-mono">#{item.transactionId?.slice(0, 8)}</span>
                        </div>
                        <h2 className={`text-3xl font-black uppercase tracking-tighter italic ${isCompleted ? 'text-slate-500' : 'text-white'}`}>{item.selectedLot?.name}</h2>
                      </div>

                      <div className={`h-16 w-16 rounded-2xl border-2 flex flex-col items-center justify-center ${isCompleted ? 'border-slate-800 text-slate-700' : 'border-green-500/50 text-green-500'}`}>
                        <span className="text-[9px] font-black uppercase leading-none mb-1">Slot</span>
                        <span className="text-2xl font-black leading-none">{item.selectedSlot}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Date</p>
                        <p className="text-xs font-bold">{item.bookingDate}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Plate</p>
                        <p className="text-xs font-mono font-bold text-green-500 uppercase">{item.vehicle?.vehicleId}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Payment</p>
                        <div className="flex items-center gap-2">
                            {getPaymentIcon(item.paymentType)}
                            <p className="text-[10px] font-bold uppercase truncate max-w-[80px]">{item.paymentType}</p>
                        </div>
                      </div>
                      <div className="flex justify-end items-center gap-4">
                        {!isCompleted && (
                          <button onClick={() => { if(window.confirm("Cancel?")) removeBooking(item.transactionId)}} className="text-[10px] font-black uppercase text-red-500 hover:underline">Cancel</button>
                        )}
                        <button 
                            onClick={() => navigate('/booking-receipt', { state: { booking: { ...item, id: item.transactionId, lotName: item.selectedLot.name, slot: item.selectedSlot, vehicleId: item.vehicle.vehicleId, date: item.bookingDate } } })}
                            className="text-[10px] font-black uppercase text-slate-400 hover:text-green-500 flex items-center gap-1 transition-colors"
                        >
                            Pass <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default YourBookings;