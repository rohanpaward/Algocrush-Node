/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const skills = require('./skills');

const user_skills = sequelize.define(
  'user_skills_mapping',
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

    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'skills',
        key: 'id',
      },
    },
  },
  {
    tableName: 'user_skills_mapping',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['user_id', 'skill_id'], // UNIQUE constraint
      },
    ],
  }
);


user_skills.belongsTo(users, {
  foreignKey: 'user_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

user_skills.belongsTo(skills, {
  foreignKey: 'skill_id',
  targetKey: 'id',
});


user_skills.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    skill_id: Joi.number().integer().required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = user_skills;