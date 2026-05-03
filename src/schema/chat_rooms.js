/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const matches = require('./matches');

const chat_rooms = sequelize.define(
  'chat_rooms',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    match_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true, // UNIQUE (match_id)
      references: {
        model: 'matches',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    user_1_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    user_2_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    last_message: {
      type: DataTypes.TEXT,
    },

    last_message_at: {
      type: DataTypes.DATE, // ❗ FIXED (was TIME, should be TIMESTAMP)
    },

    last_message_by: {
      type: DataTypes.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'chat_rooms',
    timestamps: false,

    indexes: [
      {
        fields: ['user_1_id'],
      },
      {
        fields: ['user_2_id'],
      },
      {
        fields: ['last_message_at'],
      },
    ],
  }
);

// Chat room belongs to match
chat_rooms.belongsTo(matches, {
    foreignKey: 'match_id',
    as: 'match',
    onDelete: 'CASCADE',
  });
  
  // Users
  chat_rooms.belongsTo(users, {
    foreignKey: 'user_1_id',
    as: 'user1',
  });
  
  chat_rooms.belongsTo(users, {
    foreignKey: 'user_2_id',
    as: 'user2',
  });
  
  // Last message sender
  chat_rooms.belongsTo(users, {
    foreignKey: 'last_message_by',
    as: 'lastMessageSender',
  });

  


  chat_rooms.joiValidate = (obj) => {
    const schema = {
      id: Joi.number().integer(),
      match_id: Joi.number().integer().required(),
      user_1_id: Joi.number().integer().required(),
      user_2_id: Joi.number().integer().required(),
      last_message: Joi.string().allow(null, ''),
      last_message_at: Joi.date().optional(),
      last_message_by: Joi.number().integer().optional(),
      created_at: Joi.date().optional(),
    };
  
    return Joi.validate(obj, schema);
  };


  module.exports = chat_rooms;