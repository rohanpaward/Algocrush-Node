/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const projects = require('./projects');
const roles = require('./roles');

const project_roles = sequelize.define(
  'project_roles',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
  {
    tableName: 'project_roles',
    timestamps: false,

    // Recommended (prevents duplicate roles per project)
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'role_id'],
      },
    ],
  }
);

project_roles.belongsTo(projects, {
  foreignKey: 'project_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

project_roles.belongsTo(roles, {
  foreignKey: 'role_id',
  targetKey: 'id',
});

project_roles.joiValidate = (obj) => {
  const schema = {
    id: Joi.number().integer(),
    project_id: Joi.number().integer().required(),
    role_id: Joi.number().integer().required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = project_roles;