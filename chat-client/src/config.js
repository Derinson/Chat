// Configuración del cliente de chat
const config = {
  // URL del servidor de Socket.IO
  SERVER_URL: process.env.REACT_APP_SERVER_URL || 'http://localhost:3001',
  
  // Configuración de reconexión
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  
  // Configuración de mensajes
  MAX_MESSAGE_LENGTH: 500,
  TYPING_TIMEOUT: 2000,
  
  // Configuración de notificaciones
  NOTIFICATION_TIMEOUT: 5000,
  MAX_NOTIFICATIONS: 50,
  
  // Configuración de la interfaz
  MESSAGES_PER_PAGE: 50,
  AUTO_SCROLL_DELAY: 100,
  
  // Configuración de avatares
  DEFAULT_AVATAR: '👤',
  AVATAR_OPTIONS: ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🤖', '🐱', '🐶'],
  
  // Configuración de colores (para temas futuros)
  COLORS: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9800',
    ERROR: '#F44336',
    INFO: '#2196F3'
  }
};

export default config; 