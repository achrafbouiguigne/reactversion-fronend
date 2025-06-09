import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './dashbord.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Ruthless AI Platform</h1>
        <div className="user-info">
          <span>Logged in as: <strong>{user?.username}</strong></span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Welcome back, {user?.username}!</h2>
        <p className="email-display">Email: {user?.email}</p>

        <div className="dashboard-actions">
          <Link to="/chat" className="chat-link">
             Launch Ruthless Chat
          </Link>
          <Link to="/profile" className="profile-link">
              View Profile
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Ruthless AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
