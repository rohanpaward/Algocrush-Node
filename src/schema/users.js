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

      college_name:{
        type:DataTypes.STRING,
        allowNull:true
      },

      study_year:{
        type:DataTypes.STRING,
        allowNull:true
      },

      collab_status:{
        type:DataTypes.STRING,
        allowNull:true
      },
      role_name:{
        type:DataTypes.STRING
      },
      project_name:{
        type:DataTypes.STRING,
        allowNull:true
      },
      project_problem:{
        type:DataTypes.STRING,
        allowNull:true
      },
      project_challenge:{
        type:DataTypes.STRING,
        allowNull:true
      },
      project_solution:{
        type:DataTypes.STRING,
        allowNull:true
      },
      project_github_url:{
        type:DataTypes.STRING,
      },
      project_live_url:{
        type:DataTypes.STRING
      },      
      
      current_build:{
        type:DataTypes.STRING
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
     
      vibe_answer:{
        type:DataTypes.STRING
      }
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
    const schema = Joi.object({
      id: Joi.number().integer(),
  
      email: Joi.string().email().required(),
  
      role_id: Joi.number().integer().required(),
      role_name: Joi.string().optional(),
  
      username: Joi.string().optional(),
  
      profile_photo_url: Joi.string().uri().allow('', null),
  
      // Basic Info
      college_name: Joi.string().required(),
      study_year: Joi.string()
        .valid(
          'year_1',
          'year_2',
          'year_3',
          'year_4_plus',
          'postgrad',
          'graduate',
          'other'
        )
        .required(),
  
      collab_status: Joi.string()
        .valid('active', 'selective', 'closed')
        .required(),
  
      // Project (Proof of Work)
      project_name: Joi.string().required(),
      project_problem: Joi.string().required(),
      project_challenge: Joi.string().required(),
      project_solution: Joi.string().required(),
  
      project_github_url: Joi.string().uri().allow('', null),
      project_live_url: Joi.string().uri().allow('', null),
  
      // Intent
      looking_for_id: Joi.number().integer().required(),
  
      // System fields
      profile_completed: Joi.boolean().optional(),
      status_id: Joi.number().integer().optional(),
  
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
      current_build: Joi.string().optional(),
      vibe_answer:Joi.string().optional()
    });
  
    return schema.validate(obj);
  };


  module.exports = users;

