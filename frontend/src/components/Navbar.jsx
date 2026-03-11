import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';
import { 
  Home, 
  Calendar, 
  LayoutDashboard, 
  History, 
  Settings, 
  Clock, 
  User, 
  LogOut,
  MapPin
} from 'lucide-react';

const Navbar = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserInfo(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }) => (
    <li>
      <Link 
        to={to} 
        className={`nav-link ${isActive(to) ? 'active' : ''}`}
      >
        <Icon size={18} />
        <span>{children}</span>
      </Link>
    </li>
  );

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <MapPin className="logo-icon" size={24} />
          <span>Darshan Ease</span>
        </Link>
        
        <nav>
          <ul className="nav-links">
            {/* Public / Unauthenticated Navigation */}
            {!userInfo && (
              <>
                <NavLink to="/" icon={Home}>Home</NavLink>
                <NavLink to="/temples" icon={Calendar}>Darshan Booking</NavLink>
              </>
            )}

            {/* Authenticated Navigation based on Role */}
            {userInfo && (
              <>
                {userInfo.role === 'User' && (
                  <>
                    <NavLink to="/temples" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/history" icon={History}>My Bookings</NavLink>
                  </>
                )}
                
                {userInfo.role === 'Organizer' && (
                  <>
                    <NavLink to="/organizer" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/organizer" icon={Clock}>Manage Slots</NavLink>
                  </>
                )}

                {userInfo.role === 'Admin' && (
                  <>
                    <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/admin" icon={Settings}>Management</NavLink>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        <ul className="nav-actions">
          {userInfo ? (
            <>
              <li className="user-profile">
                <div className="avatar">
                  <User size={18} />
                </div>
                <span className="user-name">{userInfo.name.split(' ')[0]}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-logout" title="Logout">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="login-link">Login</Link></li>
              <li><Link to="/register" className="btn btn-primary">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
