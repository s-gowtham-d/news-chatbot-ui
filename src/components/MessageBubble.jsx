/**
 * MessageBubble Component
 * This component renders individual chat messages.
 * It differentiates between user and bot messages.
 * It supports streaming display for bot messages.
 * Uses ReactMarkdown for rendering markdown content.
 * Styles are imported from ChatBox.module.scss.
 * Author: Gowtham Selvam
//  */

import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/ChatBox.module.scss";

// Custom link component for ReactMarkdown
const LinkRenderer = ({ href, children }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={styles.link}
  >
    {children}
  </a>
);

// Linkify plain text (for streaming)
const linkifyText = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // Clean up trailing punctuation from URLs
      const cleanUrl = part.replace(/[.,;!?)]+$/, '');
      const trailing = part.slice(cleanUrl.length);
      
      return (
        <React.Fragment key={index}>
          <a 
            href={cleanUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            {cleanUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

// Convert plain URLs to markdown links
const autoLinkMarkdown = (text) => {
  if (!text) return '';
  
  // Match URLs and convert them to markdown format
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.replace(urlRegex, (url) => {
    // Clean up trailing punctuation
    const cleanUrl = url.replace(/[.,;!?)]+$/, '');
    const trailing = url.slice(cleanUrl.length);
    
    // Return markdown link format
    return `[${cleanUrl}](${cleanUrl})${trailing}`;
  });
};

export const MessageBubble = ({ msg, isUser, isStreaming }) => {
  const displayContent = isStreaming 
    ? msg.content.replace(/\*\*/g, '').replace(/^\* /gm, '• ') 
    : msg.content;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = typeof timestamp === "number" 
      ? new Date(timestamp) 
      : new Date(timestamp);

    if (isNaN(date)) return "Invalid Date";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.bot}`}>
      <div className={styles.bubble}>
        {isUser ? (
          <p>{msg.content}</p>
        ) : isStreaming ? (
          <p className={styles.streaming}>{linkifyText(displayContent)}</p>
        ) : (
          <ReactMarkdown
            components={{
              a: LinkRenderer,
              p: ({ children }) => <p>{children}</p>,
            }}
          >
            {autoLinkMarkdown(msg.content)}
          </ReactMarkdown>
        )}
      </div>
      <span className={styles.timestamp}>
        {formatTime(msg.ts || msg.timestamp)}
      </span>
    </div>
  );
};