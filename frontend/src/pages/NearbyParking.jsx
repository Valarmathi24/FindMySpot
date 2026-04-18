import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';

const DISTRICT_DATABASE = {
  salem: [
    { id: 'S1', name: "Salem Grand Mall", distance: "0.4 km", price: "₹20/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3,4], blocked: ['A2', 'C3'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'S2', name: "Fairlands Multi-Level", distance: "1.2 km", price: "₹25/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3,4], blocked: ['B1', 'B2', 'D4'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'S3', name: "Salem Junction North", distance: "2.1 km", price: "₹15/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3,4], blocked: ['A1', 'A4'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'S4', name: "New Bus Stand Zone", distance: "0.8 km", price: "₹30/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3,4], blocked: ['C1', 'C2', 'C3'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'S5', name: "Steel Plant Road Lot", distance: "3.5 km", price: "₹10/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3,4], blocked: ['D1'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}}
  ],
  namakkal: [
    { id: 'N1', name: "Anjaneyar Temple Zone", distance: "0.2 km", price: "₹15/hr", layout: { rows: ['A','B','C'], cols: [1,2,3,4], blocked: ['B2'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'N2', name: "Namakkal Fort Park", distance: "0.7 km", price: "₹10/hr", layout: { rows: ['A','B','C'], cols: [1,2,3,4], blocked: ['A1', 'C4'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'N3', name: "Tiruchengode Road Lot", distance: "1.5 km", price: "₹20/hr", layout: { rows: ['A','B','C'], cols: [1,2,3,4], blocked: ['B3', 'B4'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'N4', name: "Paramathi Plaza", distance: "2.2 km", price: "₹15/hr", layout: { rows: ['A','B','C'], cols: [1,2,3,4], blocked: ['A3'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'N5', name: "Salem Highway Rest", distance: "4.0 km", price: "₹10/hr", layout: { rows: ['A','B','C'], cols: [1,2,3,4], blocked: ['C2'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}}
  ],
  erode: [
    { id: 'E1', name: "Erode Central Market", distance: "0.3 km", price: "₹25/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3], blocked: ['A1', 'B2'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'E2', name: "Cauvery Bridge Spot", distance: "1.1 km", price: "₹15/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3], blocked: ['C1', 'C3'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'E3', name: "PS Park Complex", distance: "0.9 km", price: "₹30/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3], blocked: ['D2'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'E4', name: "Erode Junction South", distance: "1.8 km", price: "₹20/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3], blocked: ['A3', 'B1'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}},
    { id: 'E5', name: "Texvalley Mega Lot", distance: "5.5 km", price: "₹40/hr", layout: { rows: ['A','B','C','D'], cols: [1,2,3], blocked: ['B2', 'B3'], config: { gap: 'gap-4', padding: 'p-10', slotSize: 'h-24' }}}
  ],
  dharmapuri: [
    { id: 'D1', name: "Dharmapuri Main Road", distance: "0.4 km", price: "₹15/hr", layout: { rows: ['A','B','C','D'], cols: [1,2], blocked: ['A1', 'C2'], config: { gap: 'gap-8', padding: 'p-16', slotSize: 'h-32' }}},
    { id: 'D2', name: "Hogenakkal Gateway", distance: "1.2 km", price: "₹20/hr", layout: { rows: ['A','B','C','D'], cols: [1,2], blocked: ['B2'], config: { gap: 'gap-8', padding: 'p-16', slotSize: 'h-32' }}},
    { id: 'D3', name: "Collectrate Zone", distance: "0.8 km", price: "₹10/hr", layout: { rows: ['A','B','C','D'], cols: [1,2], blocked: ['D1'], config: { gap: 'gap-8', padding: 'p-16', slotSize: 'h-32' }}},
    { id: 'D4', name: "Dharmapuri Station", distance: "1.5 km", price: "₹15/hr", layout: { rows: ['A','B','C','D'], cols: [1,2], blocked: ['B1', 'B2'], config: { gap: 'gap-8', padding: 'p-16', slotSize: 'h-32' }}},
    { id: 'D5', name: "Silk Farm Lot", distance: "3.2 km", price: "₹10/hr", layout: { rows: ['A','B','C','D'], cols: [1,2], blocked: ['C1'], config: { gap: 'gap-8', padding: 'p-16', slotSize: 'h-32' }}}
  ]
};

export default function NearbyParking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userQuery = state?.vehicle?.destination?.toLowerCase() || "";

  // 1. Dynamic Spot Selection Logic
  const { spots } = useMemo(() => {
    if (userQuery.includes("salem")) return { spots: DISTRICT_DATABASE.salem };
    if (userQuery.includes("namakkal")) return { spots: DISTRICT_DATABASE.namakkal };
    if (userQuery.includes("erode")) return { spots: DISTRICT_DATABASE.erode };
    if (userQuery.includes("dharmapuri")) return { spots: DISTRICT_DATABASE.dharmapuri };
    
    // Fallback if no match
    return { spots: DISTRICT_DATABASE.salem }; 
  }, [userQuery]);

  const handleSelect = (lot) => {
    navigate(`/spot-selection/${lot.id}`, { state: { ...state, selectedLot: lot } });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-green-500 font-black uppercase tracking-widest text-[10px]">
            Live Availability
          </h2>
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
          Parking <span className="text-green-500">Hub</span>
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Found {spots.length} secure zones near your location.
        </p>
      </header>

      <div className="grid gap-6 max-w-2xl">
        {spots.map((lot) => (
          <div 
            key={lot.id} 
            onClick={() => handleSelect(lot)} 
            className="group relative overflow-hidden bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-green-500/50 hover:bg-slate-800/60 transition-all cursor-pointer shadow-2xl"
          >
            {/* Design Element */}
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-all" />
            
            <div className="flex items-center gap-6">
              <div className="bg-slate-800 p-5 rounded-2xl text-slate-400 group-hover:bg-green-500 group-hover:text-slate-900 transition-all shadow-xl">
                <Navigation size={28}/>
              </div>
              <div>
                <h3 className="font-black text-xl group-hover:text-green-400 transition-colors uppercase italic">
                  {lot.name}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-bold">
                    <MapPin size={12} className="text-green-500"/> {lot.distance}
                  </p>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                    {lot.layout.rows.length}x{lot.layout.cols.length} Grid
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-white group-hover:scale-110 transition-transform">
                {lot.price}
              </p>
              <ArrowRight size={24} className="text-slate-700 group-hover:text-green-500 ml-auto mt-2 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}