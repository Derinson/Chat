// src/components/ChatWindow.jsx
import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const ChatWindow = ({ username }) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join', username);

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket, username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { user: username, text: message });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.user === username ? 'right' : 'left' }}>
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatWindow;
