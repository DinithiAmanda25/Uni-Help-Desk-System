import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, LifeBuoy, Send, AlertCircle, 
  CheckCircle, HelpCircle, Tag, Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateTicketPage() {
  const { createTicket } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    category: 'IT Support',
    priority: 'medium',
    description: ''
  });

  const categories = ['IT Support', 'Academic Inquiry', 'Finance / Payments', 'Hostel / Housing', 'Library Resources', 'Other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    
    const res = await createTicket(form);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/tickets'), 2000);
    } else {
      setError(res.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Link to="/tickets" className="btn bg-brand-primary border-brand-border text-text-primary hover:bg-brand-secondary p-2 rounded-lg">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black text-text-primary tracking-tight">Create Support Ticket</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="card p-8 shadow-xl shadow-slate-200/50">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 ring-8 ring-green-50">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-text-primary mb-2">Ticket Submitted!</h2>
              <p className="text-text-secondary mb-8">Your support request has been received. Redirecting you to your tickets...</p>
              <div className="animate-pulse flex items-center gap-2 text-blue-500 font-bold">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Processing
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="alert alert-error animate-shake">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="form-group mb-0">
                <label className="form-label" htmlFor="ticket-title">Problem Title</label>
                <div className="relative">
                  <LifeBuoy className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    id="ticket-title"
                    type="text"
                    placeholder="Briefly describe the issue (e.g., Cannot access LMS)"
                    className="form-input pl-11 py-3 focus:ring-2 focus:ring-blue-500/20"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group mb-0">
                  <label className="form-label">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <select
                      className="form-input pl-11 py-3 appearance-none bg-brand-primary"
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Priority Level</label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <select
                      className="form-input pl-11 py-3 appearance-none bg-brand-primary"
                      value={form.priority}
                      onChange={e => setForm({...form, priority: e.target.value})}
                    >
                      {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label" htmlFor="ticket-desc">Detailed Description</label>
                <textarea
                  id="ticket-desc"
                  rows="6"
                  placeholder="Explain your problem in detail so we can help you faster..."
                  className="form-input py-3 resize-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary py-4 text-lg font-black justify-center shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all mt-2"
              >
                {loading ? 'Submitting...' : <><Send size={20} /> Submit Ticket</>}
              </button>
            </form>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="card p-6 border-blue-100 bg-blue-50/30">
            <h3 className="font-black text-blue-800 mb-4 flex items-center gap-2">
              <HelpCircle size={18} /> Help Tips
            </h3>
            <ul className="text-sm text-blue-700/80 space-y-4 font-medium">
              <li className="flex gap-2 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-[10px]">1</span>
                Be specific in your title to help us categorize quickly.
              </li>
              <li className="flex gap-2 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-[10px]">2</span>
                Include any error messages you see on your screen.
              </li>
              <li className="flex gap-2 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-[10px]">3</span>
                Check our Knowledge Base first—it might have the answer!
              </li>
            </ul>
          </div>
          
          <div className="card p-6 bg-slate-50 border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Estimated response time for Medium priority is <strong>24-48 hours</strong>. Urgent tickets are prioritized.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
