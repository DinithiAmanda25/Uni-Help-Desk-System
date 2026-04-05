import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  LifeBuoy, Zap, BookOpen, Users, CheckCircle, Clock, Star,
  ArrowRight, ShieldCheck, Bell
} from 'lucide-react';

const STATS = [
  { value: '2,400+', label: 'Students Helped' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '<2h', label: 'Avg. Response Time' },
  { value: '12,000+', label: 'Tickets Resolved' },
];

const FEATURES = [
  {
    icon: <LifeBuoy size={28} />,
    color: 'blue',
    title: 'Submit Support Tickets',
    desc: 'Raise issues for IT, academic, or administrative support and track them in real time.',
  },
  {
    icon: <Clock size={28} />,
    color: 'purple',
    title: 'Track Status Anytime',
    desc: 'Get live updates on every ticket you submit. Know exactly where your request stands.',
  },
  {
    icon: <BookOpen size={28} />,
    color: 'cyan',
    title: 'Knowledge Base',
    desc: 'Browse answers to frequently asked questions before raising a ticket.',
  },
  {
    icon: <Bell size={28} />,
    color: 'green',
    title: 'Smart Notifications',
    desc: 'Receive instant notifications for ticket updates, approvals, and important announcements.',
  },
  {
    icon: <ShieldCheck size={28} />,
    color: 'yellow',
    title: 'Secure & Role-Based',
    desc: 'Role-based access ensures students, staff, and admins see exactly what they need.',
  },
  {
    icon: <Users size={28} />,
    color: 'red',
    title: 'Team Collaboration',
    desc: 'Staff and admins can collaborate on complex issues for faster resolution.',
  },
];

const COLOR_CLASSES = {
  blue: 'bg-blue-500/15 text-blue-400',
  purple: 'bg-accent-purple/15 text-accent-purple',
  cyan: 'bg-teal-500/15 text-teal-400',
  green: 'bg-accent-green/15 text-accent-green',
  yellow: 'bg-accent-yellow/15 text-accent-yellow',
  red: 'bg-accent-red/15 text-accent-red',
};

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="page-wrapper min-h-screen flex flex-col">

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 sm:py-24 text-center">
          <div className="absolute rounded-full blur-[80px] pointer-events-none opacity-25 w-[500px] h-[500px] bg-blue-500 -top-[200px] left-[20%]" />
          <div className="absolute rounded-full blur-[80px] pointer-events-none opacity-25 w-[400px] h-[400px] bg-accent-purple -bottom-[150px] right-[15%]" />
          
          <div className="container px-4 mx-auto">
            <div className="relative z-10 max-w-[760px] mx-auto animate-fadeInUp">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm font-semibold text-blue-400 mb-6">
                <Zap size={14} />
                <span>University Support, Simplified</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-text-primary mb-5">
                Your Campus Help Desk,<br />
                <span className="gradient-text">All in One Place</span>
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[580px] mx-auto mb-9">
                Submit tickets, track resolutions, and get instant support — for IT issues,
                academic queries, and administrative requests. Fast, transparent, and always available.
              </p>
              
              <div className="flex gap-3 justify-center flex-wrap mb-8">
                {currentUser ? (
                  <Link to="/profile" className="btn btn-primary btn-lg" id="hero-dashboard-btn">
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
                      Get Started Free <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login-btn">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center flex-wrap gap-2.5 text-xs sm:text-sm text-text-muted">
                <CheckCircle size={14} className="text-accent-green" /> No credit card required
                <span className="w-1 h-1 rounded-full bg-text-muted mx-1" />
                <CheckCircle size={14} className="text-accent-green" /> Free for all students
                <span className="w-1 h-1 rounded-full bg-text-muted mx-1" />
                <CheckCircle size={14} className="text-accent-green" /> 24/7 access
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 border-y border-brand-border bg-brand-primary/50">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((s, i) => (
                <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">{s.value}</div>
                  <div className="text-sm text-text-muted font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary mb-3">Everything you need, nothing you don't</h2>
              <p className="text-base text-text-secondary max-w-[500px] mx-auto">
                Designed specifically for university life — fast, intuitive, and built around your needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="bg-brand-secondary border border-brand-border rounded-2xl p-7 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${COLOR_CLASSES[f.color]}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-20">
          <div className="container px-4 mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0f2040] to-[#1a0f40] border border-accent-purple/30 rounded-3xl p-10 sm:p-16 text-center shadow-2xl">
              <div className="absolute w-[400px] h-[400px] rounded-full bg-accent-purple blur-[100px] opacity-15 -top-24 -right-24 pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <Star size={32} className="text-accent-yellow mx-auto mb-5" />
                <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">Ready to get support?</h2>
                <p className="text-base sm:text-lg text-text-secondary mb-8">Join thousands of students already using UniHelpDesk to resolve their queries faster.</p>
                
                {!currentUser && (
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
                      Create Free Account <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg" id="cta-login-btn">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-border py-6 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 font-bold text-sm text-text-secondary">
              <ShieldCheck size={16} />
              <span>UniHelpDesk</span>
            </div>
            <p className="text-xs text-text-muted">© 2026 UniHelpDesk. Built for SLIIT students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
