import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const navItems = [
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/dishes', label: 'Dishes' },
  { to: '/orders/create', label: 'Create Order' },
  { to: '/orders/manage', label: 'Manage Orders' },
  { to: '/payment', label: 'Payment' },
  { to: '/dispatch', label: 'Dispatch & Drone' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/confirm-delivery', label: 'Confirm Delivery' }
];

export default function DashboardLayout({ children }) {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Drone Delivery</h2>
        <p className="tagline">Operate end-to-end drone orders</p>
        <strong>Role:</strong> {role || 'N/A'}
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} style={{ marginTop: 'auto', backgroundColor: '#ef4444', color: 'white' }}>
          Log out
        </button>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
