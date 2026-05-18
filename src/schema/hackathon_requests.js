/* eslint-disable camelcase */
const { DataTypes } = require('sequelize');
const Joi = require('joi');

const { sequelize } = require('../../db');

const hackathon_posts = require('./hackathon_posts');
const hackathon_roles = require('./hackathon_roles');
const users = require('./users');

const hackathon_requests = sequelize.define(
  'hackathon_requests',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'hackathon_posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'hackathon_roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    applicant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    intro_message: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'accepted', 'rejected']],
      },
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'hackathon_requests',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['post_id', 'role_id', 'applicant_id'],
      },
      {
        fields: ['post_id'],
      },
      {
        fields: ['applicant_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

/* Associations */

hackathon_requests.belongsTo(hackathon_posts, {
  foreignKey: 'post_id',
  as: 'post',
  onDelete: 'CASCADE',
});

hackathon_requests.belongsTo(hackathon_roles, {
  foreignKey: 'role_id',
  as: 'role',
  onDelete: 'CASCADE',
});

hackathon_requests.belongsTo(users, {
  foreignKey: 'applicant_id',
  as: 'applicant',
  onDelete: 'CASCADE',
});

/* Joi Validation */

hackathon_requests.joiValidate = (obj) => {
  const schema = Joi.object({
    id: Joi.number().integer(),

    post_id: Joi.number().integer().required(),

    role_id: Joi.number().integer().required(),

    applicant_id: Joi.number().integer().required(),

    intro_message: Joi.string().allow('', null),

    status: Joi.string()
      .valid('pending', 'accepted', 'rejected')
      .optional(),

    created_at: Joi.date().optional(),

    updated_at: Joi.date().optional(),
  });

  return schema.validate(obj);
};

module.exports = hackathon_requests;