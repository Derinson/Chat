// src/context/SocketContext.js
import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001'); // Cambia si usas otro puerto
export const SocketContext = createContext();
