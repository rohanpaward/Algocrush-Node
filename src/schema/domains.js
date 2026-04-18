/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const domains = sequelize.define(
  'domain_master',
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
  },
  {
    tableName: "domain_master",
    timestamps: false,
  }

);

// Joi validation
domains.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    name: Joi.string().max(50).required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = domains;
