import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (e) { setError(e); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center p-4 font-sans py-10">
      <div className="flex w-full max-w-[950px] min-h-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative animate-fadeInUp">
        
        {/* LEFT PANEL - Geometric Blue */}
        <div className="hidden md:flex flex-col w-[40%] bg-[#5d9cf2] relative overflow-hidden justify-center items-end pr-0">
          {/* Diagonal Layers */}
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[#4082e6] -z-10 -rotate-[35deg] transform origin-top-left translate-x-[20%]"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[#2a68c7] -z-20 -rotate-[35deg] transform origin-top-left translate-x-[45%]"></div>
          
          {/* Active Tab Cutout Effect */}
          <div className="relative w-full h-[180px] flex flex-col justify-center items-end">
            {/* The white cut-out tab */}
            <Link to="/login" className="flex items-center justify-center bg-white h-16 w-38 rounded-l-full shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 translate-x-1 pl-4 pr-3 gap-2 group transition-transform hover:-translate-x-1">
              <ArrowLeft size={18} className="text-[#142646] transition-transform group-hover:-translate-x-1" />
              <span className="text-[0.95rem] font-bold text-[#142646] tracking-wide whitespace-nowrap">BACK TO LOGIN</span>
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="w-full md:w-[60%] bg-white p-10 sm:p-14 lg:p-16 flex flex-col justify-center relative z-10">
          
          {!submitted ? (
            <>
              {/* Hero Icon */}
              <div className="w-[84px] h-[84px] mx-auto bg-[#1b75d9] rounded-full shadow-[0_12px_25px_rgba(27,117,217,0.4)] flex items-center justify-center mb-5 text-white">
                <Shield size={46} strokeWidth={2} />
              </div>
              
              <h1 className="text-[1.65rem] font-black text-[#182c4f] tracking-wide text-center mb-2">RESET PASSWORD</h1>
              <p className="text-[0.95rem] text-center text-gray-500 font-medium mb-10 max-w-[320px] mx-auto leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[360px] mx-auto w-full" noValidate>
                
                {/* Email Input */}
                <div>
                  <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2.5">
                    <Mail className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full pl-9 pr-2 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.95rem]"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                    />
                  </div>
                  {error && <span className="text-red-500 text-xs mt-1.5 block font-medium flex items-center gap-1"><AlertCircle size={14} />{error}</span>}
                </div>

                {/* Action Row */}
                <div className="flex justify-center mt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-[#1b75d9] hover:bg-[#1460b5] text-white px-9 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-[1rem] tracking-wide"
                    disabled={loading}
                  >
                    {loading ? <span className="w-5 h-5 inline-block rounded-full border-2 border-white/30 border-t-white animate-spin"></span> : 'SEND RESET LINK'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center max-w-[360px] mx-auto text-center animate-fadeIn">
              <div className="w-[90px] h-[90px] rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-6 shadow-inner ring-4 ring-green-500/10">
                <CheckCircle size={50} strokeWidth={2} />
              </div>
              <h2 className="text-[1.8rem] font-black text-[#182c4f] tracking-tight mb-4">Check your email</h2>
              <p className="text-[1rem] text-gray-500 font-medium leading-relaxed mb-8">
                We've sent a password reset link to <br/><strong className="text-[#182c4f]">{email}</strong>.
                The link will expire in 15 minutes.
              </p>
              
              <div className="w-full border-t border-gray-100 pt-8">
                <p className="text-[0.9rem] text-gray-400 font-medium">
                  Didn't receive it? Check your spam folder or<br/>
                  <button
                    className="text-[#1b75d9] font-bold mt-2 hover:underline transition-all"
                    onClick={() => { setSubmitted(false); setEmail(''); }}
                  >
                    try sending again
                  </button>.
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto self-center md:hidden pt-12">
            <Link to="/login" className="flex items-center gap-2 text-[0.9rem] font-bold text-gray-500 hover:text-[#1b75d9] transition-colors">
              <ArrowLeft size={16} /> BACK TO LOGIN
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
