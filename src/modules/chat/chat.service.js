// Sequelize
const { Op, Sequelize, col, literal, fn, where } = require('sequelize');
const { sequelize } = require('../../../db');

// Utilities
const { formatResponse } = require('../../utility/response-toolkit');

// Logger
const { logger } = require('../../utility/logger');
const { getIO } = require('../../sockets');
const messages = require('../../schema/messages');
const users = require('../../schema/users');


const fetchAllChatsService = async (userId, schemaName) => {
    try {
      const query = `
        SELECT 
          cr.id AS room_id,
          cr.last_message,
          cr.last_message_at,
          cr.last_message_by,
          cr.created_at,
  
          CASE 
            WHEN cr.user_1_id = :userId THEN cr.user_2_id
            ELSE cr.user_1_id
          END AS other_user_id,
  
          u.username AS other_username,
          u.profile_photo_url AS other_photo,
          u.role_name AS other_role,
  
          COUNT(m.id) FILTER (
            WHERE m.is_read = false 
            AND m.sender_id != :userId
          ) AS unread_count
  
        FROM ${schemaName}.chat_rooms cr
  
        JOIN ${schemaName}.users u 
          ON u.id = CASE 
            WHEN cr.user_1_id = :userId THEN cr.user_2_id
            ELSE cr.user_1_id
          END
  
        LEFT JOIN ${schemaName}.messages m 
          ON m.room_id = cr.id
  
        WHERE cr.user_1_id = :userId OR cr.user_2_id = :userId
  
        GROUP BY cr.id, u.id
  
        ORDER BY cr.last_message_at DESC NULLS LAST
      `;
  
      const chats = await sequelize.query(query, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      });
  
      return formatResponse(
        {
          message: 'Chats fetched successfully',
          data: chats,
        },
        200
      );
    } catch (error) {
      console.log(error, 'fetchAllChatsService error');
      throw error;
    }
  };

  const getMessagesByConversationIdService = async (payload, schemaName) => {
    const t = await sequelize.transaction();
  
    try {
      const { roomId, offset = 0 } = payload;
  
      const Messages = await messages.schema(schemaName).findAll({
        where: {
          room_id: roomId,
        },
        include: [
          {
            model: users.schema(schemaName),
            as: "sender",
            attributes: ["username", "profile_photo_url"],
          },
        ],
        attributes: [
          "id",
          "sender_id",
          "content",
          "is_read",
          "created_at",
        ],
        order: [["created_at", "ASC"]],
        limit: 50,
        offset,
        transaction: t,
      });
  
      await t.commit();
  
      return formatResponse(Messages, 200);
  
    } catch (e) {
      console.log(e,'this is error')
      await t.rollback();
      throw e;
    }
  };
module.exports = {
    fetchAllChatsService,
    getMessagesByConversationIdService
}