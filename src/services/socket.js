/**
 * Socket Service
 * This service manages the WebSocket connection using Socket.IO.
 * It provides functions to get a socket instance, generate session IDs,
 * and clear sessions
 * Author: Gowtham Selvam
 */
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

let socket = null;

export const getSocket = (sessionId) => {
  if (socket && socket.connected) {
    console.log("♻️ Reusing existing socket connection");
    return socket;
  }

  console.log("🔌 Creating new socket connection for session:", sessionId);

  socket = io(API_URL, {
    query: { sessionId },
    transports: ["websocket", "polling"], 
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  return socket;
};

export const generateSessionId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let sid = urlParams.get("s");
  if (!sid) {
    sid = crypto.randomUUID().slice(0, 8);
    window.history.replaceState(null, "", `?s=${sid}`);
  }
  return sid;
};

export const clearSession = (socket) => {
  if (socket) {
    socket.emit("clearSession");
  }
};