import React, { useState } from "react";
import { ChatBoxWithSocket } from "./components/ChatBoxWithSocket";
import { ChatBox } from "./components/ChatBox";

export default function App() {
  const [isApi, setIsApi] = useState(true); 

  return isApi ? (
    <ChatBox isApi={isApi} setIsApi={setIsApi} />
  ) : (
    <ChatBoxWithSocket isApi={isApi} setIsApi={setIsApi} />
  );
}