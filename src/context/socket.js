import { createContext } from "react";
import socketio from "socket.io-client";

export const oracleSocket1 = socketio.connect(new Date().getTimezoneOffset() < -120 ? 'https://us1.tigrisoracle.net' : 'https://eu1.tigrisoracle.net', {transports: ['websocket'] });
oracleSocket1.on('connect', () => {
    console.log('[oracleSocket1] Connected');
});
  
oracleSocket1.on('disconnect', (reason) => {
    console.log('[oracleSocket1] Disconnected:', reason);
});

oracleSocket1.on('error', (error) => {
    console.log('[oracleSocket1] Error:', error);
});

oracleSocket1.on('data', (data) => {
    oracleData = data;
    lastOracleTime = Date.now();
});

export const priceChangeSocket = socketio.connect('https://price-change-server-n43ne.ondigitalocean.app', {transports: ['websocket'] });
priceChangeSocket.on('connect', () => {
    console.log('[priceChangeSocket] Connected');
});
  
priceChangeSocket.on('disconnect', (reason) => {
    console.log('[priceChangeSocket] Disconnected:', reason);
});

priceChangeSocket.on('error', (error) => {
    console.log('[priceChangeSocket] Error:', error);
});

priceChangeSocket.on('data', (data) => {
    priceChangeData = data;
});

export const chatSocket = socketio.connect('https://chatbox-server-l9yj9.ondigitalocean.app', {transports: ['websocket']});
chatSocket.on('disconnect', (reason) => {
    console.log('[chatSocket] Disconnected:', reason);
});

export let oracleData = "Loading...";

export let priceChangeData = "Loading...";

export let lastOracleTime = 0;

export const SocketContext = createContext();