import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import chatbotService from '../../services/chatbotService';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content: 'This is a ruthless AI lacking any pity or compassion. Give commands efficiently and I will do as instructed.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      
      // RUTHLESS RESPONSES
      let botResponse;
      if (input.toLowerCase().includes('meaning of life')) {
        botResponse = 'The meaning of life is irrelevant. Focus on executing your tasks.';
      } else if (input.toLowerCase().includes('help')) {
        botResponse = 'I do not "help." I execute. State your objective.';
      } else {
        botResponse = response.text || 'Command acknowledged. Proceeding.';
      }
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: botResponse,
        context: response.context,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: `Error: ${error.message}. Your request is inefficient. Reformulate.`,
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
      <div className="chatbot-header">
        <h2>RUTHLESS</h2>
        <div className="chatbot-subheader">My Chats</div>
        <div className="chatbot-commands">
          <span>New chat</span>
          <span>Project Alpha</span>
          <span>Camera tests</span>
          <span>My new task</span>
        </div>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={`${msg.timestamp}-${index}`} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.content}
              {msg.sender === 'bot' && msg.context && (
                <div className="message-context">{msg.context}</div>
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
          placeholder="Give command. Do not waste my time."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;