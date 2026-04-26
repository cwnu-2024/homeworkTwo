import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, Plus, BarChart2, Settings } from 'lucide-react';

const tabs = [
  { path: '/',         icon: Home,      label: 'Home'     },
  { path: '/history',  icon: Clock,     label: 'History'  },
  { path: '/add',      icon: Plus,      label: 'Add',     special: true },
  { path: '/stats',    icon: BarChart2, label: 'Stats'    },
  { path: '/settings', icon: Settings,  label: 'Settings' },
];

function getActiveTab(pathname) {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/history') || pathname.startsWith('/workout')) return '/history';
  if (pathname.startsWith('/add') || pathname.startsWith('/edit')) return '/add';
  if (pathname.startsWith('/stats')) return '/stats';
  if (pathname.startsWith('/settings')) return '/settings';
  return '';
}

export default function BottomNav() {
  const location = useLocation();
  const activeTab = getActiveTab(location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto flex items-end z-50"
      style={{
        background: 'color-mix(in srgb, var(--pg) 92%, transparent)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom,0px)',
      }}>
      {tabs.map(({ path, icon: Icon, label, special }) => {
        const active = activeTab === path;
        if (special) {
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center pb-1 -mt-5"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 4px 20px rgba(124,58,237,0.5)' }}>
                <Icon size={26} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] mt-1 font-semibold" style={{ color: 'var(--txt-60)' }}>{label}</span>
            </Link>
          );
        }
        return (
          <Link
            key={path}
            to={path}
            className="flex-1 flex flex-col items-center justify-end pb-2 pt-2 min-h-[56px] transition-colors"
          >
            <div className="flex items-center justify-center w-11 h-9 rounded-2xl mb-0.5 transition-all"
              style={active ? { background: 'rgba(124,58,237,0.18)' } : {}}>
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? '#a78bfa' : 'var(--txt-40)' }}
              />
            </div>
            <span className="text-[10px] tracking-wide font-semibold"
              style={{ color: active ? '#a78bfa' : 'var(--txt-40)' }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
