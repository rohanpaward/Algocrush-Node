module.exports = (socket) => {
    console.log("Chat module attached to:", socket.id);
  
    socket.on("ping", (msg) => {
      console.log("Ping from client:", msg);
  
      socket.emit("pong", "Backend working");
    });
  };