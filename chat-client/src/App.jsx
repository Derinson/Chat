import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Login from './components/Login';
import Chat from './components/Chat';
import { useChat } from './context/ChatContext';
import './App.css';

// Componente principal que decide qué mostrar
const ChatApp = () => {
  const { currentUser, isConnected, connectionError } = useChat();

  // Si hay error de conexión, mostrar mensaje de error
  if (connectionError) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>💬 Chat App</h1>
            <p>Error de conexión</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', color: '#ff4757' }}>
            <p>❌ No se pudo conectar al servidor</p>
            <p>Verifica que el servidor esté ejecutándose en el puerto 3001</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no está conectado, mostrar pantalla de carga
  if (!isConnected) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>💬 Chat App</h1>
            <p>Conectando al servidor...</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="loading-spinner"></div>
            <p>Conectando al servidor de chat...</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Asegúrate de que el servidor esté ejecutándose
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si está conectado pero no hay usuario, mostrar login
  if (!currentUser) {
    return <Login />;
  }

  // Si está conectado y hay usuario, mostrar chat
  return <Chat />;
};

// Componente principal envuelto en el proveedor
const App = () => {
  return (
    <ChatProvider>
      <div className="App">
        <ChatApp />
      </div>
    </ChatProvider>
  );
};

export default App;
