import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
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

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const emailRef    = useRef(null);

  const [form, setForm]         = useState({ email: '', password: '' });
  const [touched, setTouched]   = useState({ email: false, password: false });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const set   = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setServerError(''); };
  const touch = (k) => ()  => setTouched((t) => ({ ...t, [k]: true }));

  const emailErr = touched.email && !form.email.match(/^[^@]+@[^@]+\.[^@]+$/)
    ? 'Please enter a valid email address.' : '';
  const pwErr = touched.password && form.password.length < 6
    ? 'Password must be at least 6 characters.' : '';
  const canSubmit = !emailErr && !pwErr && form.email && form.password;

  function inputClass(err, isValid) {
    const base = 'auth-input w-full pl-10 pr-12 py-3 rounded-xl text-white text-sm transition-all duration-200 focus:outline-none ';
    if (err)     return base + 'bg-red-500/[0.08] border border-red-500/50 focus:ring-[3px] focus:ring-red-500/20';
    if (isValid) return base + 'bg-white/[0.06] border border-emerald-400/60 focus:ring-[3px] focus:ring-violet-500/25 focus:border-violet-500';
    return        base + 'bg-white/[0.06] border border-white/[0.15] focus:ring-[3px] focus:ring-violet-500/25 focus:bg-violet-600/[0.06] focus:border-violet-500';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setServerError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setForm({ email: 'demo@fitflextrack.app', password: 'Demo1234' });
    setTouched({ email: false, password: false });
    setServerError('');
  }

  return (
    <div className="auth-page min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-8 pb-[env(safe-area-inset-bottom,24px)] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/[0.12] blur-3xl" />

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
          <p className="text-gray-500 text-xs mt-0.5">Your personal fitness companion</p>
        </div>

        {/* Card */}
        <div className="animate-fade-up bg-white/[0.05] backdrop-blur-md border border-white/[0.10] rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-black text-white tracking-tight mb-0.5">Welcome back</h2>
          <p className="text-gray-500 text-[13px] mb-5">Sign in to continue</p>

          {/* Server error — aria-live so screen readers announce it */}
          <div aria-live="polite" aria-atomic="true">
            {serverError && (
              <div role="alert" className="mb-4 px-3.5 py-3 bg-red-500/[0.10] border border-red-500/30 text-red-400 rounded-xl text-[13px] font-medium flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {serverError}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby={emailErr ? 'email-err' : undefined}
                  aria-invalid={!!emailErr}
                  required
                  value={form.email}
                  onChange={set('email')}
                  onBlur={touch('email')}
                  placeholder="you@example.com"
                  className={inputClass(emailErr, touched.email && form.email && !emailErr)}
                />
                {touched.email && form.email && !emailErr && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold" aria-hidden>✓</span>
                )}
              </div>
              <FieldError msg={emailErr} id="email-err" />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-pw" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="login-pw"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-describedby={pwErr ? 'pw-err' : undefined}
                  aria-invalid={!!pwErr}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={set('password')}
                  onBlur={touch('password')}
                  placeholder="••••••••"
                  className={inputClass(pwErr, touched.password && form.password && !pwErr)}
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
              <FieldError msg={pwErr} id="pw-err" />
            </div>

            {/* Remember me */}
            <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-violet-600 bg-white/10 border-white/20 cursor-pointer"
              />
              <span className="text-[12px] text-gray-400 font-medium">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] transition-all active:scale-[0.98] active:shadow-[0_2px_10px_rgba(124,58,237,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-gray-600 text-[11px] font-medium tracking-wide">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <button
            onClick={fillDemo}
            className="w-full py-3 rounded-xl border border-white/[0.15] hover:border-violet-500/60 text-gray-300 hover:text-violet-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.04] transition-all active:scale-[0.98]"
          >
            <Zap size={14} strokeWidth={2.5} /> Try Demo Account
          </button>
        </div>

        <p className="text-center text-[13px] text-gray-600 mt-5 pb-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-violet-400 font-black hover:text-violet-300 underline underline-offset-2 transition">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
