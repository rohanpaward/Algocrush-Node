/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const hackathon_request = require('./hackathon_requests');

const request_messages = sequelize.define(
  'request_messages',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    room_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'hackathon_requests',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    sender_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'request_messages',
    timestamps: false,

    indexes: [
      {
        fields: ['room_id'],
      },
      {
        fields: ['sender_id'],
      },
      {
        fields: ['room_id', 'created_at'], // composite index
      },
    ],
  }
);

// Message belongs to chat room
request_messages.belongsTo(hackathon_request, {
    foreignKey: 'room_id',
    as: 'room',
    onDelete: 'CASCADE',
  });
  
  // Message sender
  request_messages.belongsTo(users, {
    foreignKey: 'sender_id',
    as: 'sender',
    onDelete: 'CASCADE',
  });


  request_messages.joiValidate = (obj) => {
    const schema = {
      id: Joi.number().integer(),
      room_id: Joi.number().integer().required(),
      sender_id: Joi.number().integer().required(),
      content: Joi.string().required(),
      is_read: Joi.boolean().optional(),
      created_at: Joi.date().optional(),
    };
  
    return Joi.validate(obj, schema);
  };

  module.exports = request_messages;