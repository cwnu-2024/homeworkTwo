import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WorkoutCard from '../components/WorkoutCard';
import { useAuth } from '../context/AuthContext';
import { Activity, Clock, Calendar, Dumbbell, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function GoalRing({ done, goal }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(done / Math.max(goal, 1), 1);
  const dash  = pct * circ;
  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-gray-700" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6"
        className="text-emerald-500" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([axios.get('/api/stats'), axios.get('/api/workouts')])
      .then(([statsRes, workoutsRes]) => {
        setStats(statsRes.data);
        setRecent(workoutsRes.data.slice(0, 3));
      })
      .catch(() => setError('Could not connect to server. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    const sk = { background: 'var(--border)' };
    return (
      <div className="min-h-screen pb-28" style={{ backgroundColor: 'var(--pg)', transition: 'background-color 0.2s ease' }}>
        {/* branded splash centre */}
        <div className="flex flex-col items-center justify-center pt-20 pb-10">
          {/* logo */}
          <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-4 shadow-xl"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 8px 28px rgba(124,58,237,0.45)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <p className="text-[20px] font-black tracking-tight mb-1" style={{ color: 'var(--txt)' }}>FitFlexTrack</p>
          {/* violet spinner ring */}
          <div className="mt-5">
            <svg className="animate-spin" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="14" stroke="rgba(124,58,237,0.2)" strokeWidth="3.5"/>
              <path d="M18 4 a14 14 0 0 1 14 14" stroke="#7c3aed" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-[12px] font-semibold mt-3" style={{ color: 'var(--txt-40)' }}>Loading your stats…</p>
        </div>

        {/* skeleton content */}
        <div className="px-5 max-w-[560px] mx-auto space-y-3">
          <div className="animate-pulse h-24 rounded-2xl" style={sk} />
          <div className="grid grid-cols-3 gap-3">
            {[0,1,2].map(i => <div key={i} className="animate-pulse aspect-square rounded-2xl" style={sk} />)}
          </div>
          <div className="animate-pulse h-4 w-32 rounded" style={sk} />
          {[0,1,2].map(i => <div key={i} className="animate-pulse h-20 rounded-xl" style={sk} />)}
        </div>
      </div>
    );
  }

  const totalMinutes = stats?.total_minutes || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const leftoverMins = totalMinutes % 60;
  const weeklyGoal = user?.weekly_goal ?? 3;
  const weekPct = Math.min((stats?.this_week || 0) / Math.max(weeklyGoal, 1) * 100, 100);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: 'var(--pg)', transition: 'background-color 0.2s ease' }}>
      <div className="px-4 sm:px-6 pt-6 max-w-[560px] sm:max-w-[680px] md:max-w-[820px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-0.5"
              style={{ color: 'var(--txt-40)' }}>Welcome back</p>
            <h1 className="text-[22px] md:text-[26px] font-black tracking-tight leading-none" style={{ color: 'var(--txt)' }}>
              {user?.display_name || 'Athlete'} <span className="text-xl">💪</span>
            </h1>
          </div>
          <button onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {dark
              ? <Sun  size={18} className="text-yellow-400" strokeWidth={2} />
              : <Moon size={18} style={{ color: '#7c3aed' }} strokeWidth={2} />}
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl text-[13px] font-medium flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── WEEKLY GOAL ── */}
        <div className="rounded-2xl p-4 md:p-5 mb-5 flex items-center gap-4 md:gap-6"
          style={{ background: dark ? 'linear-gradient(135deg,#1e1b4b,#312e81)' : 'linear-gradient(135deg,#ede9fe,#ddd6fe)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <div className="relative flex-shrink-0">
            <GoalRing done={stats?.this_week || 0} goal={weeklyGoal} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[16px] font-black leading-none" style={{ color: dark ? '#fff' : '#4c1d95' }}>{stats?.this_week || 0}</span>
              <span className="text-[9px] font-medium" style={{ color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(76,29,149,0.6)' }}>/{weeklyGoal}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] md:text-[16px] font-bold" style={{ color: dark ? '#fff' : '#4c1d95' }}>Weekly Goal</p>
              <span className="text-[13px] font-black" style={{ color: '#a78bfa' }}>{Math.round(weekPct)}%</span>
            </div>
            <p className="text-[12px] mb-2.5" style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(76,29,149,0.65)' }}>
              {stats?.this_week >= weeklyGoal
                ? '🎉 Goal smashed this week!'
                : `${weeklyGoal - (stats?.this_week || 0)} more workout${weeklyGoal - (stats?.this_week || 0) !== 1 ? 's' : ''} to go`}
            </p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(124,58,237,0.18)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${weekPct}%`, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)' }} />
            </div>
          </div>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {[
            { icon: <Activity size={18} strokeWidth={2.5} />, label: 'Workouts',   value: stats?.total || 0,      grad: 'linear-gradient(135deg,#2563eb,#3b82f6)', shadow: 'rgba(59,130,246,0.35)' },
            { icon: <Clock    size={18} strokeWidth={2.5} />, label: 'Total Time',
              value: totalHours > 0
                ? `${(totalMinutes / 60).toFixed(1)}h`
                : `${leftoverMins}m`,
              grad: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', shadow: 'rgba(124,58,237,0.35)' },
            { icon: <Calendar size={18} strokeWidth={2.5} />, label: 'This Week',  value: stats?.this_week || 0,  grad: 'linear-gradient(135deg,#059669,#22c55e)', shadow: 'rgba(34,197,94,0.35)' },
          ].map(({ icon, label, value, grad, shadow }) => (
            <div key={label}
              className="text-white rounded-[20px] p-3.5 md:p-5 text-center flex flex-col items-center justify-center aspect-square"
              style={{ background: grad, boxShadow: `0 8px 24px ${shadow}` }}>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center mb-2.5">{icon}</div>
              <div className="text-[26px] md:text-[32px] font-black leading-none tracking-tight">{value}</div>
              <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] opacity-75 mt-1.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ── RECENT WORKOUTS ── */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] md:text-[18px] font-bold tracking-tight" style={{ color: 'var(--txt)' }}>Recent Workouts</h2>
          <Link to="/history"
            className="text-[12px] font-semibold uppercase tracking-wider min-h-[44px] flex items-center gap-1 px-1 transition-opacity hover:opacity-70"
            style={{ color: '#a78bfa' }}>
            SEE ALL ›
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--card)' }}>
              <Dumbbell size={34} style={{ color: 'var(--txt-20)' }} />
            </div>
            <p className="text-[17px] font-bold mb-1" style={{ color: 'var(--txt)' }}>Ready to start?</p>
            <p className="text-[13px] mb-5" style={{ color: 'var(--txt-60)' }}>Log your first workout to get going!</p>
            <Link to="/add"
              className="inline-block text-white font-bold px-6 py-3 rounded-xl text-[14px] transition active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              Log First Workout
            </Link>
          </div>
        ) : (
          <>
            {/* 1 col on phone → 2 col on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-3">
              {recent.map((w) => (
                <WorkoutCard key={w.id} workout={w} />
              ))}
            </div>
            {(stats?.total || 0) > 3 && (
              <Link to="/history"
                className="block text-center text-[13px] font-semibold py-4 transition-opacity hover:opacity-70"
                style={{ color: 'var(--txt-40)' }}>
                View all {stats.total} workouts →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
