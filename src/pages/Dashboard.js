import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.username}!</h2>
      <p>Email: {user?.email}</p>
      
      <div className="dashboard-actions">
        <Link to="/chat" className="chat-link">
          Go to Ruthless Chat
        </Link>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;