const WebSocket = require('ws');

const WEBSOCKET_URL = 'ws://localhost:8080/ws';
const websocket = new WebSocket(WEBSOCKET_URL);

websocket.on('open', () => {
  console.log('WebSocket connection opened');
  websocket.send('Hello, server!');
});

websocket.on('message', (data) => {
  console.log('Message from server:', data);
});

websocket.on('close', (code, reason) => {
  console.log(`WebSocket connection closed: ${code} - ${reason}`);
});

websocket.on('error', (error) => {
  console.error('WebSocket error:', error);
});