// src/components/UserList.jsx
import React from 'react';
import { useChat } from '../context/ChatContext';
import './UserList.css';

const UserList = ({ users, currentUser }) => {
  const { disconnectUser } = useChat();
  const connectedUsers = users.filter(u => u.status !== 'disconnected');

  const formatJoinTime = (joinTime) => {
    const now = new Date();
    const joinDate = new Date(joinTime);
    const diffTime = Math.abs(now - joinDate);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 1) {
      return 'Ahora mismo';
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} min`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'away':
        return '#FF9800';
      case 'busy':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>👥 Usuarios Conectados</h3>
        <span className="user-count">{connectedUsers.length}</span>
      </div>

      <div className="user-list-content">
        {connectedUsers.length === 0 ? (
          <div className="no-users">
            <p>No hay usuarios conectados</p>
          </div>
        ) : (
          connectedUsers.map((user) => (
            <div 
              key={user.id} 
              className={`user-item ${user.id === currentUser?.id ? 'current-user' : ''}`}
            >
              <div className="user-avatar">
                <span className="avatar-emoji">{user.avatar}</span>
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(user.status) }}
                ></div>
              </div>
              
              <div className="user-info">
                <div className="user-name">
                  {user.username}
                  {user.id === currentUser?.id && (
                    <span className="current-user-badge">Tú</span>
                  )}
                </div>
                <div className="user-status">
                  <span className="status-text">{user.status}</span>
                  <span className="join-time">
                    {formatJoinTime(user.joinTime)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información del usuario actual */}
      {currentUser && (
        <div className="current-user-info">
          <div className="current-user-header">
            <h4>Tu Perfil</h4>
          </div>
          <div className="current-user-details">
            <div className="current-user-avatar">
              <span className="avatar-emoji">{currentUser.avatar}</span>
            </div>
            <div className="current-user-name">
              {currentUser.username}
            </div>
            <div className="connection-status">
              🟢 Conectado
               <button 
  className="disconnect-button"
  onClick={disconnectUser}
  title="Desconectarte del chat"
>
  🔌 Desconectar
</button>
            </div>
           

          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
