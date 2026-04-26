import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Activity, Clock, Calendar, TrendingUp, Flame, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6b7280'];

function localDateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildLast7(last7days) {
  return Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const dateStr = localDateStr(daysAgo);
    const found = (last7days || []).find((x) => (x.date || '').slice(0, 10) === dateStr);
    const d = new Date(dateStr + 'T00:00:00');
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: found ? parseInt(found.count) : 0,
    };
  });
}

export default function Statistics() {
  const { dark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/stats')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    const s = { background: 'var(--border)' };
    return (
      <div className="min-h-screen px-5 pt-6 pb-28" style={{ backgroundColor: 'var(--pg)' }}>
        <div className="animate-pulse h-7 w-32 rounded mb-6" style={s} />
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[0,1,2,3].map(i => <div key={i} className="animate-pulse h-28 rounded-2xl" style={s} />)}
        </div>
        {[0,1,2].map(i => <div key={i} className="animate-pulse h-40 rounded-2xl mb-4" style={s} />)}
      </div>
    );
  }

  const tickColor  = 'var(--txt-40)';
  const tooltipStyle = {
    borderRadius: 10,
    border: '1px solid var(--border)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    backgroundColor: 'var(--pg)',
    color: 'var(--txt)',
    fontSize: 12,
  };

  const totalMinutes = stats?.total_minutes || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const leftoverMins = totalMinutes % 60;
  const avgDuration =
    stats?.total > 0 ? Math.round(totalMinutes / stats.total) : 0;

  const barData = buildLast7(stats?.last7days);

  const pieData = (stats?.by_type || []).map((row) => ({
    name: row.activity_type,
    value: parseInt(row.count),
  }));

  const CARD_STYLE = { background: 'var(--card)', border: '1px solid var(--border)' };

  return (
    <div className="px-5 pt-6 pb-28" style={{ backgroundColor: 'var(--pg)', minHeight: '100vh', transition: 'background-color 0.2s ease' }}>
      <h1 className="text-[22px] font-black tracking-tight mb-6" style={{ color: 'var(--txt)' }}>Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={<Activity size={20} />} label="Total Workouts" value={stats?.total || 0}
          gradient="linear-gradient(135deg,#2563eb,#3b82f6)" shadow="rgba(59,130,246,0.3)" />
        <StatCard icon={<Clock size={20} />} label="Total Time" value={totalHours > 0 ? `${totalHours}h ${leftoverMins}m` : `${leftoverMins}m`}
          gradient="linear-gradient(135deg,#7c3aed,#8b5cf6)" shadow="rgba(124,58,237,0.3)" />
        <StatCard icon={<Calendar size={20} />} label="This Week" value={stats?.this_week || 0}
          gradient="linear-gradient(135deg,#059669,#22c55e)" shadow="rgba(34,197,94,0.3)" />
        <StatCard icon={<TrendingUp size={20} />} label="Avg Duration" value={`${avgDuration}m`}
          gradient="linear-gradient(135deg,#ea580c,#f97316)" shadow="rgba(249,115,22,0.3)" />
      </div>

      {/* Streak + Personal Bests */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl p-4 flex flex-col items-center justify-center text-center" style={CARD_STYLE}>
          <Flame size={26} style={{ color: '#f97316' }} className="mb-1" />
          <div className="text-3xl font-black leading-none" style={{ color: 'var(--txt)' }}>{stats?.streak ?? 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--txt-40)' }}>Day Streak</div>
        </div>
        <div className="rounded-2xl p-4" style={CARD_STYLE}>
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy size={14} style={{ color: '#eab308' }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-40)' }}>Personal Bests</span>
          </div>
          <div className="space-y-1.5">
            {(stats?.personal_bests || []).slice(0, 4).map((pb) => (
              <div key={pb.activity_type} className="flex justify-between items-center">
                <span className="text-[12px] truncate" style={{ color: 'var(--txt-60)' }}>{pb.activity_type}</span>
                <span className="text-[12px] font-bold ml-2 flex-shrink-0" style={{ color: 'var(--txt)' }}>{pb.best_minutes}m</span>
              </div>
            ))}
            {!stats?.personal_bests?.length && <p className="text-[12px]" style={{ color: 'var(--txt-40)' }}>No data yet</p>}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-2xl p-4 mb-4" style={CARD_STYLE}>
        <h2 className="text-[13px] font-bold mb-4" style={{ color: 'var(--txt)' }}>Workouts — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(124,58,237,0.12)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="count" name="Workouts" fill="#7c3aed" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 ? (
        <div className="rounded-2xl p-4" style={CARD_STYLE}>
          <h2 className="text-[13px] font-bold mb-4" style={{ color: 'var(--txt)' }}>By Activity Type</h2>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={72} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={10}
                formatter={(v) => <span style={{ fontSize: 12, color: 'var(--txt-60)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-2xl p-6 text-center text-[13px]" style={{ ...CARD_STYLE, color: 'var(--txt-40)' }}>
          Log some workouts to see type breakdown.
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, gradient, shadow }) {
  return (
    <div className="text-white rounded-2xl p-4" style={{ background: gradient, boxShadow: `0 8px 24px ${shadow}` }}>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-3">{icon}</div>
      <div className="text-2xl font-black leading-none tracking-tight">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-70 mt-1.5">{label}</div>
    </div>
  );
}
