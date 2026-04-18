/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');

const matches = sequelize.define(
  'matches',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    user2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'matches',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['user1_id', 'user2_id'], // UNIQUE constraint
      },
    ],
  }
);

matches.belongsTo(users, {
  foreignKey: 'user1_id',
  as: 'user1',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

matches.belongsTo(users, {
  foreignKey: 'user2_id',
  as: 'user2',
  targetKey: 'id',
  onDelete: 'CASCADE',
});


matches.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user1_id: Joi.number().integer().required(),
    user2_id: Joi.number().integer().required(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = matches;