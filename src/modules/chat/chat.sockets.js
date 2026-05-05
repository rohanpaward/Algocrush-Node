const chat_rooms = require("../../schema/chat_rooms");
const messages = require("../../schema/messages");

module.exports = (socket) => {
    console.log("Chat module attached:", socket.id);
  
    // 🔥 JOIN ROOM (ADD THIS HERE)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });
  
    // 🔥 SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        const { roomId, senderId, text } = data;

        console.log(data,'this is data')
  
        const saved = await messages.create({
          room_id: roomId,
          sender_id: senderId,
          content: text,
          is_read: false
        });
  
        await chat_rooms.update(
          {
            last_message: text,
            last_message_at: new Date(),
            last_message_by: senderId
          },
          { where: { id: roomId } }
        );
  
        const payload = {
          id: saved.id,
          roomId,
          senderId,
          text,
          time: saved.created_at
        };
  
        socket.to(roomId).emit("receive_message", payload);
        socket.emit("message_saved", payload);
  
      } catch (err) {
        console.error(err);
      }
    });
  };