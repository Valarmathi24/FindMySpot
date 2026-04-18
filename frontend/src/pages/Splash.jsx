import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/role");
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center"
      >
        <div className="relative inline-block mb-6">
          <span className="text-7xl block">🚗</span>
          {/* Animated Scanning Line */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
          />
        </div>

        <h1 className="text-5xl font-black tracking-tighter">
          Find <span className="text-green-500"> MySpot</span>
        </h1>
        <p className="text-slate-400 mt-3 font-light tracking-[0.2em] uppercase text-xs">
          Smart Urban Navigation
        </p>
      </motion.div>
      
      {/* Progress Bar Container */}
      <div className="mt-12 w-64 h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="bg-green-500 h-full shadow-[0_0_10px_#22c55e]"
        />
      </div>
    </div>
  );
}

export default Splash;