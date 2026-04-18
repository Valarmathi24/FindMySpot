import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Wallet, Smartphone, 
  ShieldCheck, Banknote, AlertCircle, CheckCircle, Clock 
} from 'lucide-react';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState('upi');

  // Guard clause if state is missing
  if (!state || !state.selectedLot) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white p-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black uppercase italic mb-2">Session Error</h2>
        <p className="text-slate-400 text-sm mb-6">No active booking session found. Your security session may have expired.</p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full bg-white text-slate-950 font-bold py-4 rounded-2xl hover:bg-green-500 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  // Destructure including the new timing data from SpotSelection
  const { vehicle, selectedLot, selectedSlot, error, duration, startTime, totalPrice } = state;

  const paymentMethods = [
    { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', icon: <Smartphone size={24} />, description: 'Redirect to secure online page' },
    { id: 'spot', name: 'Pay on Spot', icon: <Banknote size={24} />, description: 'Pay at the parking counter' },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={24} />, description: 'Visa, Mastercard, RuPay' },
    { id: 'wallet', name: 'Wallets', icon: <Wallet size={24} />, description: 'Paytm, Amazon Pay' },
  ];

  const handlePaymentAction = () => {
    const bookingId = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString();

    const newBooking = {
      id: bookingId,
      date: timestamp,
      startTime: startTime,
      duration: `${duration}H`,
      vehicleId: vehicle.vehicleId,
      vehicleType: vehicle.type,
      lotName: selectedLot.name,
      slot: selectedSlot,
      price: totalPrice, // Using calculated total
      method: method === 'spot' ? 'Pay on Spot' : method,
      status: method === 'spot' ? 'Payment Pending' : 'Paid'
    };

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existingBookings]));

    if (method === 'spot') {
      navigate('/booking-receipt', { state: { booking: newBooking } });
    } else {
      navigate('/simulated-gateway', { 
        state: { ...state, paymentMethod: method, bookingId: bookingId } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-green-500/30">
      <button 
        onClick={() => navigate(-1)} 
        className="text-slate-500 mb-8 flex items-center gap-2 uppercase text-[10px] font-black hover:text-green-500 transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Slot selection
      </button>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-400 font-bold text-xs uppercase tracking-widest">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT COLUMN: RESERVATION SUMMARY */}
        <div className="space-y-8">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter leading-none mb-2">CHECK<span className="text-green-500">OUT</span></h1>
            <p className="text-slate-500 font-medium text-sm">Review your architectural bay assignment.</p>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[3rem] shadow-2xl backdrop-blur-sm relative overflow-hidden">
            {/* Visual Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck size={120} />
            </div>

            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Booking Specs</h2>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Zone & Bay</span>
                    <p className="font-bold text-xl">{selectedLot.name} — <span className="text-green-500 italic">{selectedSlot}</span></p>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Vehicle</span>
                    <p className="font-mono text-sm font-bold bg-white/5 px-3 py-1 rounded-lg uppercase tracking-tighter">{vehicle.vehicleId}</p>
                </div>
              </div>

              {/* TIMING BREAKDOWN */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-green-500">
                        <Clock size={18} />
                    </div>
                    <div>
                        <span className="text-slate-500 text-[9px] font-black uppercase block">Arrival</span>
                        <span className="font-bold text-sm">{startTime}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-green-500">
                        <span className="font-black text-xs">{duration}H</span>
                    </div>
                    <div>
                        <span className="text-slate-500 text-[9px] font-black uppercase block">Duration</span>
                        <span className="font-bold text-sm">Hourly Stay</span>
                    </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="space-y-1">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Rate</span>
                    <p className="text-xs text-slate-400">{selectedLot.price} base</p>
                </div>
                <div className="text-right">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Grand Total</span>
                    <p className="text-5xl font-black text-green-500 tracking-tighter italic">${totalPrice}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[10px] px-6 uppercase font-black tracking-[0.2em]">
            <ShieldCheck size={18} className="text-green-500" />
            End-to-End Encrypted
          </div>
        </div>

        {/* RIGHT COLUMN: PAYMENT METHODS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Payment Engine</h2>
            <span className="h-[1px] flex-grow mx-4 bg-white/5"></span>
          </div>
          
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div 
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group
                  ${method === pm.id 
                    ? 'border-green-500 bg-green-500/5 shadow-[0_0_40px_rgba(34,197,94,0.05)]' 
                    : 'border-white/5 bg-slate-900/40 hover:border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${method === pm.id ? 'bg-green-500 text-slate-950 scale-110 shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-500'}`}>
                    {pm.icon}
                  </div>
                  <div>
                    <h3 className={`font-black uppercase text-sm tracking-tight transition-colors ${method === pm.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {pm.name}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest mt-1 group-hover:text-slate-500 transition-colors">{pm.description}</p>
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${method === pm.id ? 'border-green-500 bg-green-500/20' : 'border-slate-800'}`}>
                  {method === pm.id && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handlePaymentAction}
            className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-7 rounded-[2.5rem] mt-8 shadow-2xl shadow-green-500/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3 group"
          >
            <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
            <span className="uppercase text-lg tracking-widest">
              {method === 'spot' ? 'Finalize Booking' : `Process $${totalPrice}`}
            </span>
          </button>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Fee</p>
                <p className="text-[10px] font-bold text-white">$0.00</p>
            </div>
            <div className="p-4 border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Tax</p>
                <p className="text-[10px] font-bold text-white">Included</p>
            </div>
            <div className="p-4 border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Refund</p>
                <p className="text-[10px] font-bold text-white">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}