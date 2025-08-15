import React from 'react';
import './NotificationPanel.css';

const NotificationPanel = ({ notifications, onClose, onClear }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'userJoined':
        return '👋';
      case 'userLeft':
        return '👋';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'message':
        return '#2196F3';
      case 'userJoined':
        return '#4CAF50';
      case 'userLeft':
        return '#FF9800';
      default:
        return '#9C27B0';
    }
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>🔔 Notificaciones</h3>
        <div className="notification-actions">
          <button 
            className="clear-all-btn"
            onClick={onClear}
            disabled={notifications.length === 0}
          >
            Limpiar Todo
          </button>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="notification-content">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔕</div>
            <p>No hay notificaciones</p>
            <span>Las notificaciones aparecerán aquí cuando recibas mensajes o usuarios se unan/salgan</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="notification-item"
              style={{ borderLeftColor: getNotificationColor(notification.type) }}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">
                  {formatTime(notification.timestamp)}
                </div>
              </div>

              <div className="notification-type-badge">
                {notification.type === 'message' && 'Mensaje'}
                {notification.type === 'userJoined' && 'Usuario'}
                {notification.type === 'userLeft' && 'Usuario'}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-footer">
          <span className="notification-count">
            {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 