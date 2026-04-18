/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');

const user_daily_limits = sequelize.define(
  'user_daily_limits',
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

    date: {
      type: DataTypes.DATEONLY, // IMPORTANT for "date"
      allowNull: false,
    },

    swipe_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    dm_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'user_daily_limits',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['user_id', 'date'], // UNIQUE (user_id, date)
      },
    ],
  }
);

user_daily_limits.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

user_daily_limits.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    date: Joi.date().required(),
    swipe_count: Joi.number().integer().min(0).optional(),
    dm_count: Joi.number().integer().min(0).optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = user_daily_limits;