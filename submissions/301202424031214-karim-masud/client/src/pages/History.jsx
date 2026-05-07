import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, X, Dumbbell, SlidersHorizontal, ChevronRight, Check } from 'lucide-react';

/* ── colour config ─────────────────────────────────────────────── */
const TYPE_CFG = {
  Yoga:     { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   emoji: '🧘' },
  Running:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  emoji: '🏃' },
  Cycling:  { color: '#eab308', bg: 'rgba(234,179,8,0.15)',   emoji: '🚴' },
  Swimming: { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',   emoji: '🏊' },
  Gym:      { color: '#a855f7', bg: 'rgba(168,85,247,0.15)',  emoji: '🏋️' },
  Dance:    { color: '#ec4899', bg: 'rgba(236,72,153,0.15)',  emoji: '💃' },
  Other:    { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   emoji: '⚡' },
};
const INT_CFG = {
  Low:    { color: '#22c55e', filled: 1 },
  Medium: { color: '#eab308', filled: 2 },
  High:   { color: '#ef4444', filled: 3 },
};
const SORT_OPTS = ['Newest', 'Oldest', 'Longest', 'Shortest'];
const TYPES     = ['All', 'Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Dance', 'Other'];

/* ── helpers ───────────────────────────────────────────────────── */
function fmtShort(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function fmtFull(str) {
  return new Date(str).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(mins) {
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
}

function groupByDate(list) {
  const today = new Date(); today.setHours(0,0,0,0);
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  const out   = {};
  list.forEach(w => {
    const d = new Date(w.workout_date); d.setHours(0,0,0,0);
    let key;
    if (d.getTime() === today.getTime())      key = `Today, ${fmtShort(w.workout_date)}`;
    else if (d.getTime() === yest.getTime())  key = `Yesterday, ${fmtShort(w.workout_date)}`;
    else                                       key = fmtFull(w.workout_date);
    if (!out[key]) out[key] = [];
    out[key].push(w);
  });
  return out;
}

/* ── skeleton ──────────────────────────────────────────────────── */
function SkeletonCard() {
  const s = { background: 'var(--border)' };
  return (
    <div className="animate-pulse rounded-xl overflow-hidden flex mb-2.5" style={{ background: 'var(--card)', border: '1px solid var(--border)', minHeight: 80 }}>
      <div className="w-1 flex-shrink-0" style={s} />
      <div className="flex-1 p-4 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full" style={s} />
          <div className="h-4 w-10 rounded-full" style={s} />
        </div>
        <div className="h-4 w-40 rounded" style={s} />
        <div className="h-3 w-28 rounded" style={s} />
      </div>
    </div>
  );
}

/* ── intensity dots ────────────────────────────────────────────── */
function IntDots({ intensity }) {
  const cfg = INT_CFG[intensity] || INT_CFG.Low;
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3].map(i => (
        <span key={i} className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: i <= cfg.filled ? cfg.color : 'var(--border)' }} />
      ))}
      <span className="text-[11px] font-medium ml-1" style={{ color: cfg.color }}>{intensity}</span>
    </span>
  );
}

/* ── workout card ──────────────────────────────────────────────── */
function HistoryCard({ workout }) {
  const t = TYPE_CFG[workout.activity_type] || TYPE_CFG.Other;
  return (
    <Link to={`/workout/${workout.id}`}
      className="flex items-stretch rounded-xl overflow-hidden transition-all duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="w-1 flex-shrink-0" style={{ backgroundColor: t.color }} />
      <div className="flex items-center px-3 py-3.5 flex-shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: t.bg }}>
          {t.emoji}
        </div>
      </div>
      <div className="flex-1 min-w-0 py-3.5 pr-2">
        <h3 className="text-[15px] font-semibold tracking-tight truncate leading-snug" style={{ color: 'var(--txt)' }}>
          {workout.activity_name}
        </h3>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-40)' }}>
          {fmtTime(workout.duration_minutes)} · {fmtShort(workout.workout_date)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: t.bg, color: t.color }}>
            {workout.activity_type}
          </span>
          <IntDots intensity={workout.intensity} />
        </div>
      </div>
      <div className="flex items-center pr-3 flex-shrink-0" style={{ color: 'var(--txt-20)' }}>
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}

/* ── sort bottom sheet ─────────────────────────────────────────── */
function SortSheet({ current, onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl pb-[env(safe-area-inset-bottom,20px)] max-w-2xl mx-auto"
        style={{ background: 'var(--pg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[15px] font-bold" style={{ color: 'var(--txt)' }}>Sort by</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--border)' }}>
            <X size={14} style={{ color: 'var(--txt-60)' }} />
          </button>
        </div>
        {SORT_OPTS.map(opt => (
          <button key={opt} onClick={() => { onSelect(opt); onClose(); }}
            className="w-full flex items-center justify-between px-5 py-4 transition-colors"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-[15px]" style={{ color: current === opt ? '#a78bfa' : 'var(--txt-60)' }}>{opt}</span>
            {current === opt && <Check size={16} style={{ color: '#7c3aed' }} />}
          </button>
        ))}
        <div className="h-4" />
      </div>
    </>
  );
}

/* ── page ──────────────────────────────────────────────────────── */
export default function History() {
  const [all,       setAll]       = useState([]);
  const [workouts,  setWorkouts]  = useState([]);
  const [search,    setSearch]    = useState('');
  const [activeTypes, setActiveTypes] = useState(['All']);
  const [sort,      setSort]      = useState('Newest');
  const [loading,   setLoading]   = useState(true);
  const [showSort,  setShowSort]  = useState(false);
  const searchRef = useRef(null);

  /* fetch all once for counts + subtitle */
  useEffect(() => {
    axios.get('/api/workouts')
      .then(r => setAll(r.data))
      .catch(() => {});
  }, []);

  /* filtered + sorted fetch with 300ms debounce */
  const doFetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      const types = activeTypes.filter(t => t !== 'All');
      if (types.length === 1) params.type = types[0];
      const res  = await axios.get('/api/workouts', { params });
      let data   = res.data;
      if (types.length > 1) data = data.filter(w => types.includes(w.activity_type));
      if (sort === 'Oldest')   data = [...data].reverse();
      if (sort === 'Longest')  data = [...data].sort((a,b) => b.duration_minutes - a.duration_minutes);
      if (sort === 'Shortest') data = [...data].sort((a,b) => a.duration_minutes - b.duration_minutes);
      setWorkouts(data);
    } catch { setWorkouts([]); }
    finally { setLoading(false); }
  }, [search, activeTypes, sort]);

  useEffect(() => {
    const t = setTimeout(doFetch, 300);
    return () => clearTimeout(t);
  }, [doFetch]);

  /* derived stats */
  const totalMins = all.reduce((s, w) => s + (w.duration_minutes || 0), 0);
  const totalH    = Math.floor(totalMins / 60);
  const totalM    = totalMins % 60;
  const typeCounts = all.reduce((acc, w) => { acc[w.activity_type] = (acc[w.activity_type]||0)+1; return acc; }, {});

  /* chip toggle */
  function toggleType(t) {
    if (t === 'All') { setActiveTypes(['All']); return; }
    setActiveTypes(prev => {
      const without = prev.filter(x => x !== 'All');
      if (without.includes(t)) {
        const next = without.filter(x => x !== t);
        return next.length ? next : ['All'];
      }
      return [...without, t];
    });
  }

  const grouped  = groupByDate(workouts);
  const hasFilter = !(activeTypes.length === 1 && activeTypes[0] === 'All') || search.trim();

  /* ── render ── */
  return (
    <div style={{ backgroundColor: 'var(--pg)', minHeight: '100vh', transition: 'background-color 0.2s ease' }} className="pb-28">
      <div className="px-5 pt-6 max-w-[560px] mx-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black tracking-tight leading-none" style={{ color: 'var(--txt)' }}>Workout History</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--txt-40)' }}>
              {all.length} workout{all.length !== 1 ? 's' : ''} · {totalH}h {totalM}m total
            </p>
          </div>
          <button onClick={() => setShowSort(true)}
            aria-label="Sort workouts"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 mt-0.5"
            style={{ background: sort !== 'Newest' ? 'rgba(124,58,237,0.2)' : 'var(--card)', border: '1px solid var(--border)' }}>
            <SlidersHorizontal size={17} style={{ color: sort !== 'Newest' ? '#a78bfa' : 'var(--txt-60)' }} strokeWidth={2} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-40)' }} />
          <input
            ref={searchRef}
            type="search"
            role="searchbox"
            aria-label="Search workouts"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, type, or date…"
            className="auth-input w-full pl-11 pr-10 py-3 rounded-xl text-[15px] focus:outline-none transition-all duration-200"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--txt)',
            }}
            onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.2)'}
            onBlur={e  => e.target.style.boxShadow = 'none'}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition"
              style={{ background: 'var(--border)' }}>
              <X size={11} style={{ color: 'var(--txt-60)' }} />
            </button>
          )}
        </div>

        {/* FILTER CHIPS */}
        <div className="relative mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filter by workout type">
            {TYPES.map(t => {
              const isActive = activeTypes.includes(t) || (t === 'All' && activeTypes.includes('All'));
              const cfg      = TYPE_CFG[t];
              const count    = t === 'All' ? all.length : (typeCounts[t] || 0);
              return (
                <button key={t} role="tab" aria-selected={isActive}
                  onClick={() => toggleType(t)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all duration-150"
                  style={isActive ? {
                    background: '#7c3aed',
                    color:      '#fff',
                    boxShadow:  '0 2px 10px rgba(124,58,237,0.35)',
                  } : {
                    background: 'var(--card)',
                    border:     '1px solid var(--border)',
                    color:      'var(--txt-60)',
                  }}>
                  {cfg && <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, display: 'inline-block', flexShrink: 0 }} />}
                  {t} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
                </button>
              );
            })}
          </div>
          {/* right fade hint */}
          <div className="absolute right-0 top-0 bottom-1 w-8 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, var(--pg))' }} />
        </div>

        {/* search result count */}
        {search.trim() && !loading && (
          <p className="text-[12px] mb-3 font-medium" style={{ color: 'var(--txt-40)' }}>
            {workouts.length} result{workouts.length !== 1 ? 's' : ''} for &ldquo;{search.trim()}&rdquo;
          </p>
        )}

        {/* CONTENT */}
        {loading ? (
          <div aria-busy="true" aria-label="Loading workouts">
            {[0,1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--card)' }}>
              <Dumbbell size={28} style={{ color: 'var(--txt-20)' }} />
            </div>
            <h2 className="text-[17px] font-bold mb-1" style={{ color: 'var(--txt)' }}>
              {hasFilter ? 'No workouts found' : 'No workouts yet'}
            </h2>
            <p className="text-[13px] mb-5" style={{ color: 'var(--txt-40)' }}>
              {hasFilter
                ? 'Try adjusting your filters or search term'
                : 'Tap + below to log your first workout'}
            </p>
            {hasFilter ? (
              <button onClick={() => { setSearch(''); setActiveTypes(['All']); }}
                className="text-[13px] font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                Clear filters
              </button>
            ) : (
              <Link to="/add"
                className="text-[14px] font-bold px-6 py-3 rounded-xl text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                Log First Workout
              </Link>
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([day, items]) => (
            <div key={day} className="mb-2">
              {/* sticky date header */}
              <div className="sticky top-0 z-10 flex items-center justify-between py-2 mb-2"
                style={{
                  backdropFilter: 'blur(12px)',
                  background:     'color-mix(in srgb, var(--pg) 90%, transparent)',
                  borderBottom:   '1px solid var(--border)',
                }}>
                <h2 className="text-[12px] font-bold uppercase tracking-[0.06em]"
                  style={{ color: 'var(--txt-40)' }}>{day}</h2>
                <span className="text-[11px] font-medium" style={{ color: 'var(--txt-20)' }}>
                  {items.length} workout{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              {/* cards */}
              <div className="space-y-2">
                {items.map(w => <HistoryCard key={w.id} workout={w} />)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sort Sheet */}
      {showSort && <SortSheet current={sort} onSelect={setSort} onClose={() => setShowSort(false)} />}
    </div>
  );
}
