import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CarFront, Info, Grid3X3, Clock } from 'lucide-react';

export default function SpotSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 1. Initial State Hooks
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(1);
  
  // Corrected Time Formatting
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ":" + 
           now.getMinutes().toString().padStart(2, '0');
  });

  // Session Guard
  if (!state || !state.selectedLot) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="p-10 text-white text-center font-black border border-red-500/20 rounded-3xl bg-red-500/5">
          SESSION ERROR: NO DATA FOUND
        </div>
      </div>
    );
  }

  const { vehicle, selectedLot } = state;

  // 2. Layout Extraction
  const rows = selectedLot.layout?.rows || ['A', 'B'];
  const cols = selectedLot.layout?.cols || [1, 2, 3];
  const blocked = selectedLot.layout?.blocked || [];
  const style = selectedLot.layout?.config || { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' };

  // 3. Price Calculation Logic
  const hourlyRate = parseFloat(selectedLot.price?.replace(/[^0-9.]/g, '')) || 0;
  const totalPrice = (hourlyRate * duration).toFixed(2);

  const handleConfirm = () => {
    navigate('/payment', { 
      state: { 
        ...state, 
        selectedSlot, 
        duration, 
        startTime,
        totalPrice 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-12 font-sans selection:bg-green-500 selection:text-black">
      {/* NAVIGATION HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-500 flex items-center gap-2 uppercase text-[10px] font-black hover:text-green-500 transition-all"
        >
          <ArrowLeft size={16}/> Back to Areas
        </button>
        <div className="bg-slate-900 px-5 py-2 rounded-full border border-white/5 flex items-center gap-3">
           <Grid3X3 size={14} className="text-green-500" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
             Matrix: {rows.length}x{cols.length}
           </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <header className="mb-10">
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              Assign <span className="text-green-500">Bay</span>
            </h1>
            <p className="text-slate-500 text-sm mt-4 font-medium flex items-center gap-2 italic">
              <Info size={14} /> Architecture view of {selectedLot.name}.
            </p>
          </header>

          {/* DYNAMIC MATRIX CONTAINER */}
          <div className={`bg-slate-900/40 border border-white/10 ${style.padding} rounded-[3rem] shadow-2xl overflow-x-auto`}>
            <div 
              className={`grid ${style.gap} mx-auto`}
              style={{ 
                gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
                maxWidth: cols.length < 3 ? '450px' : '850px'
              }}
            >
              {rows.map(row => (
                cols.map(col => {
                  const id = `${row}${col}`;
                  const isTaken = blocked.includes(id);

                  return (
                    <button 
                      key={id} 
                      disabled={isTaken} 
                      onClick={() => setSelectedSlot(id)}
                      className={`relative ${style.slotSize} rounded-2xl font-black transition-all border-2 flex flex-col items-center justify-center
                      ${isTaken 
                        ? 'bg-slate-950 border-transparent text-slate-900 cursor-not-allowed opacity-20' 
                        : selectedSlot === id 
                        ? 'bg-green-500 border-green-400 text-slate-950 scale-105 shadow-2xl shadow-green-500/40 z-10' 
                        : 'bg-slate-800/40 border-slate-700/50 hover:border-green-500/50 text-slate-50 text-opacity-40 hover:text-opacity-100'}`}
                    >
                      <span className="text-[9px] uppercase opacity-30 absolute top-2">{row}</span>
                      <span className="text-2xl tracking-tighter">{col}</span>
                      {isTaken && <CarFront size={14} className="absolute bottom-2 opacity-10" />}
                    </button>
                  );
                })
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] sticky top-10 text-center">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Selected Slot</span>
            <div className="text-9xl font-black italic text-white tracking-tighter leading-none my-8">
              {selectedSlot || '--'}
            </div>
            
            <div className="space-y-4 py-8 border-y border-white/5 mb-8 text-left">
                {/* Plate Info */}
                <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-600 text-[9px]">Vehicle Plate</span>
                    <span className="text-white font-mono">{vehicle.vehicleId}</span>
                </div>

                {/* Start Time Input */}
                <div className="space-y-2 pt-2">
                  <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Arrival Time</span>
                  <div className="relative">
                    <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Duration Stepper */}
                <div className="space-y-2 pt-2">
                  <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Duration (Hours)</span>
                  <div className="flex items-center justify-between bg-slate-950 border border-white/5 p-1 rounded-xl">
                    <button 
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all text-sm font-bold"
                    >-</button>
                    <span className="text-sm font-black italic">{duration}H</span>
                    <button 
                      onClick={() => setDuration(duration + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-green-500 hover:text-slate-950 transition-all text-sm font-bold"
                    >+</button>
                  </div>
                </div>

                {/* Final Rate */}
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-slate-600 text-[9px] font-black uppercase">Total Due</span>
                    <span className="text-2xl font-black text-green-500">${totalPrice}</span>
                </div>
            </div>

            <button 
              disabled={!selectedSlot} 
              onClick={handleConfirm}
              className="w-full bg-green-500 text-slate-950 py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-green-500/20 active:scale-95 transition-all disabled:opacity-10 disabled:grayscale"
            >
              Continue to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}