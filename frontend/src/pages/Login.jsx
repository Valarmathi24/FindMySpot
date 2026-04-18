import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: role })
      });

      const data = await res.json();

      if (data.success) {
        const emailKey = form.email.toLowerCase();
        localStorage.setItem("userEmail", emailKey);
        localStorage.setItem("userRole", role);

        // --- PERSISTENCE LOGIC ---
        // Check if this specific email already has a stored profile
        const existingData = localStorage.getItem(`profile_${emailKey}`);
        
        if (!existingData) {
          // If brand new user, initialize their specific storage slot
          const newProfile = {
            name: emailKey.split('@')[0],
            phone: '',
            dob: '',
            gender: '',
            state: '',
            profilePic: null,
            vehicleId: '',
            vehicleType: 'car'
          };
          localStorage.setItem(`profile_${emailKey}`, JSON.stringify(newProfile));
        }

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[120px]" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">WELCOME <span className="text-green-500">BACK</span></h2>
            <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest">{role} Portal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" 
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white outline-none focus:border-green-500 transition-all" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" 
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white outline-none focus:border-green-500 transition-all" required />
            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-4 rounded-xl transition-all uppercase tracking-wider">
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-400 text-sm">New? <Link to={`/signup/${role}`} className="text-green-500 font-bold underline">Create Account</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export default Login;