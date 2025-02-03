import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.SOCKET_URL || "ws://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error);
});

export const connectSocket = () => {
  socket.connect();
};

export const listenForProgressUpdates = (callback: (data: any) => void) => {
  socket.on("progressUpdate", callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};
