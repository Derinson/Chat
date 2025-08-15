import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const { joinChat, isConnected } = useChat();

  const avatars = ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🤖', '🐱', '🐶'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      joinChat({ username: username.trim(), avatar });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💬 Chat App</h1>
          <p>Conecta con tu equipo en tiempo real</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu nombre"
              required
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Selecciona un avatar:</label>
            <div className="avatar-grid">
              {avatars.map((av, index) => (
                <button
                  key={index}
                  type="button"
                  className={`avatar-option ${avatar === av ? 'selected' : ''}`}
                  onClick={() => setAvatar(av)}
                >
                  <span className="avatar-emoji">{av}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="join-button"
            disabled={!username.trim() || !isConnected}
          >
            {isConnected ? 'Unirse al Chat' : 'Conectando...'}
          </button>
        </form>

        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 