import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Printer, ArrowLeft, Home, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export default function BookingReceipt() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.booking) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <button onClick={() => navigate('/')} className="text-green-500 flex items-center gap-2 font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={18}/> No booking found. Return Home
        </button>
      </div>
    );
  }

  const { booking } = state;
  
  // ✅ FIXED LOGIC: Checking 'method' instead of 'paymentType'
  const isSpotPayment = booking.method === "Pay on Spot" || booking.paymentType === "Pay On Spot";

  const adminVerifyPayload = JSON.stringify({
    id: booking.id,
    plate: booking.vehicleId,
    slot: booking.slot,
    zone: booking.lotName,
    payment: isSpotPayment ? "UNPAID - SPOT" : "PAID - ONLINE",
    valid: true
  });

  const syncWithAdmin = async (bookingData) => {
    try {
      await fetch("http://127.0.0.1:5000/api/sync_booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
    } catch (err) { console.error("Admin Sync Failed:", err); }
  };

  const saveBookingToVault = (bookingData) => {
    const fullEmail = localStorage.getItem("userEmail") || "guest";
    const storageKey = `${fullEmail.toLowerCase()}_myBookings`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const alreadyExists = existing.some((b) => b.transactionId === bookingData.transactionId);
    if (alreadyExists) return;
    const updated = [{ ...bookingData, timestamp: new Date().toISOString() }, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  useEffect(() => {
    const formattedBooking = {
      transactionId: booking.id || "TXN_" + Date.now(),
      bookingDate: booking.date,
      selectedSlot: booking.slot,
      selectedLot: { name: booking.lotName },
      vehicle: { vehicleId: booking.vehicleId },
      paymentType: isSpotPayment ? "Pay On Spot" : "Online",
      status: isSpotPayment ? "Payment Pending" : "Paid" // ✅ Correcting status for Admin
    };
    saveBookingToVault(formattedBooking);
    syncWithAdmin(formattedBooking); 
  }, [booking, isSpotPayment]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center font-sans selection:bg-green-500/30">
      
      {/* HEADER NAVIGATION */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
         <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
         </button>
         <div className="flex items-center gap-2 text-green-500">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {isSpotPayment ? "Reservation Voucher" : "Verified Permit"}
            </span>
         </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white text-slate-950 rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        {/* TOP WARNING BANNER (ONLY FOR SPOT PAYMENT) */}
        {isSpotPayment && (
          <div className="bg-amber-500 p-3 flex items-center justify-center gap-2 animate-pulse">
            <AlertTriangle size={14} className="text-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
              Payment Pending - Pay At Entrance
            </span>
          </div>
        )}

        {/* TICKET TOP SECTION */}
        <div className={`${isSpotPayment ? 'bg-slate-900' : 'bg-green-500'} p-10 text-center text-white relative transition-colors duration-500`}>
          <CheckCircle size={40} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            {isSpotPayment ? "Booking Saved" : "Access Granted"}
          </h1>
          <p className="text-[10px] font-black uppercase opacity-80 mt-2 tracking-[0.2em]">Matrix Parking Solutions</p>
          
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#020617] rounded-full"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#020617] rounded-full"></div>
        </div>

        <div className="p-10 pt-12 space-y-8">
          
          {/* LARGE STATUS BADGE */}
          <div className="flex justify-center">
            {isSpotPayment ? (
              <div className="w-full py-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center space-y-1">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Action Required</p>
                <p className="text-xl font-black text-amber-700 uppercase italic tracking-tighter leading-none">UNPAID ENTRY</p>
              </div>
            ) : (
              <div className="w-full py-4 rounded-2xl bg-green-50 border-2 border-green-200 text-center space-y-1">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Status</p>
                <p className="text-xl font-black text-green-700 uppercase italic tracking-tighter leading-none">PAID & VERIFIED</p>
              </div>
            )}
          </div>

          {/* QR CODE FOR ADMIN VERIFICATION */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
             <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200 mb-4">
                <QRCodeSVG value={adminVerifyPayload} size={160} level="H" />
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Scan For Admin Validation</p>
          </div>

          {/* RESERVATION SPECS */}
          <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone</p>
              <p className="font-bold text-lg text-slate-900 leading-none">{booking.lotName}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bay ID</p>
              <p className="font-black text-green-600 text-3xl leading-none italic">{booking.slot}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle</p>
              <p className="font-mono font-bold text-slate-900 uppercase">{booking.vehicleId}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</p>
              <p className={`font-black text-[10px] uppercase ${isSpotPayment ? 'text-amber-600' : 'text-green-600'}`}>
                {booking.method || booking.paymentType}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 text-center">
            <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">256-Bit Encrypted Ticket • Matrix Architecture</p>
        </div>
      </motion.div>

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex flex-col gap-4 w-full max-w-md no-print">
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => window.print()} className="bg-slate-900 border border-white/10 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
               <Printer size={18} /> <span className="text-xs uppercase tracking-widest text-white">Print</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="bg-slate-900 border border-white/10 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
               <Home size={18} /> <span className="text-xs uppercase tracking-widest text-white">Home</span>
            </button>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="bg-green-500 py-6 rounded-[2rem] text-slate-950 font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-500/20 active:scale-95 transition-all text-xs"
        >
          Confirm & Exit
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .bg-white { box-shadow: none !important; }
        }
      `}} />
    </div>
  );
}