/**
 * ChatBox Component
 * This component provides a chat interface using REST API calls.
 * It manages chat history, user input, and displays messages.
 * It simulates typing for bot responses.
 * Uses apiService for backend communication.
 * Styles are imported from ChatBox.module.scss.
 * Author: Gowtham Selvam
 */
import React, { useState, useEffect, useRef } from "react";
import { generateSessionId, fetchHistory, fetchChatResponse } from "../services/apiService"; 
import { MessageBubble } from "./MessageBubble";
import { SessionHeader } from "./SessionHeader";
import styles from "../styles/ChatBox.module.scss";

export const ChatBox = ({isApi, setIsApi}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sessionId = generateSessionId();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchHistory(sessionId);
        setMessages(history.map(item => [
          { content: item.user, timestamp: item.timestamp, isUser: true },
          { content: item.bot, timestamp: item.timestamp, isUser: false }
        ]).flat());
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    loadHistory();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { content: input, timestamp: Date.now(), isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { response } = await fetchChatResponse(sessionId, input);
      
      const botMsg = { content: "", timestamp: Date.now(), isUser: false };
      setMessages(prev => [...prev, botMsg]);
      
      let typed = "";
      for (let i = 0; i < response.length; i++) {
        typed += response[i];
        await new Promise(resolve => setTimeout(resolve, 5));  
        // eslint-disable-next-line
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: typed }];
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { content: "Sorry, an error occurred.", timestamp: Date.now(), isUser: false }]);
    } finally {
      setIsLoading(false);
    }
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
                    onClick={() => handleSuggestionClick("List me some latest news headlines")}
                    // disabled={!isConnected}
                  >
                    List me some latest news headlines
                  </button>
                  <button 
                    className={styles.chip}
                    onClick={() => handleSuggestionClick("Give me a summary of today's top stories")}
                    // disabled={!isConnected}
                  >
                    Give me a summary of today's top stories
                  </button>
                  <button 
                    className={styles.chip}
                    onClick={() => handleSuggestionClick("List me some latest news headlines with links")}
                    // disabled={!isConnected}
                  >
                    List me some latest news headlines with links
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
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Ask about the news..."
          rows={1}
          className={styles.textarea}
          disabled={isLoading}
        />
        <button onClick={sendMessage} className={styles.sendBtn} disabled={!input.trim() || isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};
