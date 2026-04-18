/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const domains = require('./domains');

const user_domains = sequelize.define(
  'user_domain_mapping',
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

    domain_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'domains',
        key: 'id',
      },
    },
  },
  {
    tableName: 'user_domain_mapping',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['user_id', 'domain_id'], // UNIQUE constraint
      },
    ],
  }
);

user_domains.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

user_domains.belongsTo(domains, {
  foreignKey: 'domain_id',
  targetKey: 'id',
});

user_domains.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    domain_id: Joi.number().integer().required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = user_domains;