/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');
const status_types = require('./status_types');

const swipes = sequelize.define(
    'swipes', 
    {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  swiper_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // unique: true,
  },
  swiped_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // unique: true,
  },
  direction:{
    type:DataTypes.STRING(30)
  },
  created_at:{
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }


}, {
  tableName: "swipes",
  timestamps: false,
});




// Joi validation
swipes.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    swiper_id: Joi.number().integer(),
    swiped_id:Joi.number().integer(),
    direction:Joi.string(),
    created_at: Joi.date().optional(),


  };

  return Joi.validate(obj, schema);
};

module.exports = swipes;
