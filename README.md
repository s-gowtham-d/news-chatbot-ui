# Frontend README – RAG-Powered News Chatbot

**Tech Stack:** `React`, `Create React App`, `SCSS`, `Socket.IO`, `REST API`

---

## Overview

This frontend implements a **responsive news chatbot** that:

- **Connects to a RAG backend** (Redis, Qdrant, Gemini)
- **Supports both REST API (typed-out)** and **WebSocket (streaming)**
- **Persists chat history per session** (`?s=abc123`)
- **Toggles between API and Socket** with a **beautiful switch**
- **Shows headlines → asks for details** UX flow
- **100% compliant** with Voosh assignment (UX 5%, Hosting 10%)

---

## Tech Stack (Justified)

| Component     | Choice                   | Justification                         |
| ------------- | ------------------------ | ------------------------------------- |
| **Framework** | React + Create React App | Industry standard, easy setup, stable |
| **Styling**   | SCSS Modules             | Scoped styles, nesting, variables     |
| **Realtime**  | Socket.IO Client         | Full-duplex, fallback to polling      |
| **State**     | React Hooks              | Simple, functional components         |
| **Icons**     | SVG Inline               | No external deps, full control        |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatBox.jsx             # REST API version
│   │   ├── ChatBoxWithSocket.jsx   # WebSocket version
│   │   ├── MessageBubble.jsx
│   │   └── SessionHeader.jsx
│   ├── services/
│   │   ├── apiService.js           # REST calls
│   │   └── socketService.js        # Socket.IO connection
│   ├── styles/
│   │   └── ChatBox.module.scss
│   ├── App.jsx
│   └── index.js
├── public/
├── .env
└── package.json
```

---

## Features

| Feature            | Implementation                    |
| ------------------ | --------------------------------- |
| **REST API Mode**  | Typed-out response (char-by-char) |
| **WebSocket Mode** | Real-time token streaming         |
| **Toggle Switch**  | Animated switch in input bar      |
| **Session ID**     | `?s=abc123` in URL                |
| **New Session**    | Open in new tab → new `?s=`       |
| **Clear Session**  | Button in header                  |
| **Auto-scroll**    | Smooth scroll to bottom           |
| **Loading State**  | Typing dots                       |
| **Responsive**     | Mobile + desktop                  |

---

## Setup & Installation

```bash
# Clone repo
git clone https://github.com/s-gowtham-d/news-chatbot-ui.git
cd news-chatbot-ui

# Install
npm install

# Create .env
cp .env.example .env
```

### `.env` (Frontend)

```env
REACT_APP_API_URL=http://localhost:8080
```

## Run Locally

```bash
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

---

## Switch Between API and WebSocket

### Default: **REST API (Typed-out)**

- Starts in **API mode**
- Response is typed out character-by-character

### Toggle to **WebSocket (Streaming)**

1. Look at the **input bar**
2. See the **toggle switch**:
   ```
   [ Send ]                Typed  ○─Streaming
   ```
3. **Click the switch** → instantly switches to **real-time streaming**
4. **Click again** → back to typed-out

> **Session persists** across modes  
> **History loads** on refresh  
> **No page reload**

---

## Session Management

| Action        | Result                  |
| ------------- | ----------------------- |
| Open app      | `?s=abc123` added       |
| New tab       | New `?s=xyz789`         |
| Refresh       | History loads           |
| Click "Clear" | History gone, new `?s=` |

---

## Build & Deploy

```bash
# Build
npm run build

# Serve (optional)
npx serve -s build
```

---

## Resources

- **Backend Repo**: `https://github.com/s-gowtham-d/news-chatbot-using-rag-pipeline`
- **Live Demo**: `https://news-chatbot-ui.vercel.app/`
- **BBC RSS**: `http://feeds.bbci.co.uk/news/rss.xml`
