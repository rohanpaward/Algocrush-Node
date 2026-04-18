/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const projects = require('./projects');

const project_swipes = sequelize.define(
  'project_swipes',
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

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    is_like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'project_swipes',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['user_id', 'project_id'], // UNIQUE constraint
      },
    ],
  }
);

project_swipes.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

project_swipes.belongsTo(projects, {
  foreignKey: 'project_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});


project_swipes.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    project_id: Joi.number().integer().required(),
    is_like: Joi.boolean().required(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = project_swipes;