/* eslint-disable comma-dangle */
/* eslint-disable camelcase */

const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const build_types = sequelize.define(
  'build_types',
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

    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'build_types',
    timestamps: false,
  }
);


// ✅ JOI VALIDATION (same pattern as users)
build_types.joiValidate = (obj) => {
  const schema = Joi.object({
    id: Joi.number().integer(),

    name: Joi.string()
      .lowercase()
      .trim()
      .pattern(/^[a-z0-9_]+$/) // only clean keys like web, ai, backend
      .required(),

    label: Joi.string().trim().required(),

    category: Joi.string()
      .valid('software', 'hardware', 'emerging', 'general')
      .optional(),

    is_active: Joi.boolean().optional(),

    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional(),
  });

  return schema.validate(obj);
};

module.exports = build_types;