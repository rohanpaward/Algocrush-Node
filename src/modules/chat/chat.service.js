// Sequelize
const { Op, Sequelize, col, literal, fn, where } = require('sequelize');
const { sequelize } = require('../../../db');

// Utilities
const { formatResponse } = require('../../utility/response-toolkit');

// Logger
const { logger } = require('../../utility/logger');

// Joi
// const chat_rooms = require('../../schema/chat_rooms');
// const users = require('../../schema/users');
// const messages = require('../../schema/messages');

const fetchAllChatsService = async (userId, schemaName) => {
    try {
      const query = `
        SELECT 
          cr.id AS room_id,
          cr.last_message,
          cr.last_message_at,
          cr.last_message_by,
  
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

module.exports = {
    fetchAllChatsService
}