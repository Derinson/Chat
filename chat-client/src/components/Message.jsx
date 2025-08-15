import React from 'react';
import './Message.css';

const Message = ({ message, isOwnMessage, currentUser }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays > 1) {
      return messageDate.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      return formatTime(timestamp);
    }
  };

  const getMessageStatus = () => {
    if (isOwnMessage) {
      return '📤 Enviado';
    }
    return '📥 Recibido';
  };

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-content">
        {/* Avatar y nombre del remitente */}
        <div className="message-header">
          <span className="message-avatar">
            {message.sender === currentUser?.username ? currentUser.avatar : '👤'}
          </span>
          <span className="message-sender">
            {message.sender}
            {isOwnMessage && <span className="own-indicator"> (Tú)</span>}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Contenido del mensaje */}
        <div className="message-text">
          {message.text}
        </div>

        {/* Estado del mensaje */}
        <div className="message-footer">
          <span className="message-status">
            {getMessageStatus()}
          </span>
          <span className="message-date">
            {formatDate(message.timestamp)}
          </span>
        </div>
      </div>

      {/* Indicador visual de tipo de mensaje */}
      <div className={`message-indicator ${isOwnMessage ? 'sent' : 'received'}`}>
        {isOwnMessage ? '➤' : '◀'}
      </div>
    </div>
  );
};

export default Message; 