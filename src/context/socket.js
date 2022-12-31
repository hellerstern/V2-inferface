import { createContext } from "react";
import socketio from "socket.io-client";

export const priceStreamSocket = socketio.connect('https://frontend-prices-795bp.ondigitalocean.app/', {transports: ['websocket'] });
priceStreamSocket.on('connect', () => {
    console.log('[priceStreamSocket] Connected');
});
  
priceStreamSocket.on('disconnect', (reason) => {
    console.log('[priceStreamSocket] Disconnected:', reason);
});

priceStreamSocket.on('error', (error) => {
    console.log('[priceStreamSocket] Error:', error);
});

export const oracleSocket = socketio.connect('https://spread-oracle-ymtyv.ondigitalocean.app/', {transports: ['websocket'] });
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
});

export const chatSocket = socketio.connect('https://chatbox-server-l9yj9.ondigitalocean.app', {
    transports: ['websocket'],
    pingTimeout: 30000,
    pingInterval: 30000
});

chatSocket.on('disconnect', (reason) => {
    console.log('[chatSocket] Disconnected:', reason);
});

export let oracleData = "Loading...";

export const SocketContext = createContext();