import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Chatbot from '../components/chatbot/Chatbot';

const ChatPage = () => {
  const { user, logout, chatHistory, clearChatHistory } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="chat-page-container">
      <Chatbot 
        user={user} 
        chatHistory={chatHistory}
        onLogout={handleLogout}
        onClearHistory={clearChatHistory}
      />
    </div>
  );
};

export default ChatPage;