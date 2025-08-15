import React from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages, currentUser, typingUsers }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>¡Bienvenido al chat!</h3>
          <p>Envía el primer mensaje para comenzar la conversación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date} className="message-date-group">
          <div className="date-separator">
            <span className="date-text">{date}</span>
          </div>
          
          {dateMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUser?.id || message.sender === currentUser?.username}
              currentUser={currentUser}
            />
          ))}
        </div>
      ))}
      
      {/* Indicador de escritura */}
      {typingUsers.length > 0 && (
        <div className="typing-indicator-message">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">
            {typingUsers.join(', ')} está escribiendo...
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageList; 