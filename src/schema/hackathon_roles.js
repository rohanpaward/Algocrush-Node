/* eslint-disable camelcase */
const { DataTypes } = require('sequelize');
const Joi = require('joi');

const { sequelize } = require('../../db');
const hackathon_posts = require('./hackathon_posts');

const hackathon_roles = sequelize.define(
  'hackathon_roles',
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

    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    slots_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },

    slots_filled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isLessThanOrEqualTotal(value) {
          if (value > this.slots_total) {
            throw new Error('slots_filled cannot exceed slots_total');
          }
        },
      },
    },

    requirement: {
      type: DataTypes.TEXT,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'hackathon_roles',
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['post_id', 'role_name'],
      },
      {
        fields: ['post_id'],
      },
    ],
  }
);

/* 🔗 Associations */
hackathon_roles.belongsTo(hackathon_posts, {
  foreignKey: 'post_id',
  as: 'post',
  onDelete: 'CASCADE',
});

hackathon_posts.hasMany(hackathon_roles, {
  foreignKey: 'post_id',
  as: 'roles',
});

/* ✅ Joi Validation */
hackathon_roles.joiValidate = (obj) => {
  const schema = Joi.object({
    id: Joi.number().integer(),

    post_id: Joi.number().integer().required(),

    role_name: Joi.string().max(100).required(),

    slots_total: Joi.number().integer().min(1).required(),

    slots_filled: Joi.number()
      .integer()
      .min(0)
      .max(Joi.ref('slots_total')),

    requirement: Joi.string().allow('', null),

    created_at: Joi.date().optional(),
  });

  return schema.validate(obj);
};

module.exports = hackathon_roles;