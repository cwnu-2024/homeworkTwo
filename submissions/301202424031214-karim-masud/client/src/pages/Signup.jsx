import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

function FieldError({ msg, id }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11px] text-red-400 font-semibold flex items-center gap-1.5">
      <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" /> {msg}
    </p>
  );
}

export default function Signup() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const nameRef   = useRef(null);

  const [form, setForm]       = useState({ display_name: '', email: '', password: '' });
  const [touched, setTouched] = useState({ display_name: false, email: false, password: false });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const set   = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setServerError(''); };
  const touch = (k) => ()  => setTouched((t) => ({ ...t, [k]: true }));

  const nameErr  = touched.display_name && form.display_name.trim().length < 2 ? 'Please enter your name.' : '';
  const emailErr = touched.email && !form.email.match(/^[^@]+@[^@]+\.[^@]+$/) ? 'Please enter a valid email address.' : '';
  const pwErr    = touched.password && form.password.length < 6 ? 'Password must be at least 6 characters.' : '';
  const canSubmit = !nameErr && !emailErr && !pwErr && form.display_name && form.email && form.password;

  const pwStrength = form.password.length === 0 ? null : form.password.length < 6 ? 'weak' : form.password.length < 10 ? 'good' : 'strong';
  const strengthMap = {
    weak:   { color: 'bg-red-500',     label: 'text-red-400',     text: 'Too short', w: 'w-1/3' },
    good:   { color: 'bg-yellow-500',  label: 'text-yellow-400',  text: 'Good',      w: 'w-2/3' },
    strong: { color: 'bg-emerald-500', label: 'text-emerald-400', text: 'Strong',    w: 'w-full' },
  };

  function fieldClass(err, isValid) {
    const base = 'auth-input w-full pl-10 pr-12 py-3 rounded-xl text-white text-sm transition-all duration-200 focus:outline-none ';
    if (err)     return base + 'bg-red-500/[0.08] border border-red-500/50 focus:ring-[3px] focus:ring-red-500/20';
    if (isValid) return base + 'bg-white/[0.06] border border-emerald-400/60 focus:ring-[3px] focus:ring-violet-500/25 focus:border-violet-500';
    return        base + 'bg-white/[0.06] border border-white/[0.15] focus:ring-[3px] focus:ring-violet-500/25 focus:bg-violet-600/[0.06] focus:border-violet-500';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ display_name: true, email: true, password: true });
    if (!canSubmit) return;
    setServerError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-8 pb-[env(safe-area-inset-bottom,24px)] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/[0.12] blur-3xl" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <h1 className="text-[22px] font-black text-white tracking-tight">FitFlexTrack</h1>
          <p className="text-gray-500 text-xs mt-0.5">Start your fitness journey today</p>
        </div>

        {/* Card */}
        <div className="animate-fade-up bg-white/[0.05] backdrop-blur-md border border-white/[0.10] rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-black text-white tracking-tight mb-0.5">Create your account</h2>
          <p className="text-gray-500 text-[13px] mb-5">Free forever — no credit card needed</p>

          <div aria-live="polite" aria-atomic="true">
            {serverError && (
              <div role="alert" className="mb-4 px-3.5 py-3 bg-red-500/[0.10] border border-red-500/30 text-red-400 rounded-xl text-[13px] font-medium flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {serverError}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="su-name" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  ref={nameRef}
                  id="su-name"
                  type="text"
                  autoComplete="name"
                  aria-describedby={nameErr ? 'name-err' : undefined}
                  aria-invalid={!!nameErr}
                  required
                  value={form.display_name}
                  onChange={set('display_name')}
                  onBlur={touch('display_name')}
                  placeholder="John Doe"
                  className={fieldClass(nameErr, touched.display_name && form.display_name && !nameErr)}
                />
                {touched.display_name && form.display_name && !nameErr && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold" aria-hidden>✓</span>
                )}
              </div>
              <FieldError msg={nameErr} id="name-err" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="su-email" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby={emailErr ? 'su-email-err' : undefined}
                  aria-invalid={!!emailErr}
                  required
                  value={form.email}
                  onChange={set('email')}
                  onBlur={touch('email')}
                  placeholder="you@example.com"
                  className={fieldClass(emailErr, touched.email && form.email && !emailErr)}
                />
                {touched.email && form.email && !emailErr && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold" aria-hidden>✓</span>
                )}
              </div>
              <FieldError msg={emailErr} id="su-email-err" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="su-pw" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="su-pw"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-describedby={pwErr ? 'su-pw-err' : undefined}
                  aria-invalid={!!pwErr}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={set('password')}
                  onBlur={touch('password')}
                  placeholder="Min. 6 characters"
                  className={fieldClass(pwErr, touched.password && form.password && !pwErr)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strengthMap[pwStrength].color} ${strengthMap[pwStrength].w}`} />
                  </div>
                  <span className={`text-[11px] font-semibold ${strengthMap[pwStrength].label}`}>{strengthMap[pwStrength].text}</span>
                </div>
              )}
              <FieldError msg={pwErr} id="su-pw-err" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] transition-all active:scale-[0.98] active:shadow-[0_2px_10px_rgba(124,58,237,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner /> Creating account…</> : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-600 mt-4">
            By signing up you agree to our{' '}
            <span className="text-gray-500 underline underline-offset-2 cursor-pointer hover:text-gray-400 transition">Terms of Service</span>
          </p>
        </div>

        <p className="text-center text-[13px] text-gray-600 mt-5 pb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 font-black hover:text-violet-300 underline underline-offset-2 transition">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
