# 💬 Chat App - Aplicación de Chat en Tiempo Real

Una aplicación de chat moderna y funcional desarrollada con React y Socket.IO, diseñada para facilitar la comunicación instantánea entre empleados y mejorar la colaboración en tiempo real.

## 🚀 Características Principales

- **Chat en tiempo real** con Socket.IO
- **Gestión de usuarios** conectados con avatares personalizables
- **Envío y recepción de mensajes** instantáneos
- **Indicador de escritura** para mostrar cuando alguien está escribiendo
- **Sistema de notificaciones** para nuevos mensajes y eventos
- **Diferencia visual** entre mensajes enviados y recibidos
- **Interfaz responsive** que funciona en todos los dispositivos
- **Patrón arquitectónico MVC** para código limpio y mantenible

## 🏗️ Arquitectura del Proyecto

El proyecto sigue el patrón **MVC (Model-View-Controller)**:

- **Model**: `ChatContext.jsx` - Maneja el estado global y la lógica de negocio
- **View**: Componentes React que renderizan la interfaz de usuario
- **Controller**: Lógica de manejo de eventos y comunicación con el servidor

### Estructura de Carpetas

```
chat-app/
├── chat-server/          # Servidor Node.js + Socket.IO
│   ├── index.js         # Servidor principal
│   └── package.json     # Dependencias del servidor
├── chat-client/         # Cliente React
│   ├── src/
│   │   ├── components/  # Componentes de la UI
│   │   ├── context/     # Contexto global (Model)
│   │   └── App.jsx      # Componente principal
│   └── package.json     # Dependencias del cliente
└── README.md            # Este archivo
```

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Navegador web** moderno

## 🛠️ Instalación y Configuración

### 1. Clonar o Descargar el Proyecto

```bash
# Si tienes Git instalado
git clone <url-del-repositorio>
cd chat-app

# O simplemente descarga y extrae el archivo ZIP
```

### 2. Instalar Dependencias del Servidor

```bash
cd chat-server
npm install
```

### 3. Instalar Dependencias del Cliente

```bash
cd ../chat-client
npm install
```

## 🚀 Ejecutar la Aplicación

### Opción 1: Ejecutar en Terminales Separadas (Recomendado)

**Terminal 1 - Servidor:**
```bash
cd chat-server
npm start
```

**Terminal 2 - Cliente:**
```bash
cd chat-client
npm start
```

### Opción 2: Ejecutar con Nodemon (Desarrollo)

**Terminal 1 - Servidor con recarga automática:**
```bash
cd chat-server
npm run dev
```

**Terminal 2 - Cliente:**
```bash
cd chat-client
npm start
```

## 🌐 Acceso a la Aplicación

- **Cliente (Frontend)**: http://localhost:3000
- **Servidor (Backend)**: http://localhost:3001
- **WebSocket**: ws://localhost:3001

## 📱 Cómo Usar la Aplicación

### 1. **Conectarse al Chat**
- Abre http://localhost:3000 en tu navegador
- Ingresa tu nombre de usuario
- Selecciona un avatar personalizado
- Haz clic en "Unirse al Chat"

### 2. **Enviar Mensajes**
- Escribe tu mensaje en el campo de texto
- Presiona **Enter** para enviar
- Usa **Shift + Enter** para nueva línea

### 3. **Funcionalidades Disponibles**
- Ver usuarios conectados en tiempo real
- Indicador de escritura cuando alguien está escribiendo
- Notificaciones de nuevos mensajes
- Diferenciación visual entre mensajes propios y de otros
- Interfaz responsive para móviles y tablets

## 🔧 Configuración Avanzada

### Variables de Entorno

Puedes crear un archivo `.env` en la carpeta `chat-server`:

```env
PORT=3001
NODE_ENV=development
```

### Personalizar el Servidor

Edita `chat-server/index.js` para:
- Cambiar el puerto del servidor
- Modificar la configuración de CORS
- Agregar nuevas funcionalidades de chat

### Personalizar el Cliente

Edita `chat-client/src/context/ChatContext.jsx` para:
- Modificar el comportamiento del chat
- Agregar nuevas funcionalidades
- Cambiar la lógica de estado

## 🎨 Personalización de Estilos

Los estilos están organizados por componente en archivos CSS separados:

- `App.css` - Estilos principales
- `Login.css` - Estilos del formulario de login
- `Chat.css` - Estilos del chat principal
- `MessageList.css` - Estilos de la lista de mensajes
- `Message.css` - Estilos de mensajes individuales
- `UserList.css` - Estilos de la lista de usuarios
- `NotificationPanel.css` - Estilos del panel de notificaciones

## 🐛 Solución de Problemas


### Error: "Módulo no encontrado"
```bash
# Reinstala las dependencias
cd chat-server && npm install
cd ../chat-client && npm install
```

### Error: "Conexión rechazada"
- Verifica que el servidor esté ejecutándose en el puerto 3001
- Asegúrate de que no haya firewall bloqueando la conexión

## 📚 Tecnologías Utilizadas

- **Frontend**: React 18, CSS3, HTML5
- **Backend**: Node.js, Express, Socket.IO
- **Estado**: React Context API + useReducer
- **Comunicación**: WebSockets (Socket.IO)
- **Estilos**: CSS personalizado con animaciones y responsive design

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de "Solución de Problemas" arriba
2. Verifica que todas las dependencias estén instaladas correctamente
3. Asegúrate de que los puertos 3000 y 3001 estén disponibles
4. Revisa la consola del navegador para errores de JavaScript

## 🎯 Próximas Funcionalidades

- [ ] Chat privado entre usuarios
- [ ] Envío de archivos e imágenes
- [ ] Emojis y reacciones a mensajes
- [ ] Historial de mensajes persistente
- [ ] Autenticación de usuarios
- [ ] Salas de chat temáticas
- [ ] Notificaciones push del navegador

---

**¡Disfruta chateando con tu equipo! 🎉** 