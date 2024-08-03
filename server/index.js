const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const cors = require("cors");

const server = createServer(app);
const io = new Server(server, { /* options */ });

const users = {}; // Use an object to store users by their socket IDs

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user; // Add user to the users object

    console.log(`${user} has joined`);
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the Chat ${user}`,
    });
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });

    // Emit the updated user count to all clients
    io.emit("userCount", Object.keys(users).length);
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      // Broadcast the leave message if the user was registered
      socket.broadcast.emit("leave", {
        message: `${users[socket.id]} has left`,
      });

      // Remove the user from the users object
      delete users[socket.id];

      // Emit the updated user count to all clients
      io.emit("userCount", Object.keys(users).length);
    }
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.send({
    message: "successful",
  });
});

server.listen(3000, () => {
  console.log(`Server started successfully at port 3000`);
});
