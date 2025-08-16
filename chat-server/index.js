const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Almacenar usuarios conectados y grupos
let users = [];
let messages = [];
let groups = [];

// Función para obtener usuarios conectados
const getConnectedUsers = () => {
  return users.filter(user => user.status !== 'disconnected');
};

// Función para crear un grupo
const createGroup = (groupData, creatorId) => {
  const group = {
    id: Date.now().toString(),
    name: groupData.name,
    description: groupData.description || '',
    creator: creatorId,
    members: [creatorId],
    createdAt: new Date(),
    messages: []
  };
  
  groups.push(group);
  return group;
};

// Función para agregar usuario a grupo
const addUserToGroup = (groupId, userId) => {
  const group = groups.find(g => g.id === groupId);
  const user = users.find(u => u.id === userId);
  
  if (group && user && !group.members.includes(userId)) {
    group.members.push(userId);
    return true;
  }
  return false;
};

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Usuario se une al chat
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar || '👤',
      status: 'online',
      joinTime: new Date(),
      lastSeen: new Date()
    };
    
    socket.user = user;
    
    // Verificar si el usuario ya existe
    const existingUserIndex = users.findIndex(u => u.username === userData.username);
    if (existingUserIndex !== -1) {
      // Actualizar usuario existente
      users[existingUserIndex] = { ...users[existingUserIndex], ...user };
    } else {
      // Agregar nuevo usuario
      users.push(user);
    }
    
    // Enviar lista actualizada de usuarios a todos
    io.emit('users', getConnectedUsers());
    
    // Enviar mensajes existentes al nuevo usuario
    socket.emit('messages', messages);
    
    // Enviar grupos disponibles
    socket.emit('groups', groups);
    
    // Notificar a todos que un usuario se unió
    io.emit('userJoined', user);
    
    console.log(`Usuario ${user.username} se unió al chat. Total usuarios: ${getConnectedUsers().length}`);
  });

  // Usuario envía un mensaje
  socket.on('message', (messageData) => {
    const message = {
      id: Date.now(),
      text: messageData.text,
      sender: socket.user.username,
      senderId: socket.id,
      timestamp: new Date(),
      type: 'received',
      groupId: messageData.groupId || null
    };
    
    if (messageData.groupId) {
      // Mensaje de grupo
      const group = groups.find(g => g.id === messageData.groupId);
      if (group && group.members.includes(socket.id)) {
        group.messages.push(message);
        // Enviar a todos los miembros de la room del grupo
        io.to(messageData.groupId).emit('groupMessage', { groupId: messageData.groupId, message });
      }
    } else {
      // Mensaje global
      messages.push(message);
      io.emit('message', message);
    }
    
    console.log(`Mensaje de ${message.sender}: ${message.text}`);
  });

  // Usuario está escribiendo
  socket.on('typing', (data) => {
    if (data.groupId) {
      // Escribiendo en grupo
      const group = groups.find(g => g.id === data.groupId);
      if (group && group.members.includes(socket.id)) {
        socket.to(data.groupId).emit('userTyping', {
          username: socket.user.username,
          isTyping: data.isTyping,
          groupId: data.groupId
        });
      }
    } else {
      // Escribiendo en chat global
      socket.broadcast.emit('userTyping', {
        username: socket.user.username,
        isTyping: data.isTyping
      });
    }
  });

  // Crear grupo
  socket.on('createGroup', (groupData) => {
    const group = createGroup(groupData, socket.id);
    io.emit('groupCreated', group);
    console.log(`Grupo "${group.name}" creado por ${socket.user.username}`);
  });

  // Unirse a grupo
  socket.on('joinGroup', (groupId) => {
    if (addUserToGroup(groupId, socket.id)) {
      const group = groups.find(g => g.id === groupId);
      socket.join(groupId); // <-- Únete a la room del grupo
      socket.emit('groupJoined', group);
      io.emit('groupUpdated', group);
      console.log(`${socket.user.username} se unió al grupo "${group.name}"`);
    }
  });

  // Salir de grupo
  socket.on('leaveGroup', (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      group.members = group.members.filter(id => id !== socket.id);
      socket.leave(groupId); // <-- Sal de la room del grupo
      socket.emit('groupLeft', groupId);
      io.emit('groupUpdated', group);
      console.log(`${socket.user.username} salió del grupo "${group.name}"`);
    }
  });

  // Usuario solicita usuarios conectados
  socket.on('getUsers', () => {
    socket.emit('users', getConnectedUsers());
  });

  // Usuario solicita grupos
  socket.on('getGroups', () => {
    socket.emit('groups', groups);
  });

  // Usuario se desconecta
  socket.on('disconnect', () => {
    // Elimina el usuario del array
    users = users.filter(u => u.id !== socket.id);
    // Emite la lista actualizada de usuarios conectados
    io.emit('users', users);
  });

  // Ping para mantener conexión activa
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de Chat funcionando correctamente',
    users: getConnectedUsers().length,
    messages: messages.length,
    groups: groups.length,
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener estadísticas
app.get('/stats', (req, res) => {
  res.json({
    totalUsers: users.length,
    connectedUsers: getConnectedUsers().length,
    totalMessages: messages.length,
    totalGroups: groups.length,
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
 console.log(`🚀 Servidor de chat corriendo en puerto ${PORT}`);
  console.log(`🖥️ Cliente disponible en: http://localhost:3000`);
  console.log(`🔗 WebSocket disponible en: ws://localhost:${PORT}`);
  console.log(`📊 Estadísticas en: http://localhost:${PORT}/stats`);
});

// Limpiar usuarios desconectados cada 5 minutos
setInterval(() => {
  const now = new Date();
  users = users.filter(user => {
    if (user.status === 'disconnected') {
      const timeDiff = now - user.lastSeen;
      return timeDiff < 10 * 60 * 1000; // Mantener por 10 minutos
    }
    return true;
  });
  
  if (users.length > 0) {
    console.log(`Usuarios en memoria: ${users.length}, Conectados: ${getConnectedUsers().length}`);
  }
}, 5 * 60 * 1000);
