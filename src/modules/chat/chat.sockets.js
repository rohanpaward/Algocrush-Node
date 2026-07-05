const { escape } = require("sequelize/lib/sql-string");
const chat_rooms = require("../../schema/chat_rooms");
const hackathon_requests = require("../../schema/hackathon_requests");
const messages = require("../../schema/messages");
const request_messages = require("../../schema/request_message");
const hackathon_group_messages = require("../../schema/hackathon_group_messages");
const hackathon_posts = require("../../schema/hackathon_posts");
const hackathon_team_members = require("../../schema/hackathon_team_members");

module.exports = (socket) => {
    console.log("Chat module attached:", socket.id);
  
    // 🔥 JOIN ROOM (ADD THIS HERE)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });
  
    // SEND MESSAGE
    socket.on("send_message", async (data) => {

      try {
    
        const {
          type,
          roomId,
          requestId,
          senderId,
          text
        } = data;
    
        console.log(data, "this is data");
    
        let saved;
        let payload;
    
        // ====================================
        // REQUEST MESSAGE
        // ====================================
        if (type === "request") {

          // validate request exists
          const room = await hackathon_requests.findOne({
            where: {
              id: roomId
            }
          });
        
          if (!room) {
        
            return socket.emit("chat_error", {
              message: "Request not found"
            });
        
          }
        
          saved = await request_messages.create({
            room_id: roomId,
            sender_id: senderId,
            content: text,
            is_read: false
          });
        
          payload = {
            id: saved.id,
            roomId,
            senderId,
            text,
            time: saved.created_at || saved.createdAt
          };
        
          socket
            .to(`request_${roomId}`)
            .emit("receive_message", payload);
        
        }
    
        // ====================================
        // DIRECT CHAT MESSAGE
        // ====================================
        else if (type === "collab") {
    
          // validate room exists
          const room = await chat_rooms.findOne({
            where: {
              id: roomId
            }
          });
    
          if (!room) {
    
            return socket.emit("chat_error", {
              message: "Chat room not found"
            });
    
          }
    
          saved = await messages.create({
            room_id: roomId,
            sender_id: senderId,
            content: text,
            is_read: false
          });
    
    
          payload = {
            id: saved.id,
            roomId,
            senderId,
            text,
            time: saved.created_at || saved.createdAt
          };
    
          socket
            .to(`room_${roomId}`)
            .emit("receive_message", payload);
    
        }

        // ====================================
// TEAM GROUP MESSAGE
// ====================================
else if (type === "team") {

  // Validate team (hackathon post) exists
  const team = await hackathon_posts.findOne({
      where: {
          id: roomId,
      },
  });

  if (!team) {
      return socket.emit("chat_error", {
          message: "Team not found",
      });
  }

  // Validate sender belongs to this team
  const member = await hackathon_team_members.findOne({
      where: {
          post_id: roomId,
          user_id: senderId,
      },
  });

  if (!member) {
      return socket.emit("chat_error", {
          message: "You are not a member of this team",
      });
  }

  // Save message
  saved = await hackathon_group_messages.create({
      post_id: roomId,
      sender_id: senderId,
      content: text,
      is_read: false,
  });

  payload = {
      id: saved.id,
      roomId,
      senderId,
      text,
      time: saved.created_at || saved.createdAt,
  };

  // Broadcast to everyone in the team room
  socket
      .to(`team_${roomId}`)
      .emit("receive_message", payload);  
}
    
        // ====================================
        // INVALID TYPE
        // ====================================
        else {
    
          return socket.emit("chat_error", {
            message: "Invalid message type"
          });
    
        }
    
        // sender acknowledgement
        socket.emit("message_saved", payload);
    
      }
    
      catch (err) {
    
        console.error(err);
    
        socket.emit("chat_error", {
          message: "Failed to send message"
        });
    
      }
    
    });
  };