import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const userData = await authService.getMe();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Load chat history from localStorage if exists
        const savedChats = localStorage.getItem(`chatHistory_${userData.id}`);
        if (savedChats) {
          setChatHistory(JSON.parse(savedChats));
        }
      } catch (err) {
        localStorage.removeItem('token');
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const data = await authService.register(formData);
      localStorage.setItem('token', data.token);
      setUser({ id: data.id, username: data.username, email: data.email });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const login = async (formData) => {
    try {
      const data = await authService.login(formData);
      localStorage.setItem('token', data.token);
      setUser({ id: data.id, username: data.username, email: data.email });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setChatHistory([]);
  };

  const saveChat = (newChat) => {
    if (!user) return;
    
    const updatedHistory = [...chatHistory, newChat];
    setChatHistory(updatedHistory);
    localStorage.setItem(
      `chatHistory_${user.id}`,
      JSON.stringify(updatedHistory)
    );
  };

  const clearChatHistory = () => {
    if (!user) return;
    
    setChatHistory([]);
    localStorage.removeItem(`chatHistory_${user.id}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        chatHistory,
        register,
        login,
        logout,
        saveChat,
        clearChatHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;