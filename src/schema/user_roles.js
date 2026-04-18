/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const roles = require('./roles');

const user_roles = sequelize.define(
  'user_roles',
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

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'user_roles',
    timestamps: false,

    // Recommended (prevents duplicate assignments)
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id'],
      },
    ],
  }
);

user_roles.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

user_roles.belongsTo(roles, {
  foreignKey: 'role_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

user_roles.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    role_id: Joi.number().integer().required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = user_roles;