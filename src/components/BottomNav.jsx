import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: 'Home' },
  { path: '/audit', icon: '📋', label: 'Audit' },
  { path: '/checklist', icon: '☑️', label: 'Checklist' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const NAV_PATHS = NAV_ITEMS.map((n) => n.path);

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show on top-level pages
  if (!NAV_PATHS.includes(location.pathname)) return null;

  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {active ? (
              <div className="nav-icon-wrap">
                <span className="nav-icon">{item.icon}</span>
              </div>
            ) : (
              <span className="nav-icon">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
