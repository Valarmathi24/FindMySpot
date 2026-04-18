import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// Standard icons for auth providers
import { FcGoogle } from "react-icons/fc"; 
import { FaGithub, FaMicrosoft } from "react-icons/fa";

function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role })
    });
    
    const data = await res.json();
    if (data.success) {
      alert("Account created!");
      navigate(`/login/${role}`);
    } else {
      alert(data.message || "Signup failed");
    }
  };

  // Generic handler for Social Auth
 const handleSocialSignup = (provider) => {
  const urls = {
    google: "https://accounts.google.com/signin",
    microsoft: "https://login.live.com/",
    github: "https://github.com/login"
  };

  const targetUrl = urls[provider];

  if (targetUrl) {
    // This sends the user away from your app to the provider
    window.location.href = targetUrl;
  }
};
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              Join <span className="text-green-500">Us</span>
            </h2>
            <p className="text-slate-400 mt-2 text-xs md:text-sm">Sign up as {role}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white text-sm focus:border-green-500 outline-none transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white text-sm focus:border-green-500 outline-none transition-all"
            />
            <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
              Create Account
            </button>
          </form>

          {/* --- MODERN DIVIDER --- */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700/50"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121a2e] px-3 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* --- MULTI-PROVIDER BUTTONS --- */}
          <div className="grid grid-cols-3 gap-3">
            <SocialButton onClick={() => handleSocialSignup('google')} icon={<FcGoogle />} />
            <SocialButton onClick={() => handleSocialSignup('microsoft')} icon={<FaMicrosoft className="text-blue-400" />} />
            <SocialButton onClick={() => handleSocialSignup('github')} icon={<FaGithub className="text-white" />} />
          </div>
          
          <p className="text-center text-slate-400 text-xs mt-8">
            Already have an account? <button onClick={() => navigate(`/login/${role}`)} className="text-green-500 font-bold hover:underline">Log In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Social Button Component
const SocialButton = ({ icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-90 text-xl"
  >
    {icon}
  </button>
);

export default Signup;