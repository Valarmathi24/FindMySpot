import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // Import the QR Generator
import { 
  Loader2, ShieldCheck, AlertCircle, CheckCircle2, 
  ArrowLeft, Smartphone, Lock, CreditCard, Wallet
} from 'lucide-react';

export default function SimulatedGateway() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  if (!state) return <div className="p-10 text-white text-center font-black uppercase tracking-tighter">Session Expired</div>;

  // Ensure we use totalPrice from state, fallback to selectedLot.price
  const { selectedLot, selectedSlot, vehicle, paymentMethod, totalPrice } = state;
  const displayPrice = totalPrice ? `$${totalPrice}` : selectedLot?.price;

  const [step, setStep] = useState(() => {
    if (paymentMethod === 'upi') return 'input-upi';
    if (paymentMethod === 'card') return 'input-card';
    if (paymentMethod === 'wallet') return 'input-wallet';
    return 'processing';
  });
  
  const [status, setStatus] = useState('idle'); 
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [walletPhone, setWalletPhone] = useState('');
  const [vpa, setVpa] = useState('');

  // Generate a real UPI Deep Link
  // Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=CURRENCY
  const upiPayload = `upi://pay?pa=parking.matrix@bank&pn=MatrixParking&am=${totalPrice || 0}&cu=USD`;

  const startBankProcessing = () => {
    setStep('processing');
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.05; 
      setStatus(isSuccessful ? 'success' : 'failed');
      setStep('result');
    }, 3500);
  };

  useEffect(() => {
    if (step === 'processing') startBankProcessing();
  }, [step]);

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    setCardData({ ...cardData, expiry: value });
  };

  const handleFinalize = () => {
    if (status === 'success') {
      const bookingId = `PK-${Math.floor(100000 + Math.random() * 900000)}`;
      const timestamp = new Date().toLocaleString();
      
      const newBooking = {
        id: bookingId,
        date: timestamp,
        startTime: state.startTime,
        duration: `${state.duration}H`,
        vehicleId: vehicle.vehicleId,
        lotName: selectedLot.name,
        slot: selectedSlot,
        price: totalPrice,
        status: 'Paid'
      };

      // Save to history
      const existing = JSON.parse(localStorage.getItem("userBookings") || "[]");
      localStorage.setItem("userBookings", JSON.stringify([newBooking, ...existing]));

      navigate('/booking-receipt', { state: { booking: newBooking } });
    } else {
      navigate('/payment', { state: { ...state, error: "Authentication failed. Please try again." } });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 font-sans selection:bg-green-500/30">
      <div className="w-full max-w-md bg-slate-900/40 border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* SECURE HEADER */}
        <div className="bg-slate-900 p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {step.includes('input') && (
              <button onClick={() => navigate(-1)} className="hover:text-green-500 transition-colors">
                <ArrowLeft size={20}/>
              </button>
            )}
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              {step.includes('input') ? "Payment Vault" : "Handshake"}
            </h2>
          </div>
          <Lock className="text-green-500/50" size={16} />
        </div>

        <div className="p-8 md:p-10">
          
          {/* --- UPI INTERFACE WITH ACTUAL QR --- */}
          {step === 'input-upi' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Payable Amount</p>
                <h1 className="text-6xl font-black text-white italic tracking-tighter">{displayPrice}</h1>
              </div>

              <div className="bg-slate-950/50 rounded-[2.5rem] p-8 border-2 border-dashed border-white/5 flex flex-col items-center">
                <div className="bg-white p-6 rounded-[2rem] mb-4 shadow-2xl shadow-green-500/10">
                  <QRCodeSVG 
                    value={upiPayload} 
                    size={160}
                    level="H" // High error correction
                    includeMargin={false}
                    imageSettings={{
                        src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png",
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                    }}
                  />
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Scan with GPay or PhonePe</p>
                    <p className="text-[8px] text-slate-600 uppercase mt-1 tracking-widest">Transaction is encrypted</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); startBankProcessing(); }} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter UPI ID (e.g. user@okaxis)" 
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 px-6 font-bold text-white outline-none focus:border-green-500/50 transition-all placeholder:text-slate-700" 
                  required 
                />
                <button type="submit" className="w-full bg-green-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-green-500/20 active:scale-95 transition-all">
                    Verify & Pay {displayPrice}
                </button>
              </form>
            </div>
          )}

          {/* --- WALLET INTERFACE --- */}
          {step === 'input-wallet' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
               <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Wallet Checkout</p>
                <h1 className="text-6xl font-black text-white italic tracking-tighter">{displayPrice}</h1>
              </div>
              <div className="bg-slate-950/50 rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <Wallet className="text-green-500" size={32} />
                </div>
                <p className="text-sm font-bold text-white uppercase italic">Link Your Account</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); startBankProcessing(); }} className="space-y-4">
                <input 
                  type="tel" placeholder="+91 00000 00000" maxLength="10"
                  value={walletPhone} onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 px-6 font-bold text-white outline-none focus:border-green-500/50" required 
                />
                <button type="submit" className="w-full bg-green-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em]">Link & Pay Now</button>
              </form>
            </div>
          )}

          {/* --- CARD INTERFACE --- */}
          {step === 'input-card' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border border-white/10 mb-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <CreditCard className="text-green-500" size={32} />
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Terminal</div>
                </div>
                <p className="text-sm font-mono tracking-[0.2em] text-white mb-4">
                  {cardData.number ? cardData.number.replace(/\d{4}(?=.)/g, '$& ') : '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{cardData.name || 'CARDHOLDER'}</p>
                    <p className="text-[10px] font-mono text-slate-400">{cardData.expiry || 'MM/YY'}</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); startBankProcessing(); }} className="space-y-4">
                <input type="text" placeholder="Card Number" maxLength="16" onChange={(e) => setCardData({...cardData, number: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-5 font-bold text-white outline-none focus:border-green-500/50" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" maxLength="5" value={cardData.expiry} onChange={handleExpiryChange} className="bg-slate-950/50 border border-white/10 rounded-xl py-4 px-5 font-bold text-white outline-none focus:border-green-500/50" required />
                  <input type="password" placeholder="CVV" maxLength="3" className="bg-slate-950/50 border border-white/10 rounded-xl py-4 px-5 font-bold text-white outline-none focus:border-green-500/50" required />
                </div>
                <button type="submit" className="w-full bg-green-500 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] mt-4">Process {displayPrice}</button>
              </form>
            </div>
          )}

          {/* --- ENCRYPTION ANIMATION --- */}
          {step === 'processing' && (
             <div className="text-center py-12 space-y-8 animate-in zoom-in-95">
               <Loader2 className="animate-spin text-green-500 mx-auto" size={64} />
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Encrypting</h3>
               <div className="inline-flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-full text-[10px] font-bold text-slate-600 border border-white/5">
                 <ShieldCheck size={12} className="text-green-500" /> AES-256 SECURED
               </div>
             </div>
          )}

          {/* --- FINAL RESULT --- */}
          {step === 'result' && (
            <div className="text-center space-y-10 animate-in zoom-in-90">
              {status === 'success' ? (
                <>
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <CheckCircle2 className="text-green-500" size={56} />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Verified</h3>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <AlertCircle className="text-red-500" size={56} />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Declined</h3>
                </>
              )}
              <button onClick={handleFinalize} className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all ${status === 'success' ? 'bg-green-500 text-slate-950 shadow-green-500/20' : 'bg-red-600 text-white shadow-red-600/20'}`}>
                {status === 'success' ? 'Issue Permit' : 'Retry Verification'}
              </button>
            </div>
          )}
        </div>
        
        {/* COMPLIANCE FOOTER */}
        <div className="bg-slate-950/50 p-6 border-t border-white/5 flex justify-center items-center gap-4 opacity-30 grayscale">
            <Smartphone className="h-4 text-white" />
            <div className="w-px h-3 bg-white/20"></div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-3 invert" />
            <div className="w-px h-3 bg-white/20"></div>
            <span className="text-[8px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
        </div>
      </div>
    </div>
  );
}