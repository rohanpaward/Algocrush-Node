/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const domains = require('./domains');
const statuses = require('./statuses');

const projects = sequelize.define(
  'projects',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    domain_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'domains',
        key: 'id',
      },
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
    tableName: 'projects',
    timestamps: false,
  }
);

projects.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

projects.belongsTo(domains, {
  foreignKey: 'domain_id',
  targetKey: 'id',
});

projects.belongsTo(statuses, {
  foreignKey: 'status_id',
  targetKey: 'id',
});

projects.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    domain_id: Joi.number().integer().required(),
    status_id: Joi.number().integer().optional(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = projects;