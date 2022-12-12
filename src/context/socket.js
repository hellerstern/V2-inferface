import React from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect('https://frontend-prices-795bp.ondigitalocean.app/', {transports: ['websocket'] });

export const SocketContext = React.createContext();