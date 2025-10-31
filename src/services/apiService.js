/**
 * apiService Module
 * This module provides functions to interact with the backend API for chat operations.
 * It includes functions to generate session IDs, fetch chat responses, retrieve chat history,
 * and clear chat sessions.
 * Author: Gowtham Selvam
 */
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const generateSessionId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let sid = urlParams.get("s");
  if (!sid) {
    sid = uuidv4().slice(0, 8);
    window.history.replaceState(null, "", `?s=${sid}`);
  }
  return sid;
};

export const fetchChatResponse = async (sessionId, query) => {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, query }),
  });
  if (!res.ok) throw new Error("Chat API failed");
  return res.json();
};

export const fetchHistory = async (sessionId) => {
  const res = await fetch(`${API_URL}/api/history/${sessionId}`);
  if (!res.ok) throw new Error("History API failed");
  return res.json();
};

export const clearSession = async (sessionId) => {
  const res = await fetch(`${API_URL}/api/history/${sessionId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Clear API failed");
  window.location.reload();
};