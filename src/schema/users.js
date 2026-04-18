  /* eslint-disable comma-dangle */
  /* eslint-disable camelcase */
  const Joi = require('joi');
  const { DataTypes } = require('sequelize');
  const { sequelize } = require('../../db');

  const statuses = require('./statuses');
  // const lookingfor = require('./looking_for')


  const users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      role_id:{
        type: DataTypes.INTEGER
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      profile_photo_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      best_product_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      best_product_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      best_product_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      bio_question: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      profile_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'status',
          key: 'id',
        },
      },

      // 🔥 NEW FIELDS (STRICT VALIDATION)

      experience_level: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: [['Beginner', 'Intermediate', 'Advanced', 'Expert']],
        },
      },

      availability: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: [['FULL_TIME', 'PART_TIME', 'WEEKEND', 'FELXIBLE']],
        },
      },

      builder_type: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: [
            ['Student', 'Hobbyist', 'Indie Hacker', 'Freelancer', 'Professional'],
          ],
        },
      },

      looking_for_id:{
        type: DataTypes.INTEGER,
        allowNull:true,

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
      tableName: 'users',
      timestamps: false,
    }
  );

  users.belongsTo(statuses, {
    foreignKey: 'status_id',
    targetKey: 'id',
  });




  users.joiValidate = (obj) => {
    const schema = {
      id: Joi.number().integer(),
      email: Joi.string().email().required(),
      role_id: Joi.number().integer().required(),
      username: Joi.string().optional(),
      profile_photo_url: Joi.string().uri().optional(),
      best_project_title: Joi.string().optional(),
      best_project_description: Joi.string().optional(),
      best_project_link: Joi.string().uri().optional(),
      bio_question: Joi.string().optional(),
      looking_for_id: Joi.number().integer().required(),
      profile_completed: Joi.boolean().optional(),
      status_id: Joi.number().integer().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    };

    return Joi.validate(obj, schema);
  };

  module.exports = users;

