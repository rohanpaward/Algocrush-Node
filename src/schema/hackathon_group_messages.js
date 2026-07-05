/* eslint-disable comma-dangle */
/* eslint-disable camelcase */

const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const hackathon_posts = require('./hackathon_posts');

const hackathon_group_messages = sequelize.define(
  'hackathon_group_messages',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'hackathon_posts',
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
    tableName: 'hackathon_group_messages',
    timestamps: false,

    indexes: [
      {
        fields: ['post_id'],
      },
      {
        fields: ['sender_id'],
      },
      {
        fields: ['post_id', 'created_at'],
      },
    ],
  }
);

// Message belongs to Hackathon Post (Group)
hackathon_group_messages.belongsTo(hackathon_posts, {
  foreignKey: 'post_id',
  targetKey: 'id',
  as: 'post',
  onDelete: 'CASCADE',
});

// Message Sender
hackathon_group_messages.belongsTo(users, {
  foreignKey: 'sender_id',
  targetKey: 'id',
  as: 'sender',
  onDelete: 'CASCADE',
});

// Joi Validation
hackathon_group_messages.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    post_id: Joi.number().integer().required(),
    sender_id: Joi.number().integer().required(),
    content: Joi.string().required(),
    is_read: Joi.boolean().optional(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = hackathon_group_messages;