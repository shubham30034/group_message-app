import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../../SocketProvider/socketContext";
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = () => {
  const location = useLocation();
  const { name } = location.state || {}; // Retrieve the name from navigation state
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState("");
  const [userCount, setUserCount] = useState(0); // New state for user count

  const send = () => {
    socket.emit("message", { message, id });
    setMessage("");
  };

  const handleWelcome = (data) => {
    console.log(`${data.message}`);
    console.log(socket.id, "id ha kya");
    setId(socket.id);
  };

  const handleUserJoined = ({ user, message }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "join", user, message },
    ]);
  };

  const handleUserLeave = ({ message }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "leave", message },
    ]);
  };

  const handleUserMessage = ({ message, user }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "message", user, message },
    ]);
  };

  const handleUserCount = (count) => {
    setUserCount(count);
  };

  useEffect(() => {
    socket.emit("joined", { user: name });

    socket.on("welcome", handleWelcome);
    socket.on("userJoined", handleUserJoined);
    socket.on("leave", handleUserLeave);
    socket.on("sendMessage", handleUserMessage);
    socket.on("userCount", handleUserCount);

    return () => {
      socket.off("welcome", handleWelcome);
      socket.off("userJoined", handleUserJoined);
      socket.off("leave", handleUserLeave);
      socket.off("sendMessage", handleUserMessage);
      socket.off("userCount", handleUserCount);
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-orange-600 text-white shadow-md">
        <h2 className="text-2xl font-semibold">Room: {name}</h2>
        <div className="flex items-center space-x-4">
          {/* Display the user count */}
          <span className="text-sm">{userCount} Online</span>
          <button className="bg-orange-500 px-3 py-1 rounded-full hover:bg-orange-400 transition-colors">
            Leave Room
          </button>
        </div>
      </div>

      {/* Chat Box */}
      <ScrollToBottom className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="space-y-4">
          {/* Map over messages and display each message */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                msg.type === "join" || msg.type === "leave"
                  ? "justify-center"
                  : ""
              }`}
            >
              {msg.type === "message" && (
                <div
                  className={`flex-shrink-0 ${
                    msg.user === name ? "bg-orange-500" : "bg-blue-500"
                  } text-white w-8 h-8 flex items-center justify-center rounded-full`}
                >
                  {msg.user.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`${
                  msg.type === "message"
                    ? msg.user === name
                      ? "bg-orange-100"
                      : "bg-blue-100"
                    : "bg-gray-200"
                } p-3 rounded-lg max-w-xs`}
              >
                {msg.type === "message" ? (
                  <>
                    <span
                      className={`font-semibold ${
                        msg.user === name ? "text-orange-500" : "text-blue-500"
                      }`}
                    >
                      {msg.user}:
                    </span>
                    <p>{msg.message}</p>
                  </>
                ) : (
                  <p>{msg.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollToBottom>

      {/* Chat Input */}
      <div className="flex items-center p-4 bg-gray-100 shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => send()}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
