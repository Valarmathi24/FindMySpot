import React, { useState } from 'react';
import { 
  Truck, MapPin, AlertTriangle, Zap, PhoneCall, 
  ChevronRight, Loader2, CheckCircle2, Navigation,
  Star, ShieldCheck, MessageCircle, UserSearch, Search, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VENDOR_DATABASE = {
  towing: [
    { id: 1, name: "Alex 'The Hauler' Rivera", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200", vehicle: "RAM 5500 Flatbed", rating: 4.9, cost: "85.00", phone: "+15550109920" },
    { id: 2, name: "Marcus Knight", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", vehicle: "Ford F-650 Tow", rating: 4.7, cost: "75.00", phone: "+15550108833" },
    { id: 3, name: "Big Ben Towing", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", vehicle: "GMC Sierra 3500", rating: 4.5, cost: "70.00", phone: "+15550107744" },
    { id: 4, name: "Elite Recovery", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", vehicle: "International MV", rating: 4.8, cost: "95.00", phone: "+15550106655" }
  ],
  jumpstart: [
    { id: 5, name: "Sarah Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", vehicle: "Service Van", rating: 4.8, cost: "45.00", phone: "+15550104412" },
    { id: 6, name: "Mike Ross", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200", vehicle: "Rapid Moto", rating: 4.6, cost: "35.00", phone: "+15550102211" },
    { id: 7, name: "Voltage Pros", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200", vehicle: "EV Support Unit", rating: 4.9, cost: "55.00", phone: "+15550101199" },
    { id: 8, name: "Quick Spark", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", vehicle: "Compact Assist", rating: 4.4, cost: "30.00", phone: "+15550100088" }
  ]
};

const Services = () => {
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false); // New state for location fetch
  const [showVendors, setShowVendors] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle'); 
  const [serviceType, setServiceType] = useState('towing'); 
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({ location: '', vehicle: '' });

  // --- NEW: GEOLOCATION LOGIC ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, you'd use a Reverse Geocoding API here (like Google Maps or Nominatim)
        // For now, we will set the Coordinates.
        setFormData(prev => ({ 
          ...prev, 
          location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` 
        }));
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        alert("Unable to retrieve your location. Please type it manually.");
      }
    );
  };

  const handleSearchVendors = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowVendors(true);
    }, 2000);
  };

  const handleFinalConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBookingStatus('confirmed');
    }, 2000);
  };

  if (bookingStatus === 'confirmed') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] w-full max-w-md shadow-2xl">
          <CheckCircle2 size={50} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white text-center uppercase italic">On The Way!</h2>
          <p className="text-center text-slate-500 text-xs mt-2 mb-6 uppercase tracking-widest font-bold">Total Service Fee: <span className="text-green-500">₹{selectedDriver.cost}</span></p>
          
          <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-white/5 mb-6">
            <div className="flex items-center gap-4">
              <img src={selectedDriver.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-green-500" />
              <div>
                <p className="text-white font-bold">{selectedDriver.name}</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{selectedDriver.vehicle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <a href={`tel:${selectedDriver.phone}`} className="bg-green-500 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 no-underline uppercase text-sm"><PhoneCall size={18} /> Call</a>
            <a href={`sms:${selectedDriver.phone}`} className="bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 no-underline uppercase text-sm"><MessageCircle size={18} /> Chat</a>
          </div>
          <button onClick={() => window.location.reload()} className="w-full text-slate-600 text-[10px] font-black uppercase tracking-widest">Cancel Assistance</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 px-6">
      <main className="max-w-4xl mx-auto pt-12 md:pt-20">
        
        <div className="mb-12">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2 mb-4 block">Select Rescue Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => { setServiceType('towing'); setShowVendors(false); }} 
              className={`flex flex-col items-center gap-3 py-8 rounded-[2.5rem] border-2 transition-all ${serviceType === 'towing' ? 'border-green-500 bg-green-500/10 text-white shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-800 text-slate-500 bg-slate-900/40'}`}
            >
              <Truck size={32} />
              <span className="font-black uppercase italic tracking-tighter">Towing</span>
            </button>
            <button 
              type="button" 
              onClick={() => { setServiceType('jumpstart'); setShowVendors(false); }} 
              className={`flex flex-col items-center gap-3 py-8 rounded-[2.5rem] border-2 transition-all ${serviceType === 'jumpstart' ? 'border-green-500 bg-green-500/10 text-white shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-800 text-slate-500 bg-slate-900/40'}`}
            >
              <Zap size={32} />
              <span className="font-black uppercase italic tracking-tighter">Jumpstart</span>
            </button>
          </div>
        </div>

        {!showVendors && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl mb-12">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-white uppercase italic mb-2">Vehicle <span className="text-green-500">Details.</span></h2>
              <p className="text-slate-500 text-sm font-medium">Verify your current location and vehicle ID to continue.</p>
            </header>

            <form onSubmit={handleSearchVendors} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2">Current Location</label>
                  <div className="relative">
                    {/* UPDATED: Clickable Icon for Geolocation */}
                    <button 
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locating}
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500 hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 z-10"
                    >
                      {locating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                    </button>
                    <input 
                      type="text" 
                      required 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})} 
                      placeholder={locating ? "Locating..." : "Tap pin to detect location..."} 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl py-6 pl-16 pr-8 text-white focus:border-green-500/50 outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] ml-2">Vehicle Plate No.</label>
                  <input type="text" required value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} placeholder="TN 01 AB 1234" className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl py-6 px-8 text-white focus:border-green-500/50 outline-none transition-all uppercase font-mono tracking-widest" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-6 rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={24} /> : <><Search size={22} /> <span className="uppercase text-lg tracking-tight">Search Nearby Mechanics</span></>}
              </button>
            </form>
          </motion.div>
        )}

        {showVendors && !bookingStatus.includes('confirmed') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-white uppercase italic">Active {serviceType} Units</h2>
              <button onClick={() => setShowVendors(false)} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white uppercase font-bold tracking-widest transition-colors">
                <ArrowLeft size={14} /> Back to details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VENDOR_DATABASE[serviceType].map((vendor) => (
                <button key={vendor.id} onClick={() => setSelectedDriver(vendor)}
                  className={`flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all ${selectedDriver?.id === vendor.id ? 'border-green-500 bg-green-500/5' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}>
                  <div className="flex items-center gap-4">
                    <img src={vendor.image} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                    <div className="text-left">
                      <p className="text-white font-bold">{vendor.name}</p>
                      <div className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="currentColor" /> <span className="text-xs font-bold">{vendor.rating}</span></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-black text-lg">₹{vendor.cost}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Flat Fee</p>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={handleFinalConfirm} disabled={!selectedDriver || loading}
              className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-6 rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><ShieldCheck size={24} /> <span className="uppercase text-lg tracking-tight">Confirm & Dispatch</span></>}
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Services;