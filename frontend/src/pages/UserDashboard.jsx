import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, Car, Bike, Truck, CheckCircle, 
  Save, LogOut, Loader2, ShoppingBag, Home, Settings, User, Camera, Calendar, Phone, Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // 1. Get current user's identity
  const fullEmail = localStorage.getItem("userEmail") || "User@guest.com";
  const userPrefix = fullEmail.toLowerCase(); // Use this to prefix all keys

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [isPlateValid, setIsPlateValid] = useState(true);
  
  const vehicleRegex = /^[A-Z]{2}\s[0-9]{2}\s[A-Z]{1,2}\s[0-9]{4}$/;

  // 2. Updated State: Pulls from User-Specific keys
  const [userData, setUserData] = useState({
    name: localStorage.getItem(`${userPrefix}_userName`) || fullEmail.split('@')[0],
    phone: localStorage.getItem(`${userPrefix}_userPhone`) || '',
    dob: localStorage.getItem(`${userPrefix}_userDob`) || '',
    gender: localStorage.getItem(`${userPrefix}_userGender`) || '',
    state: localStorage.getItem(`${userPrefix}_userState`) || '',
    profilePic: localStorage.getItem(`${userPrefix}_userPic`) || null
  });

  const [vehicleData, setVehicleData] = useState({
    type: localStorage.getItem(`${userPrefix}_prefType`) || 'car',
    vehicleId: localStorage.getItem(`${userPrefix}_prefId`) || '',
    destination: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Save Logic: Writes to User-Specific keys
  const handleSaveProfile = () => {
    localStorage.setItem(`${userPrefix}_userName`, userData.name);
    localStorage.setItem(`${userPrefix}_userPhone`, userData.phone);
    localStorage.setItem(`${userPrefix}_userDob`, userData.dob);
    localStorage.setItem(`${userPrefix}_userGender`, userData.gender);
    localStorage.setItem(`${userPrefix}_userState`, userData.state);
    localStorage.setItem(`${userPrefix}_userPic`, userData.profilePic);
    localStorage.setItem(`${userPrefix}_prefId`, vehicleData.vehicleId);
    localStorage.setItem(`${userPrefix}_prefType`, vehicleData.type);
    
    alert(`Profile saved for ${fullEmail}`);
    setShowProfileModal(false);
  };

  // 4. Logout Logic: Only removes "Session" keys, keeps profile data safe
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate('/');
  };

  const handlePlateChange = (e) => {
    const val = e.target.value.toUpperCase();
    setVehicleData({ ...vehicleData, vehicleId: val });
    setIsPlateValid(val === "" || vehicleRegex.test(val));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setVehicleData(prev => ({ ...prev, destination: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` }));
        setFetchingLocation(false);
      },
      () => {
        setFetchingLocation(false);
        alert("Unable to retrieve location.");
      }
    );
  };

  const handleConfirm = (e) => { 
    e.preventDefault();
    if (!vehicleRegex.test(vehicleData.vehicleId)) {
      alert("Please enter a valid Plate Number");
      setIsPlateValid(false);
      return;
    }
    navigate(`/nearby-parking`, { state: { vehicle: vehicleData } });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-green-500/30 pb-24 md:pb-0">
      
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
              <Car size={20} className="text-slate-900" />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase italic text-white">
              Find<span className="text-green-500"> MySpot</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/')} className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${location.pathname === '/' ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}>
              <Home size={14} /> Home
            </button>
            <button onClick={() => navigate('/services')} className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${location.pathname === '/services' ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}>
              <Settings size={14} /> Services
            </button>
             <button onClick={() => navigate('/contact-us')} className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${location.pathname === '/services' ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}>
              <Settings size={14} /> Contact Us
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
         <button 
  onClick={() => navigate('/your-bookings')} 
  className="p-2.5 rounded-2xl bg-slate-800/40 border border-white/5 text-slate-400 hover:text-green-500 transition-all group"
>
  <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
</button>

          <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700/50 p-1 pr-4 rounded-full border border-white/10 transition-all active:scale-95">
            {userData.profilePic ? (
              <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-slate-900 font-bold uppercase">
                {userData.name[0]}
              </div>
            )}
            <span className="text-sm font-bold hidden sm:block">{userData.name}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 pt-12 md:pt-20">
        <header className="mb-12 text-center md:text-left">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight uppercase">
            Park <span className="text-green-500">Smarter.</span>
          </motion.h1>
          <p className="text-slate-500 mt-4 font-medium tracking-wide">Enter your details to find the perfect spot.</p>
        </header>

        <div className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleConfirm} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Vehicle Class</label>
              <div className="grid grid-cols-3 gap-4">
                {[{ id: 'bike', icon: <Bike size={24}/> }, { id: 'car', icon: <Car size={24}/> }, { id: 'truck', icon: <Truck size={24}/> }].map((item) => (
                  <button key={item.id} type="button" onClick={() => setVehicleData({...vehicleData, type: item.id})} className={`py-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${vehicleData.type === item.id ? 'border-green-500 bg-green-500/5 text-green-400' : 'border-slate-800 bg-slate-800/30 text-slate-500 hover:border-slate-700'}`}>
                    {item.icon}
                    <span className="text-xs font-bold uppercase">{item.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Plate Number</label>
                  {!isPlateValid && vehicleData.vehicleId !== "" && <span className="text-[10px] font-bold text-red-500 uppercase">Invalid Format</span>}
                </div>
                <input type="text" value={vehicleData.vehicleId} placeholder="TN 01 AB 1234" maxLength={13} className={`w-full bg-slate-950/50 border rounded-2xl py-4.5 px-6 outline-none font-mono transition-all ${isPlateValid ? 'border-slate-800 text-green-400 focus:border-green-500/50' : 'border-red-500/50 text-red-400'}`} onChange={handlePlateChange} required />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Destination</label>
                <div className="relative">
                  <button type="button" onClick={handleGetLocation} disabled={fetchingLocation} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-slate-500 hover:text-green-500">
                    {fetchingLocation ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                  </button>
                  <input type="text" value={vehicleData.destination} placeholder="Search area..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4.5 pl-14 pr-6 focus:border-green-500/50 outline-none transition-all" onChange={(e) => setVehicleData({...vehicleData, destination: e.target.value})} required />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              <CheckCircle size={24} /> 
              <span className="uppercase text-lg">Secure a Spot</span>
            </button>
          </form>
        </div>
      </main>

      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowProfileModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-green-500/20">
                    {userData.profilePic ? <img src={userData.profilePic} alt="User" className="w-full h-full object-cover" /> : <span className="text-4xl font-black text-green-500">{userData.name[0]}</span>}
                  </div>
                  <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full text-slate-950 hover:scale-110 transition-all"><Camera size={16} /></button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <h3 className="text-2xl font-bold text-white mt-4 uppercase italic tracking-tight">{userData.name}</h3>
                <p className="text-slate-500 text-sm">{fullEmail}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500/50 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="tel" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500/50 text-sm" placeholder="+91 00000 00000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date of Birth</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="date" value={userData.dob} onChange={(e) => setUserData({...userData, dob: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500/50 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender</label>
                  <select value={userData.gender} onChange={(e) => setUserData({...userData, gender: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-green-500/50 text-sm text-slate-300">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">State / Region</label>
                  <div className="relative">
                    <Map size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" value={userData.state} onChange={(e) => setUserData({...userData, state: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500/50 text-sm" placeholder="e.g. Tamil Nadu" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleSaveProfile} className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20">
                  <Save size={18} /> Update Profile
                </button>
                <button onClick={handleLogout} className="w-full text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all">
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}