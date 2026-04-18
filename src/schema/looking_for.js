/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const lookingFor = sequelize.define(
  'looking_for',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [[
          'COFOUNDER',
          'SIDE_PROJECT',
          'FREELANCE_WORK',
          'FULL_TIME_ROLE',
          'INTERNSHIP',
          'LEARNING',
          'OPEN_SOURCE',
          'HACKATHONS',
          'NETWORKING',
        ]],
      },
    },
  },
  {
    tableName: 'looking_for',
    timestamps: false,
  }
);
lookingFor.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    name: Joi.string()
  };

  return Joi.validate(obj, schema);
};

module.exports = lookingFor;