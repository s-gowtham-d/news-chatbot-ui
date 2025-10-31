
/**
 * ChatBoxWithSocket Component
 * This component provides a chat interface using WebSocket for real-time communication.
 * It manages chat history, user input, and displays messages.
 * It listens for incoming messages and updates the chat in real-time.
 * Uses apiService and socket service for backend communication.
 * Styles are imported from ChatBox.module.scss.
 * Author: Gowtham Selvam
 */
import  { useState, useEffect, useRef } from "react";
import {
  generateSessionId,
  fetchHistory,
} from "../services/apiService";
import { getSocket } from "../services/socket";
import { MessageBubble } from "./MessageBubble";
import { SessionHeader } from "./SessionHeader";
import styles from "../styles/ChatBox.module.scss";

export const ChatBoxWithSocket = ({isApi, setIsApi}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const sessionId = generateSessionId();

useEffect(() => {
  const load = async () => {
    try {
      const hist = await fetchHistory(sessionId);
      setMessages(
        hist.flatMap(h => [
          { content: h.user, ts: h.timestamp, isUser: true },
          { content: h.bot,  ts: h.timestamp, isUser: false },
        ])
      );
    } catch (e) { console.error(e); }
  };
  load();

  const socket = getSocket(sessionId);
  socketRef.current = socket;

  socket.on("connect", () => console.log("socket connected"));

  socket.on("history", hist =>
    setMessages(
      hist.flatMap(h => [
        { content: h.user, ts: h.timestamp, isUser: true },
        { content: h.bot,  ts: h.timestamp, isUser: false },
      ])
    )
  );

  socket.on("token", token => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && !last.isUser) {
        return [...prev.slice(0, -1), { ...last, content: last.content + token }];
      }
      return [...prev, { content: token, ts: Date.now(), isUser: false }];
    });
  });

  socket.on("responseEnd", () => {
    setIsLoading(false);   
  });

  return () => socket.disconnect();
}, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { content: input, ts: Date.now(), isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    socketRef.current.emit("userMessage", { content: input });

  };

   const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };


  return (
    <div className={styles.chatContainer}>
      <SessionHeader sessionId={sessionId} />

       {messages.length === 0 && (
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeCard}>
              <div className={styles.botAvatar}>📰</div>
              <h2 className={styles.welcomeTitle}>Welcome to News Assistant!</h2>
              <p className={styles.welcomeText}>
                I'm your AI-powered news assistant. I can help you discover and understand the latest news stories from various sources.
              </p>
              
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔍</span>
                  <span className={styles.featureText}>Search news by topic</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📝</span>
                  <span className={styles.featureText}>Get detailed summaries</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔗</span>
                  <span className={styles.featureText}>Access article links</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>💬</span>
                  <span className={styles.featureText}>Ask follow-up questions</span>
                </div>
              </div>

              <div className={styles.suggestions}>
                <p className={styles.suggestionsTitle}>Try asking:</p>
                <div className={styles.suggestionChips}>
                  <button 
                    className={styles.chip}
                    onClick={() => handleSuggestionClick("What's the latest sports news?")}
                    // disabled={!isConnected}
                  >
                    What's the latest sports news?
                  </button>
                  <button 
                    className={styles.chip}
                    onClick={() => handleSuggestionClick("Tell me about technology news")}
                    // disabled={!isConnected}
                  >
                    Tell me about technology news
                  </button>
                  <button 
                    className={styles.chip}
                    onClick={() => handleSuggestionClick("Show me business news with links")}
                    // disabled={!isConnected}
                  >
                    Show me business news with links
                  </button>
                  <button 
                    className={styles.chip}
                    onClick={() => handleSuggestionClick("What's happening in the world?")}
                    // disabled={!isConnected}
                  >
                    What's happening in the world?
                  </button>
                </div>
              </div>
            </div>
          </div>
        
      )}

      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} isUser={msg.isUser} />
        ))}

        {isLoading && (
          <div className={styles.typing}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        
        <div className={styles.toggleContainer}>
        <span className={styles.toggleLabel}>Typed</span>

        <label className={styles.toggleSwitch}>
            <input
            type="checkbox"
            checked={!isApi}
            onChange={() => setIsApi(prev => !prev)}
            disabled={isLoading}
            />
            <span className={styles.slider}></span>
        </label>

        <span className={styles.toggleLabel}>Streaming</span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
          }
          placeholder="Ask about the news..."
          rows={1}
          className={styles.textarea}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className={styles.sendBtn}
          disabled={!input.trim() || isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};