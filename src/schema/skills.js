/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const domains = require('./domains');

const skills = sequelize.define(
  'skill_master',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'skill_master',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['name', 'domain_id'], // UNIQUE (name, domain_id)
      },
    ],
  }
);


skills.belongsTo(domains, {
  foreignKey: 'domain_id',
  targetKey: 'id',
});


skills.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    name: Joi.string().required(),
    domain_id: Joi.number().integer().required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = skills;