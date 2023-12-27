"use client";

import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";

const page = () => {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div className="chat-body">
      <div style={{ padding: "10px 0px" }}>All Messages</div>
      <hr />
      <div style={{ padding: "10px 0px" }} className="chat-container">
        <div>
          {messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </div>
        <div className="input-container">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send message"
          />
          <button type="button" onClick={() => sendMessage(message)}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
