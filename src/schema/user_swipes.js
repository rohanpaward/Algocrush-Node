/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');

const user_swipes = sequelize.define(
  'user_swipes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    swiper_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    swiped_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    tableName: 'user_swipes',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['swiper_id', 'swiped_id'], // UNIQUE constraint
      },
    ],
  }
);


user_swipes.belongsTo(users, {
  foreignKey: 'swiper_id',
  as: 'swiper',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

user_swipes.belongsTo(users, {
  foreignKey: 'swiped_id',
  as: 'swiped',
  targetKey: 'id',
  onDelete: 'CASCADE',
});


user_swipes.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    swiper_id: Joi.number().integer().required(),
    swiped_id: Joi.number().integer().required(),
    is_like: Joi.boolean().required(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = user_swipes;