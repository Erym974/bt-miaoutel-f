import { io } from 'socket.io-client';
import config from './config.tsx'

export const socket = io(config.SOCKET_BASE_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 3
});