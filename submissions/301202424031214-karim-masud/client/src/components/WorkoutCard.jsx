import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';

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

function fmtDate(str) {
  const d = new Date(str.slice(0, 10) + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function WorkoutCard({ workout }) {
  const t   = TYPE_CFG[workout.activity_type] || TYPE_CFG.Other;
  const int = INT_CFG[workout.intensity]       || INT_CFG.Low;
  return (
    <Link
      to={`/workout/${workout.id}`}
      className="flex items-stretch rounded-xl overflow-hidden mb-2.5 transition-all duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* left accent bar */}
      <div className="w-1 flex-shrink-0" style={{ backgroundColor: t.color }} />

      {/* type icon */}
      <div className="flex items-center px-3 py-3.5 flex-shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{ background: t.bg }}>
          {t.emoji}
        </div>
      </div>

      {/* content */}
      <div className="flex-1 min-w-0 py-3.5 pr-2">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: t.bg, color: t.color }}>
            {workout.activity_type}
          </span>
          <span className="flex items-center gap-0.5">
            {[1,2,3].map(i => (
              <span key={i} className="w-2 h-2 rounded-full"
                style={{ backgroundColor: i <= int.filled ? int.color : 'var(--border)' }} />
            ))}
            <span className="text-[11px] font-semibold ml-1" style={{ color: int.color }}>
              {workout.intensity}
            </span>
          </span>
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight truncate leading-snug" style={{ color: 'var(--txt)' }}>
          {workout.activity_name}
        </h3>
        <div className="flex items-center gap-2 mt-1" style={{ color: 'var(--txt-40)' }}>
          <Clock size={11} strokeWidth={2.5} />
          <span className="text-[12px]">{workout.duration_minutes} min</span>
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
          <span className="text-[12px]">{fmtDate(workout.workout_date)}</span>
        </div>
      </div>

      {/* chevron */}
      <div className="flex items-center pr-3 flex-shrink-0" style={{ color: 'var(--txt-20)' }}>
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}
