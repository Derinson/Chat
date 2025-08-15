import React, { createContext, useContext, useReducer, useEffect } from 'react';
import io from 'socket.io-client';

// Estado inicial
const initialState = {
  socket: null,
  currentUser: null,
  users: [],
  messages: [],
  groups: [],
  currentGroup: null,
  isConnected: false,
  isTyping: false,
  typingUsers: [],
  notifications: [],
  connectionError: null
};

// Tipos de acciones
const ACTIONS = {
  SET_SOCKET: 'SET_SOCKET',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_USERS: 'SET_USERS',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  SET_GROUPS: 'SET_GROUPS',
  ADD_GROUP: 'ADD_GROUP',
  UPDATE_GROUP: 'UPDATE_GROUP',
  SET_CURRENT_GROUP: 'SET_CURRENT_GROUP',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_TYPING: 'SET_TYPING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_CONNECTION_ERROR: 'SET_CONNECTION_ERROR'
};

// Reducer para manejar el estado
function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SOCKET:
      return { ...state, socket: action.payload };
    
    case ACTIONS.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
    
    case ACTIONS.SET_USERS:
      return { ...state, users: action.payload };
    
    case ACTIONS.ADD_MESSAGE:
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        notifications: [...state.notifications, {
          id: Date.now(),
          type: 'message',
          message: `Nuevo mensaje de ${action.payload.sender}`,
          timestamp: new Date()
        }]
      };
    
    case ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload };
    
    case ACTIONS.SET_GROUPS:
      return { ...state, groups: action.payload };
    
    case ACTIONS.ADD_GROUP:
      return { 
        ...state, 
        groups: [...state.groups, action.payload],
        notifications: [...state.notifications, {
          id: Date.now(),
          type: 'group',
          message: `Nuevo grupo creado: ${action.payload.name}`,
          timestamp: new Date()
        }]
      };
    
    case ACTIONS.UPDATE_GROUP:
      return { 
        ...state, 
        groups: state.groups.map(g => g.id === action.payload.id ? action.payload : g)
      };
    
    case ACTIONS.SET_CURRENT_GROUP:
      return { ...state, currentGroup: action.payload };
    
    case ACTIONS.SET_CONNECTION_STATUS:
      return { 
        ...state, 
        isConnected: action.payload,
        connectionError: action.payload ? null : state.connectionError
      };
    
    case ACTIONS.SET_TYPING:
      return { 
        ...state, 
        typingUsers: action.payload.isTyping 
          ? [...state.typingUsers.filter(u => u !== action.payload.username), action.payload.username]
          : state.typingUsers.filter(u => u !== action.payload.username)
      };
    
    case ACTIONS.ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload]
      };
    
    case ACTIONS.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    
    case ACTIONS.SET_CONNECTION_ERROR:
      return { ...state, connectionError: action.payload };
    
    default:
      return state;
  }
}

// Crear el contexto
const ChatContext = createContext();

// Hook personalizado para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};

// Proveedor del contexto
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Conectar al servidor de Socket.IO
  useEffect(() => {
    let socket;
    
    try {
      socket = io('http://localhost:3001', {
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      dispatch({ type: ACTIONS.SET_SOCKET, payload: socket });

      // Eventos de conexión
      socket.on('connect', () => {
        console.log('Conectado al servidor de chat');
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: true });
        dispatch({ type: ACTIONS.SET_CONNECTION_ERROR, payload: null });
      });

      socket.on('disconnect', () => {
        console.log('Desconectado del servidor de chat');
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: false });
      });

      socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
        dispatch({ type: ACTIONS.SET_CONNECTION_ERROR, payload: 'Error de conexión al servidor' });
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: false });
      });

      // Eventos del chat
      socket.on('users', (users) => {
        console.log('Usuarios actualizados:', users);
        dispatch({ type: ACTIONS.SET_USERS, payload: users });
      });

      socket.on('messages', (messages) => {
        dispatch({ type: ACTIONS.SET_MESSAGES, payload: messages });
      });

      socket.on('message', (message) => {
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: message });
      });

      socket.on('groups', (groups) => {
        dispatch({ type: ACTIONS.SET_GROUPS, payload: groups });
      });

      socket.on('groupCreated', (group) => {
        dispatch({ type: ACTIONS.ADD_GROUP, payload: group });
      });

      socket.on('groupUpdated', (group) => {
        dispatch({ type: ACTIONS.UPDATE_GROUP, payload: group });
      });

      socket.on('groupMessage', (data) => {
        // Manejar mensajes de grupo
        if (state.currentGroup && data.groupId === state.currentGroup.id) {
          dispatch({ type: ACTIONS.ADD_MESSAGE, payload: data.message });
        }
      });

      socket.on('userJoined', (user) => {
        dispatch({ 
          type: ACTIONS.ADD_NOTIFICATION, 
          payload: {
            id: Date.now(),
            type: 'userJoined',
            message: `${user.username} se unió al chat`,
            timestamp: new Date()
          }
        });
      });

      socket.on('userLeft', (user) => {
        dispatch({ 
          type: ACTIONS.ADD_NOTIFICATION, 
          payload: {
            id: Date.now(),
            type: 'userLeft',
            message: `${user.username} se desconectó`,
            timestamp: new Date()
          }
        });
      });

      socket.on('userTyping', (data) => {
        dispatch({ type: ACTIONS.SET_TYPING, payload: data });
      });

      // Ping para mantener conexión activa
      const pingInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit('ping');
        }
      }, 30000); // Ping cada 30 segundos

      return () => {
        clearInterval(pingInterval);
        if (socket) {
          socket.disconnect();
        }
      };

    } catch (error) {
      console.error('Error al crear socket:', error);
      dispatch({ type: ACTIONS.SET_CONNECTION_ERROR, payload: 'Error al inicializar la conexión' });
    }
  }, []);

  useEffect(() => {
    if (!state.socket) return;

    state.socket.on('users', (users) => {
      dispatch({ type: ACTIONS.SET_USERS, payload: users });
    });

    return () => {
      state.socket.off('users');
    };
  }, [state.socket]);

  // Funciones para interactuar con el chat
  const joinChat = (userData) => {
    if (state.socket && state.isConnected) {
      state.socket.emit('join', userData);
      dispatch({ type: ACTIONS.SET_CURRENT_USER, payload: userData });
    }
  };

  const sendMessage = (text, groupId = null, extra = {}) => {
    if (state.socket && state.currentUser && state.isConnected) {
      const messageData = {
        text,
        sender: state.currentUser.username,
        senderId: state.currentUser.id,
        timestamp: new Date(),
        groupId,
        ...extra // type, fileUrl, fileName, etc.
      };
      state.socket.emit('message', messageData);
    }
  };

  const setTyping = (isTyping, groupId = null) => {
    if (state.socket && state.isConnected) {
      const data = { isTyping };
      if (groupId) {
        data.groupId = groupId;
      }
      state.socket.emit('typing', data);
    }
  };

  const createGroup = (groupData) => {
    if (state.socket && state.isConnected) {
      state.socket.emit('createGroup', groupData);
    }
  };

  const joinGroup = (groupId) => {
    if (state.socket && state.isConnected) {
      state.socket.emit('joinGroup', groupId);
    }
  };

  const leaveGroup = (groupId) => {
    if (state.socket && state.isConnected) {
      state.socket.emit('leaveGroup', groupId);
      if (state.currentGroup && state.currentGroup.id === groupId) {
        dispatch({ type: ACTIONS.SET_CURRENT_GROUP, payload: null });
      }
    }
  };

  const setCurrentGroup = (group) => {
    dispatch({ type: ACTIONS.SET_CURRENT_GROUP, payload: group });
  };

  const clearNotifications = () => {
    dispatch({ type: ACTIONS.CLEAR_NOTIFICATIONS });
  };

  const disconnectUser = () => {
    if (state.socket && state.isConnected) {
      state.socket.emit('disconnectUser', state.currentUser);
      state.socket.disconnect();
      dispatch({ type: ACTIONS.SET_CURRENT_USER, payload: null });
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: false });
      localStorage.removeItem('chatUser');
      window.location.reload(); // <-- Recarga la página al desconectar
    }
  };

  const value = {
    ...state,
    joinChat,
    sendMessage,
    setTyping,
    createGroup,
    joinGroup,
    leaveGroup,
    setCurrentGroup,
    clearNotifications,
    disconnectUser
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};