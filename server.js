const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const app = express();
const socket = require("socket.io");
const DBConnection = require("./db");
const userrouter = require("./routes/auth");
const messagerouter = require("./routes/message");
require("dotenv").config();
app.use(cors());
app.use(express.json());
DBConnection;
app.use("/api/auth", userrouter);
app.use("/api/messages/", messagerouter);
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
const io = socket(server, {
  cors: {
    origin: `${process.env.CLIENT}`,
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("Its connection");
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log("connection for add user");
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log("sending data");
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
