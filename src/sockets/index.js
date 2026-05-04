let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// 🔥 MAIN connection handler (only once)
const initSocketHandlers = () => {
  const io = getIO();

  console.log("🔥 Socket handlers initialized");

  io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    // 👉 delegate to modules
    // require("../modules/chat/chat.socket")(socket);
     require('../modules/chat/chat.sockets')(socket)
    // later:
    // require("../modules/notification/notification.socket")(socket);
  });
};

module.exports = { initSocket, getIO, initSocketHandlers };