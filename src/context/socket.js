import { createContext } from "react";
import socketio from "socket.io-client";

export const oracleSocket = socketio.connect('https://pyth-oracle-3io8n.ondigitalocean.app', {transports: ['websocket'] });
oracleSocket.on('connect', () => {
    console.log('[oracleSocket] Connected');
});
  
oracleSocket.on('disconnect', (reason) => {
    console.log('[oracleSocket] Disconnected:', reason);
});

oracleSocket.on('error', (error) => {
    console.log('[oracleSocket] Error:', error);
});

oracleSocket.on('data', (data) => {
    oracleData = data;
    lastOracleTime = Date.now();
});

export const chatSocket = socketio.connect('https://chatbox-server-l9yj9.ondigitalocean.app', {transports: ['websocket']});

chatSocket.on('disconnect', (reason) => {
    console.log('[chatSocket] Disconnected:', reason);
});

export let oracleData = "Loading...";
export let lastOracleTime = 0;

export const SocketContext = createContext();