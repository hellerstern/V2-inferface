import { createContext } from "react";
import socketio from "socket.io-client";

export const eu1oracleSocket = socketio.connect('https://eu1-oracle-sscsc.ondigitalocean.app', {transports: ['websocket'] });
eu1oracleSocket.on('connect', () => {
    console.log('[eu1-oracleSocket] Connected');
});
  
eu1oracleSocket.on('disconnect', (reason) => {
    console.log('[eu1-oracleSocket] Disconnected:', reason);
});

eu1oracleSocket.on('error', (error) => {
    console.log('[eu1-oracleSocket] Error:', error);
});

eu1oracleSocket.on('data', (data) => {
    oracleData = data;
    lastOracleTime = Date.now();
});

export const eu2oracleSocket = socketio.connect('https://eu2-oracle-v6vvj.ondigitalocean.app', {transports: ['websocket'] });
eu2oracleSocket.on('connect', () => {
    console.log('[eu2-oracleSocket] Connected');
});
  
eu2oracleSocket.on('disconnect', (reason) => {
    console.log('[eu2-oracleSocket] Disconnected:', reason);
});

eu2oracleSocket.on('error', (error) => {
    console.log('[eu2-oracleSocket] Error:', error);
});

eu2oracleSocket.on('data', (data) => {
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