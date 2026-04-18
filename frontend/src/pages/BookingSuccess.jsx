import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, QrCode, Download, Calendar, Clock, ShoppingBag } from 'lucide-react';

export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      // --- EXISTING LOCALSTORAGE LOGIC ---
      const existingBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      const isAlreadySaved = existingBookings.some(b => b.transactionId === state.transactionId);
      
      const newBooking = {
        ...state,
        timestamp: new Date().toISOString(),
        bookingDate: new Date().toLocaleDateString('en-US', { 
          month: 'long', day: 'numeric', year: 'numeric' 
        }),
        status: 'Active'
      };

      if (!isAlreadySaved) {
        localStorage.setItem("myBookings", JSON.stringify([newBooking, ...existingBookings]));

        // --- NEW: SYNC TO ADMIN DB (POST REQUEST) ---
        fetch("http://127.0.0.1:5000/api/sync_booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBooking),
        })
        .then(res => res.json())
        .catch(err => console.error("Admin Sync Error:", err));
      }
    }
  }, [state]);

  if (!state) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
      <button onClick={() => navigate('/dashboard')} className="bg-green-500 p-4 rounded-xl font-bold">Return to Dashboard</button>
    </div>
  );

  const { vehicle, selectedLot, selectedSlot, transactionId } = state;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
        <Check size={40} className="text-slate-900 stroke-[3px]" />
      </div>

      <h1 className="text-3xl font-black mb-2 italic tracking-tighter uppercase">Booking Confirmed!</h1>
      <p className="text-slate-400 mb-10">Show this QR at the entrance</p>

      {/* TICKET CARD */}
      <div className="w-full max-w-sm bg-white text-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="p-8 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone</p>
              <h2 className="text-xl font-bold">{selectedLot.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slot</p>
              <h2 className="text-4xl font-black text-green-600 leading-none">{selectedSlot}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-slate-100 pt-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={10}/> Date</p>
              <p className="font-bold text-sm">March 27, 2026</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> Expiry</p>
              <p className="font-bold text-sm">11:59 PM</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Registration</p>
              <p className="font-mono font-bold text-lg text-green-600">{vehicle.vehicleId}</p>
            </div>
          </div>
        </div>

        {/* PERFORATED LINE */}
        <div className="relative h-4 flex items-center justify-center">
            <div className="absolute left-[-10px] w-5 h-5 bg-[#0f172a] rounded-full"></div>
            <div className="absolute right-[-10px] w-5 h-5 bg-[#0f172a] rounded-full"></div>
            <div className="w-full border-t-2 border-dashed border-slate-200 mx-4"></div>
        </div>

        <div className="p-8 pt-4 flex flex-col items-center bg-slate-50">
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-4">
            <QrCode size={120} className="text-slate-900" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction: {transactionId?.slice(0,8)}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-10 w-full max-w-sm">
        <button onClick={() => window.print()} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm">
          <Download size={18} /> SAVE
        </button>
        <button onClick={() => navigate('/your-bookings')} className="flex-1 bg-green-500 hover:bg-green-400 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm">
          <ShoppingBag size={18} /> MY VAULT
        </button>
      </div>
    </div>
  );
}