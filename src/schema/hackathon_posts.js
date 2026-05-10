/* eslint-disable camelcase */
const { DataTypes } = require('sequelize');
const Joi = require('joi');

const { sequelize } = require('../../db');
const users = require('./users');

const hackathon_posts = sequelize.define(
  'hackathon_posts',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    creator_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    /* -------- Mode 1 -------- */
    project_name: {
      type: DataTypes.STRING(255),
    },

    hook_line: {
      type: DataTypes.STRING(120),
    },

    problem_statement: {
      type: DataTypes.TEXT,
    },

    already_built: {
      type: DataTypes.TEXT,
    },

    team_vibe: {
      type: DataTypes.TEXT,
    },

    /* -------- Mode 2 -------- */
    category: {
      type: DataTypes.STRING(100),
    },

    vibe_note: {
      type: DataTypes.TEXT,
    },

    /* -------- Shared -------- */
    mode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['idea', 'vibe']],
      },
    },

    hackathon_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    format: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In-Person', 'Hybrid']],
      },
    },

    date_range: {
      type: DataTypes.STRING(100),
    },

    prize: {
      type: DataTypes.STRING(100),
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'open',
      validate: {
        isIn: [['open', 'closed', 'completed']],
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
    tableName: 'hackathon_posts',
    timestamps: false,

    indexes: [
      { fields: ['creator_id'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
      { fields: ['format'] },
      { fields: ['category'] },
    ],
  }
);

/* 🔗 Association */
hackathon_posts.belongsTo(users, {
  foreignKey: 'creator_id',
  as: 'creator',
  onDelete: 'CASCADE',
});


/* ✅ Joi Validation */
hackathon_posts.joiValidate = (obj) => {
  const schema = Joi.object({
    id: Joi.number().integer(),

    creator_id: Joi.number().integer().required(),

    /* Mode 1 */
    project_name: Joi.string().max(255).allow('', null),
    hook_line: Joi.string().max(120).allow('', null),
    problem_statement: Joi.string().allow('', null),
    already_built: Joi.string().allow('', null),
    team_vibe: Joi.string().allow('', null),

    /* Mode 2 */
    category: Joi.string().max(100).allow('', null),
    vibe_note: Joi.string().allow('', null),

    /* Shared */
    mode: Joi.string().valid('idea', 'vibe').required(),

    hackathon_name: Joi.string().max(255).required(),

    format: Joi.string()
      .valid('Online', 'In-Person', 'Hybrid')
      .required(),

    date_range: Joi.string().max(100).allow('', null),

    prize: Joi.string().max(100).allow('', null),

    status: Joi.string()
      .valid('open', 'closed', 'completed')
      .optional(),

    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional(),
  });

  return schema.validate(obj);
};

module.exports = hackathon_posts;