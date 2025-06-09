import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './profile.css'; // This file will share styles with chatbot.css

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <h2>👤 Profile Overview</h2>
        <div className="chatbot-subheader">Brutally honest. No filters.</div>
        
      </div>

      {/* Profile Content */}
      <div className="chatbot-messages">
        <div className="message bot">
          <div className="message-content">
            <strong>Username:</strong> {user?.username || 'Anonymous'}
          </div>
        </div>

        <div className="message bot">
          <div className="message-content">
            <strong>Email:</strong> {user?.email || 'Not available'}
          </div>
        </div>

        

        <div className="message-context">
          Remember, you're not special just because you logged in. Keep grinding.
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default Profile;
