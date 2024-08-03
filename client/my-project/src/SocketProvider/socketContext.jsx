import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { useMemo } from "react";


const SocketContext = createContext(null);


const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

const SocketContextProvider = ({ children}) => {
    const socket = useMemo(() => {
      
        return io(`http://localhost:3000/`,{transports:["websocket"]}); 
      }, []);
    


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, useSocket };
