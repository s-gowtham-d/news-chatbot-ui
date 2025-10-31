/**
 * SessionHeader Component
 * This component displays the session header with session ID and clear session button.
 * It uses the clearSession function from apiService to clear the chat history.
 * Styles are imported from ChatBox.module.scss.
 * Author: Gowtham Selvam
 */
import { clearSession } from "../services/apiService";
import styles from "../styles/ChatBox.module.scss";

export const SessionHeader = ({ sessionId }) => (
  <div className={styles.header}>
    <h2>NEWS CHATBOT USING RAG</h2>
    <div className={styles.actions}>
      <span className={styles.sessionId}>Session: {sessionId}</span>
      <button onClick={() => clearSession(sessionId)} className={styles.newChatBtn}>
        Clear Session
      </button>
    </div>
  </div>
);