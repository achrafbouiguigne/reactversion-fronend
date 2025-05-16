import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import chatbotService from '../../services/chatbotService';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, {
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }]);
    
    try {
      const token = localStorage.getItem('token');
      const response = await chatbotService.queryChatbot(input, token);
      
      // Add bot response - properly accessing response.text
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: response.text,
        context: response.context,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={`${msg.timestamp}-${index}`} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.content}
              {msg.sender === 'bot' && msg.context && (
                <div className="message-context">
                  <details>
                    <summary>Sources</summary>
                    <ul>
                      {msg.context.map((source, i) => (
                        <li key={i}>{source}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;