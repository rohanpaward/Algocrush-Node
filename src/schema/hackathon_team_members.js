/* eslint-disable comma-dangle */
/* eslint-disable camelcase */

const Joi = require('joi');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');
const users = require('./users')
const hackathon_posts = require('./hackathon_posts')
const hackathon_roles = require('./hackathon_roles')
const hackathon_requests = require('./hackathon_requests')

const hackathon_team_members = sequelize.define(
    'hackathon_team_members',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        post_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        role_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        request_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        member_type: {
            type: DataTypes.ENUM('creator', 'member'),
            allowNull: false,
            defaultValue: 'member',
        },

        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'hackathon_team_members',
        timestamps: false,
    }
);

hackathon_team_members.belongsTo(hackathon_posts, {
    foreignKey: 'post_id',
    targetKey: 'id',
    as: 'post',
});

hackathon_team_members.belongsTo(users, {
    foreignKey: 'user_id',
    targetKey: 'id',
    as: 'user',
});

hackathon_team_members.belongsTo(hackathon_roles, {
    foreignKey: 'role_id',
    targetKey: 'id',
    as: 'role',
});

hackathon_team_members.belongsTo(hackathon_requests, {
    foreignKey: 'request_id',
    targetKey: 'id',
    as: 'request',
});

// Joi Validation
hackathon_team_members.joiValidate = (obj) => {
    const schema = {
        id: Joi.number().integer(),
        post_id: Joi.number().integer().required(),
        user_id: Joi.number().integer().required(),
        role_id: Joi.number().integer().allow(null),
        request_id: Joi.number().integer().allow(null),
        member_type: Joi.string()
            .valid('creator', 'member')
            .default('member'),
        joined_at: Joi.date().optional(),
    };

    return Joi.validate(obj, schema);
};

module.exports = hackathon_team_members;