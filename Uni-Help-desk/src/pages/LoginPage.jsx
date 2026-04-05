import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setApiError('');
    // Simulate async delay
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (!result.success) { setApiError(result.error); return; }
    navigate(result.user.role === 'admin' ? '/admin/users' : '/profile');
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); setApiError(''); };

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center p-4 font-sans">
      <div className="flex w-full max-w-[950px] min-h-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative animate-fadeInUp">
        
        {/* LEFT PANEL - Geometric Blue */}
        <div className="hidden md:flex flex-col w-[40%] bg-[#5d9cf2] relative overflow-hidden justify-center items-end pr-0">
          {/* Diagonal Layers */}
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[#4082e6] -z-10 -rotate-[35deg] transform origin-top-left translate-x-[20%]"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[#2a68c7] -z-20 -rotate-[35deg] transform origin-top-left translate-x-[45%]"></div>
          
          {/* Active Tab Cutout Effect */}
          <div className="relative w-full h-[180px] flex flex-col justify-center items-end">
            {/* The white LOGIN tab */}
            <div className="flex items-center justify-center bg-white h-16 w-32 rounded-l-full shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 translate-x-1">
              <span className="text-[1.05rem] font-bold text-[#142646] tracking-wide pr-3">LOGIN</span>
            </div>
            
            {/* Underlined "SIGN IN" below */}
            <div className="w-32 flex flex-col items-center mt-8 mr-1 cursor-pointer" onClick={() => navigate('/register')}>
              <span className="text-[0.95rem] font-medium text-white/80 tracking-wide mb-1 transition-colors hover:text-white">SIGN IN</span>
              <div className="h-[2px] w-14 bg-white/70"></div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="w-full md:w-[60%] bg-white p-10 sm:p-14 lg:p-16 flex flex-col justify-center relative z-10">
          
          {/* Hero Icon */}
          <div className="w-[84px] h-[84px] mx-auto bg-[#1b75d9] rounded-full shadow-[0_12px_25px_rgba(27,117,217,0.4)] flex items-center justify-center mb-5 text-white">
            <User size={46} strokeWidth={2} />
          </div>
          
          <h1 className="text-[1.65rem] font-black text-[#182c4f] tracking-wide text-center mb-10">LOGIN</h1>

          {apiError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-6 border border-red-100 font-medium">
              <AlertCircle size={16} /> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[360px] mx-auto w-full" noValidate>
            
            {/* Email Input */}
            <div>
              <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2.5">
                <User className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full pl-9 pr-2 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.95rem]"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
              {errors.email && <span className="text-red-500 text-xs mt-1.5 block font-medium">{errors.email}</span>}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2.5">
                <Lock className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="Password" 
                  className="w-full pl-9 pr-10 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.95rem] tracking-widest"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1b75d9] transition-colors focus:outline-none"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-xs mt-1.5 block font-medium">{errors.password}</span>}
            </div>

            {/* Action Row */}
            <div className="flex justify-between items-center mt-2">
              <Link to="/forgot-password" className="text-[0.85rem] font-bold text-[#1b75d9] transition-colors hover:text-[#115099]">
                Forgot Password?
              </Link>
              <button 
                type="submit" 
                className="bg-[#1b75d9] hover:bg-[#1460b5] text-white px-9 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                disabled={loading}
              >
                {loading ? '...' : 'LOGIN'}
              </button>
            </div>
            
          </form>

          {/* Demo Accounts */}
          <div className="mt-10 w-full max-w-[360px] mx-auto bg-[#f8fafc] border border-gray-200 rounded-xl p-4">
            <p className="text-[0.75rem] font-bold text-gray-400 mb-3 uppercase tracking-wider">Demo Accounts</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white border border-gray-200 text-[#182c4f] text-[0.8rem] font-bold rounded-md shadow-sm cursor-pointer hover:border-[#1b75d9] hover:text-[#1b75d9] transition-colors" onClick={() => { setForm(f => ({ ...f, email: 'admin@uni.edu', password: 'Admin@123' })); setApiError(''); }}>
                Admin
              </span>
              <span className="px-3 py-1.5 bg-white border border-gray-200 text-[#182c4f] text-[0.8rem] font-bold rounded-md shadow-sm cursor-pointer hover:border-[#1b75d9] hover:text-[#1b75d9] transition-colors" onClick={() => { setForm(f => ({ ...f, email: 'john@uni.edu', password: 'Student@123' })); setApiError(''); }}>
                Student
              </span>
              <span className="px-3 py-1.5 bg-white border border-gray-200 text-[#182c4f] text-[0.8rem] font-bold rounded-md shadow-sm cursor-pointer hover:border-[#1b75d9] hover:text-[#1b75d9] transition-colors" onClick={() => { setForm(f => ({ ...f, email: 'sarah@uni.edu', password: 'Staff@123' })); setApiError(''); }}>
                Staff
              </span>
            </div>
          </div>

          {/* Social Footer */}
          <div className="mt-8 w-full max-w-[420px] mx-auto">
            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
              <span className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-wider shrink-0 w-24">Or Login With</span>
              <div className="flex-1 flex gap-3 justify-end sm:justify-between ml-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[0.85rem] font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex-1 transition-colors">
                  <span className="w-5 h-5 bg-gradient-to-tr from-yellow-400 via-red-500 to-indigo-500 rounded-full text-white flex items-center justify-center text-[10px] font-black italic">G</span> Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[0.85rem] font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex-1 transition-colors">
                  <span className="w-5 h-5 bg-[#1877f2] text-white rounded-md text-xs font-bold leading-none flex items-center justify-center">f</span> Facebook
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-400 font-medium mt-8 md:hidden">
            Don't have an account? <Link to="/register" className="text-[#1b75d9] font-bold">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
