import { useState } from 'react';
import axios from 'axios';
import { User, Sun, Moon, Target, Ruler, LogOut, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { dark, toggle } = useTheme();

  const [name,    setName]    = useState(user?.display_name || '');
  const [goal,    setGoal]    = useState(user?.weekly_goal  ?? 3);
  const [unit,    setUnit]    = useState(user?.unit || 'metric');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  async function saveProfile() {
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await axios.put('/api/auth/profile', {
        display_name: name,
        weekly_goal:  goal,
        unit,
      });
      updateUser(data.token, data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  const INPUT = 'auth-input w-full py-3 rounded-xl text-[14px] focus:outline-none transition-all duration-200';
  const INPUT_STYLE = { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--txt)' };

  return (
    <div className="px-5 pt-6 pb-28" style={{ backgroundColor: 'var(--pg)', minHeight: '100vh', transition: 'background-color 0.2s ease' }}>
      <h1 className="text-[22px] font-black tracking-tight mb-6" style={{ color: 'var(--txt)' }}>Settings</h1>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-[13px] font-medium flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Profile */}
      <Section title="Profile">
        <div className="flex items-center gap-3 mb-4 p-3.5 rounded-xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-[17px] font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
            {(user?.display_name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[15px]" style={{ color: 'var(--txt)' }}>{user?.display_name}</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-60)' }}>{user?.email}</p>
          </div>
        </div>
        <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-40)' }}>Display Name</label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-40)' }} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT + ' pl-10 pr-4'}
            style={INPUT_STYLE}
            onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.2)'}
            onBlur={e  => e.target.style.boxShadow = 'none'}
          />
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <Row label="Dark Mode" icon={dark
          ? <Moon size={17} style={{ color: '#a78bfa' }} />
          : <Sun  size={17} style={{ color: '#fbbf24' }} />}>
          <button onClick={toggle}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ background: dark ? '#7c3aed' : 'var(--border)' }}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </Row>
      </Section>

      {/* Weekly Goal */}
      <Section title="Weekly Goal">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={17} style={{ color: '#22c55e' }} />
            <span className="text-[14px]" style={{ color: 'var(--txt-60)' }}>Workouts per week</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setGoal((g) => Math.max(1, g - 1))}
              className="w-9 h-9 rounded-xl font-black text-lg flex items-center justify-center transition active:scale-95"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--txt-60)' }}>−</button>
            <span className="text-[22px] font-black w-7 text-center" style={{ color: 'var(--txt)' }}>{goal}</span>
            <button onClick={() => setGoal((g) => Math.min(14, g + 1))}
              className="w-9 h-9 rounded-xl font-black text-lg flex items-center justify-center transition active:scale-95"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--txt-60)' }}>+</button>
          </div>
        </div>
      </Section>

      {/* Units */}
      <Section title="Units">
        <div className="flex items-center gap-2 mb-3">
          <Ruler size={17} style={{ color: '#a78bfa' }} />
          <span className="text-[14px]" style={{ color: 'var(--txt-60)' }}>Measurement system</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['metric', 'imperial'].map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className="py-2.5 rounded-xl text-[13px] font-semibold capitalize transition active:scale-95"
              style={unit === u
                ? { background: 'rgba(124,58,237,0.2)', border: '2px solid #7c3aed', color: '#a78bfa' }
                : { background: 'var(--card)', border: '2px solid var(--border)', color: 'var(--txt-40)' }}
            >
              {u === 'metric' ? 'Metric (kg/km)' : 'Imperial (lb/mi)'}
            </button>
          ))}
        </div>
      </Section>

      {/* Save */}
      <button onClick={saveProfile} disabled={saving}
        className="w-full py-3.5 rounded-xl text-white font-black text-[14px] tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
        {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving…' : 'Save Changes'}
      </button>

      {/* Account / Logout */}
      <Section title="Account">
        <button onClick={logout}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl font-semibold text-[14px] transition active:scale-95"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <span className="flex items-center gap-2"><LogOut size={16} /> Sign Out</span>
          <ChevronRight size={16} />
        </button>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-black uppercase tracking-widest mb-2 px-1"
        style={{ color: 'var(--txt-40)' }}>{title}</p>
      <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, icon, children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-[14px]" style={{ color: 'var(--txt-60)' }}>{icon}{label}</span>
      {children}
    </div>
  );
}
