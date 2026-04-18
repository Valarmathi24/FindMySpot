import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function RoleSelect() {
  const navigate = useNavigate();

  const Card = ({ title, icon, role, desc }) => (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/login/${role}`)}
      className="group relative cursor-pointer w-full md:w-72"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl text-center h-full flex flex-col items-center shadow-2xl">
        <div className="text-5xl md:text-6xl mb-4 md:mb-6 bg-slate-800 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl group-hover:bg-green-500/10 transition-all">
          {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light line-clamp-3">
          {desc}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 md:mb-16 z-10"
      >
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">
          Select <span className="text-green-500 italic">Access</span>
        </h2>
        <div className="h-1 w-12 bg-green-500 mx-auto rounded-full" />
      </motion.div>

      {/* Grid: 1 column on mobile, 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 z-10 w-full max-w-2xl">
        <Card 
          title="User" 
          icon="👤" 
          role="user" 
          desc="Locate nearby parking, check real-time availability, and secure your spot."
        />
        <Card 
          title="Admin" 
          icon="🛡️" 
          role="admin" 
          desc="Manage slot data, monitor occupancy levels, and export system reports."
        />
      </div>
    </div>
  );
}

export default RoleSelect;