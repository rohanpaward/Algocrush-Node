/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const projects = require('./projects');
const statuses = require('./statuses');

const project_messages = sequelize.define(
  'project_messages',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'statuses',
        key: 'id',
      },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'project_messages',
    timestamps: false,
  }
);

project_messages.belongsTo(users, {
  foreignKey: 'sender_id',
  as: 'sender',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

project_messages.belongsTo(projects, {
  foreignKey: 'project_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

project_messages.belongsTo(statuses, {
  foreignKey: 'status_id',
  targetKey: 'id',
});

project_messages.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    sender_id: Joi.number().integer().required(),
    project_id: Joi.number().integer().required(),
    message: Joi.string().required(),
    status_id: Joi.number().integer().optional(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = project_messages;