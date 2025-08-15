import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageList from './MessageList';
import UserList from './UserList';
import NotificationPanel from './NotificationPanel';
import CreateGroup from './CreateGroup';
import './Chat.css';

const Chat = () => {
  const { 
    currentUser, 
    users, 
    messages, 
    groups,
    currentGroup,
    sendMessage, 
    setTyping, 
    typingUsers,
    notifications,
    clearNotifications,
    setCurrentGroup
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroups, setShowGroups] = useState(false);  const messagesEndRef = useRef(null);

  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText.trim(), currentGroup?.id);
      setMessageText('');
      setTyping(false, currentGroup?.id);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (e.target.value.length > 0) {
      setTyping(true, currentGroup?.id);
    } else {
      setTyping(false, currentGroup?.id);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
    setShowGroups(false);
  };

  const getCurrentMessages = () => {
    if (currentGroup) {
      return currentGroup.messages || [];
    }
    return messages;
  };

  const getCurrentTypingUsers = () => {
    if (currentGroup) {
      return typingUsers.filter(t => t.groupId === currentGroup.id);
    }
    return typingUsers.filter(t => !t.groupId);
  };

  return (
    <div className="chat-container">
      {/* Header del chat */}
      <div className="chat-header">
        <div className="chat-title">
          <h2>
            {currentGroup ? `👥 ${currentGroup.name}` : '💬 Chat en Tiempo Real'}
          </h2>
          <span className="online-indicator">
            {users.length} usuarios conectados
            {currentGroup && ` • ${currentGroup.members?.length || 0} en grupo`}
          </span>
        </div>
        
        <div className="user-info">
          <span className="user-avatar">{currentUser?.avatar}</span>
          <span className="username">{currentUser?.username}</span>
        </div>

        <div className="header-actions">
          {/* Botón de grupos */}
          <button 
            className="groups-button"
            onClick={() => setShowGroups(!showGroups)}
            title="Ver grupos"
          >
            👥
          </button>
          
          {/* Botón de crear grupo */}
          <button 
            className="create-group-button"
            onClick={() => setShowCreateGroup(true)}
            title="Crear grupo"
          >
            ➕
          </button>
          
          {/* Botón de notificaciones */}
          <button 
            className="notification-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔 {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="chat-main">
        {/* Panel de notificaciones */}
        {showNotifications && (
          <NotificationPanel 
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onClear={clearNotifications}
          />
        )}

        {/* Panel de grupos */}
        {showGroups && (
          <div className="groups-panel">
            <div className="groups-header">
              <h3>👥 Grupos Disponibles</h3>
              <button 
                className="close-panel"
                onClick={() => setShowGroups(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="groups-list">
              {groups.length === 0 ? (
                <div className="no-groups">
                  <p>No hay grupos disponibles</p>
                  <button 
                    className="create-first-group"
                    onClick={() => {
                      setShowGroups(false);
                      setShowCreateGroup(true);
                    }}
                  >
                    Crear Primer Grupo
                  </button>
                </div>
              ) : (
                <>
                  <div 
                    className={`group-item ${!currentGroup ? 'active' : ''}`}
                    onClick={() => handleGroupSelect(null)}
                  >
                    <div className="group-icon">💬</div>
                    <div className="group-info">
                      <div className="group-name">Chat General</div>
                      <div className="group-description">Conversación global</div>
                    </div>
                  </div>
                  
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`group-item ${currentGroup?.id === group.id ? 'active' : ''}`}
                      onClick={() => handleGroupSelect(group)}
                    >
                      <div className="group-icon">👥</div>
                      <div className="group-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-description">
                          {group.description || `${group.members?.length || 0} miembros`}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="chat-sidebar">
          <UserList users={users} currentUser={currentUser} />
        </div>

        {/* Área principal del chat */}
        <div className="chat-content">
          {/* Lista de mensajes */}
          <MessageList 
            messages={getCurrentMessages()} 
            currentUser={currentUser}
            typingUsers={getCurrentTypingUsers()}
            currentGroup={currentGroup}
          />
          
          {/* Indicador de escritura */}
          {getCurrentTypingUsers().length > 0 && (
            <div className="typing-indicator">
              {getCurrentTypingUsers().map(t => t.username).join(', ')} está escribiendo...
            </div>
          )}

          {/* Referencia para auto-scroll */}
          <div ref={messagesEndRef} />

          {/* Formulario de envío de mensajes */}
          <form onSubmit={handleSubmit} className="message-form">
            <div className="message-input-container">
              <textarea
                value={messageText}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentGroup 
                    ? `Escribe un mensaje para ${currentGroup.name}...`
                    : "Escribe tu mensaje aquí..."
                }
                className="message-input"
                rows="1"
                maxLength="500"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!messageText.trim()}
              >
                📤
              </button>
            </div>
            
            <div className="message-actions">
              <span className="char-count">
                {messageText.length}/500
              </span>
              <span className="hint">
                Presiona Enter para enviar, Shift+Enter para nueva línea
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de creación de grupos */}
      {showCreateGroup && (
        <CreateGroup onClose={() => setShowCreateGroup(false)} />
      )}
    </div>
  );
};

export default Chat; 