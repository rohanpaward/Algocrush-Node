/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users'); // parent table

const auth_providers = sequelize.define(
  'auth_providers',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    provider_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email:{
      type: DataTypes.STRING,
      allowNull: false,
    },

    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // you didn’t specify constraint, keeping flexible
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'auth_providers',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['provider', 'provider_user_id'], // UNIQUE constraint
      },
    ],
  }
);


auth_providers.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});


auth_providers.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    provider: Joi.string().required(),
    provider_user_id: Joi.string().required(),
    status_id: Joi.number().integer().optional(),
    created_at: Joi.date().optional(),
  };

  return Joi.validate(obj, schema);
};

module.exports = auth_providers;