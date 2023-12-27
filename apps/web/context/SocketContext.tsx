"use client";

import React, { useCallback, useEffect, useContext, useState } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextProps {
  children?: React.ReactNode;
}

interface ISocketContextProps {
  sendMessage: (msg: string) => any;
  messages: string[];
}

const SocketContext = React.createContext<ISocketContextProps | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("State is undefined");
  return state;
};
export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages ,setMessages]=useState<string[]>([])

  useEffect(() => {
    const _socket = io("http://localhost:8200");
    _socket.on("message", onMessageReceived);
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageReceived);
      setSocket(undefined);
    };
  }, []);

  const sendMessage: ISocketContextProps["sendMessage"] = useCallback(
    (msg) => {
      console.log("send message", msg);
      if (socket) socket?.emit("event:message", { message: msg });
    },
    [socket]
  );

  const onMessageReceived = useCallback((msg: string) => {
    console.log("From Server Msg Received", msg);
    const {message}=JSON.parse(msg) as {message: string}
    setMessages(prev=>[...prev, message])
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage,messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
