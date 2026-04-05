import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Hash, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'staff', label: 'Staff' },
];

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Software Engineering',
  'Electrical Engineering', 'Business Management', 'Academic Affairs',
  'IT Services', 'Finance', 'Other',
];

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']; // Tailwind hex colors

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', studentId: '', email: '', role: 'student',
    department: '', password: '', confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.studentId.trim()) e.studentId = 'Student/Staff ID is required.';
    else if (!/^[A-Za-z0-9]+$/.test(form.studentId)) e.studentId = 'ID must be alpha-numeric (no spaces or special chars).';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.department) e.department = 'Please select a department.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must include at least one uppercase letter.';
    else if (!/[a-z]/.test(form.password)) e.password = 'Must include at least one lowercase letter.';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must include at least one number.';
    else if (!/[^A-Za-z0-9]/.test(form.password)) e.password = 'Must include at least one special character.';
    if (!form.confirm) e.confirm = 'Please confirm your password.';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setApiError('');
    await new Promise(r => setTimeout(r, 700));
    const result = register(form);
    setLoading(false);
    if (!result.success) { setApiError(result.error); return; }
    navigate('/profile');
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); setApiError(''); };

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center p-4 font-sans py-10">
      <div className="flex w-full max-w-[1000px] min-h-[650px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative animate-fadeInUp">
        
        {/* LEFT PANEL - Geometric Blue */}
        <div className="hidden md:flex flex-col w-[35%] bg-[#5d9cf2] relative overflow-hidden justify-center items-end pr-0">
          {/* Diagonal Layers */}
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[#4082e6] -z-10 -rotate-[35deg] transform origin-top-left translate-x-[20%]"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[#2a68c7] -z-20 -rotate-[35deg] transform origin-top-left translate-x-[45%]"></div>
          
          {/* Active Tab Cutout Effect */}
          <div className="relative w-full h-[180px] flex flex-col justify-center items-end">
            {/* Underlined "LOGIN" above */}
            <div className="w-32 flex flex-col items-center mb-8 mr-1 cursor-pointer" onClick={() => navigate('/login')}>
              <span className="text-[0.95rem] font-medium text-white/80 tracking-wide mb-1 transition-colors hover:text-white">LOGIN</span>
              <div className="h-[2px] w-14 bg-white/70"></div>
            </div>

            {/* The white SIGN UP tab */}
            <div className="flex items-center justify-center bg-white h-16 w-32 rounded-l-full shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 translate-x-1">
              <span className="text-[1.05rem] font-bold text-[#142646] tracking-wide pr-3 whitespace-nowrap">SIGN UP</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="w-full md:w-[65%] bg-white p-8 sm:p-12 flex flex-col justify-center relative z-10">
          
          {/* Hero Icon */}
          <div className="w-[72px] h-[72px] mx-auto bg-[#1b75d9] rounded-full shadow-[0_12px_25px_rgba(27,117,217,0.4)] flex items-center justify-center mb-4 text-white">
            <User size={36} strokeWidth={2} />
          </div>
          
          <h1 className="text-[1.5rem] font-black text-[#182c4f] tracking-wide text-center mb-8">REGISTER</h1>

          {apiError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-6 border border-red-100 font-medium">
              <AlertCircle size={16} /> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[500px] mx-auto w-full" noValidate>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                  <User className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-8 pr-2 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.9rem]"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </div>
                {errors.name && <span className="text-red-500 text-[0.7rem] mt-1 block font-medium">{errors.name}</span>}
              </div>

              {/* ID Input */}
              <div>
                <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                  <Hash className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Student/Staff ID" 
                    className="w-full pl-8 pr-2 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.9rem]"
                    value={form.studentId}
                    onChange={e => set('studentId', e.target.value)}
                  />
                </div>
                <p className="text-[0.6rem] text-gray-400 mt-1.5 font-medium leading-tight">Alphanumeric only (letters & numbers, no spaces)</p>
                {errors.studentId && <span className="text-red-500 text-[0.7rem] mt-1 block font-medium">{errors.studentId}</span>}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                <Mail className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-8 pr-2 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.9rem]"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
              {errors.email && <span className="text-red-500 text-[0.7rem] mt-1 block font-medium">{errors.email}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Role Select */}
              <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                <select 
                  className="w-full bg-transparent outline-none text-[#182c4f] font-medium text-[0.9rem] appearance-none cursor-pointer"
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                >
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 pb-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              {/* Department Select */}
              <div>
                <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                  <select 
                    className={`w-full bg-transparent outline-none font-medium text-[0.9rem] appearance-none cursor-pointer ${!form.department ? 'text-gray-400' : 'text-[#182c4f]'}`}
                    value={form.department}
                    onChange={e => set('department', e.target.value)}
                  >
                    <option value="" disabled>Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 pb-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {errors.department && <span className="text-red-500 text-[0.7rem] mt-1 block font-medium">{errors.department}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Password Input */}
              <div>
                <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                  <Lock className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    placeholder="Password" 
                    className="w-full pl-8 pr-10 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.9rem] tracking-widest"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1b75d9] transition-colors focus:outline-none"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-3 flex flex-col gap-2 bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Requirements</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { label: 'Min. 8 characters', met: form.password.length >= 8 },
                        { label: 'Uppercase letter', met: /[A-Z]/.test(form.password) },
                        { label: 'Lowercase letter', met: /[a-z]/.test(form.password) },
                        { label: 'Numeric character', met: /[0-9]/.test(form.password) },
                        { label: 'Special character', met: /[^A-Za-z0-9]/.test(form.password) },
                      ].map((req, i) => (
                        <div key={i} className={`flex items-center gap-2 text-[0.7rem] font-medium transition-colors ${req.met ? 'text-green-500' : 'text-gray-400'}`}>
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${req.met ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                            {req.met ? <CheckCircle size={10} strokeWidth={4} /> : <div className="w-1 h-1 bg-gray-300 rounded-full" />}
                          </div>
                          {req.label}
                        </div>
                      ))}
                    </div>
                    {/* Strength Bar */}
                    <div className="mt-2 flex gap-1 h-1 w-full">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex-1 rounded-full bg-gray-200 transition-colors"
                          style={{ background: i <= strength ? (strength === 5 ? '#10b981' : strengthColor[Math.min(strength, 4)]) : undefined }} />
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && <span className="text-red-500 text-[0.7rem] mt-1 block font-medium">{errors.password}</span>}
              </div>

              {/* Confirm Input */}
              <div>
                <div className="relative border-b-[1.5px] border-gray-300 focus-within:border-[#1b75d9] transition-colors pb-2">
                  <Lock className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type={showConfirm ? 'text' : 'password'} 
                    placeholder="Confirm Password" 
                    className="w-full pl-8 pr-10 bg-transparent outline-none text-[#182c4f] placeholder-gray-400 font-medium text-[0.9rem] tracking-widest"
                    value={form.confirm}
                    onChange={e => set('confirm', e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1b75d9] transition-colors focus:outline-none"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.confirm && form.confirm === form.password && (
                  <span className="text-[0.7rem] flex items-center gap-1 mt-1 font-bold text-[#10b981]">
                    <CheckCircle size={10} strokeWidth={3} /> Match
                  </span>
                )}
                {errors.confirm && <span className="text-red-500 text-[0.7rem] mt-1 block font-medium">{errors.confirm}</span>}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                className="bg-[#1b75d9] hover:bg-[#1460b5] text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 flex items-center gap-2 text-[0.95rem]"
                disabled={loading}
              >
                {loading ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> CREATING...</> : 'CREATE ACCOUNT'}
              </button>
            </div>
            
          </form>

          <p className="text-center text-xs text-gray-400 font-medium mt-8 md:hidden">
            Already have an account? <Link to="/login" className="text-[#1b75d9] font-bold">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
