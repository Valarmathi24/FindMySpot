import React, { useState, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, Globe, CheckCircle, ArrowLeft, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser'; // Import EmailJS

export default function ContactUs() {
  const navigate = useNavigate();
  const formRef = useRef(); // Ref to grab form data
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // PASTE YOUR ACTUAL KEYS HERE:
    const SERVICE_ID = "service_xxxxxxx"; // e.g., service_a1b2c3d
    const TEMPLATE_ID = "template_xxxxxxx"; // e.g., template_z9y8x7w
    const PUBLIC_KEY = "xxxxxxxxxxxxxxxxx"; // e.g., user_abc123... or your newer Public Key

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
          setSubmitted(true);
          setLoading(false);
      }, (error) => {
          // This is where your error was logging
          console.log("Failed to send:", error.text);
          alert("Check your EmailJS Keys in the code!");
          setLoading(false);
      });
  };
  const contactInfo = [
    {
      icon: <Phone className="text-green-500" />,
      title: "24/7 Support",
      detail: "+1 (555) 000-PARK",
      desc: "For immediate parking assistance"
    },
    {
      icon: <Mail className="text-green-500" />,
      title: "Email Us",
      detail: "support@findmyspot.com",
      desc: "Response within 2 hours"
    },
    {
      icon: <MapPin className="text-green-500" />,
      title: "Main Office",
      detail: "123 Tech Park Drive",
      desc: "Silicon Valley, CA 94025"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-green-500/30 pb-12">
      
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-green-500 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <span className="font-black tracking-tighter text-xl uppercase italic text-white">
          Find<span className="text-green-500"> MySpot</span>
        </span>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase italic"
          >
            Get In <span className="text-green-500">Touch.</span>
          </motion.h1>
          <p className="text-slate-500 mt-4 font-medium tracking-wide max-w-xl mx-auto">
            Your message will be routed directly to our administration team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl hover:border-green-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white uppercase text-sm tracking-widest">{item.title}</h3>
                <p className="text-green-400 font-black mt-1">{item.detail}</p>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {submitted ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={40} className="text-slate-950" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Transmission Successful</h2>
                  <p className="text-slate-500 max-w-xs mx-auto">Valarmathi has received your inquiry. Stand by for a response.</p>
                  <button onClick={() => setSubmitted(false)} className="text-green-500 font-bold uppercase text-xs tracking-widest hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                      <input 
                        name="user_name" // Ensure this matches your EmailJS template
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-green-500/50 transition-all text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                      <input 
                        name="user_email" // Ensure this matches your EmailJS template
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-green-500/50 transition-all text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Subject</label>
                    <select name="subject" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-green-500/50 transition-all text-slate-300">
                      <option>General Inquiry</option>
                      <option>Booking Issue</option>
                      <option>Payment/Refund</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Your Message</label>
                    <textarea 
                      name="message" // Ensure this matches your EmailJS template
                      required
                      rows="5"
                      placeholder="Tell us how we can help..."
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl py-4 px-6 outline-none focus:border-green-500/50 transition-all text-white resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    <span className="uppercase text-lg">{loading ? "Sending..." : "Transmit Message"}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 pt-10 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          &copy; 2026 FindMySpot Integrated Systems.
        </p>
      </footer>
    </div>
  );
}