import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import './CreateGroup.css';

const CreateGroup = ({ onClose }) => {
  const { users, createGroup } = useChat();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      alert('Por favor ingresa un nombre para el grupo');
      return;
    }

    if (selectedUsers.length === 0) {
      alert('Por favor selecciona al menos un usuario para el grupo');
      return;
    }

    setIsCreating(true);

    try {
      const groupData = {
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: selectedUsers
      };

      createGroup(groupData);
      
      // Limpiar formulario
      setGroupName('');
      setGroupDescription('');
      setSelectedUsers([]);
      
      // Cerrar modal
      onClose();
      
    } catch (error) {
      console.error('Error al crear grupo:', error);
      alert('Error al crear el grupo. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const isUserSelected = (userId) => selectedUsers.includes(userId);

  return (
    <div className="create-group-overlay">
      <div className="create-group-modal">
        <div className="modal-header">
          <h3>🏗️ Crear Nuevo Grupo</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="form-group">
            <label htmlFor="groupName">Nombre del Grupo:</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej: Equipo de Desarrollo"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="groupDescription">Descripción (opcional):</label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Describe el propósito del grupo..."
              maxLength={200}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Seleccionar Miembros:</label>
            <div className="users-selection">
              {users.length === 0 ? (
                <p className="no-users">No hay usuarios conectados</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`user-selection-item ${isUserSelected(user.id) ? 'selected' : ''}`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <div className="user-avatar">
                      <span className="avatar-emoji">{user.avatar}</span>
                    </div>
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                      <span className="user-status">{user.status}</span>
                    </div>
                    <div className="selection-indicator">
                      {isUserSelected(user.id) ? '✓' : '○'}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="selection-summary">
              {selectedUsers.length > 0 && (
                <span className="selected-count">
                  {selectedUsers.length} usuario{selectedUsers.length !== 1 ? 's' : ''} seleccionado{selectedUsers.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="create-button"
              disabled={isCreating || !groupName.trim() || selectedUsers.length === 0}
            >
              {isCreating ? 'Creando...' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup; 