/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');
const status_types = require('./status_types');

const statuses = sequelize.define(
    'status', 
    {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

}, {
  tableName: "status",
  timestamps: false,
});


// Joi validation
statuses.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    name: Joi.string().max(50).required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = statuses;
