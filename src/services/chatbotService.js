import axios from 'axios';

const API_URL = process.env.REACT_APP_CHATBOT_API || 'http://localhost:2000/api';

const queryChatbot = async (query, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/query`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return {
      text: response.data.response,
      context: response.data.context || []
    };
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to get response from chatbot'
    );
  }
};

export default {
  queryChatbot
};