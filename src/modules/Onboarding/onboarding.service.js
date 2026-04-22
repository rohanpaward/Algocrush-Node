// Sequelize
const { Op, Sequelize } = require('sequelize');
const {sequelize} = require('../../../db');

// Utilities
const { formatResponse, sendResponse } = require('../../utility/response-toolkit');

// Logger
const { logger } = require('../../utility/logger');

// Joi
const roles = require('../../schema/roles')
const Domains = require('../../schema/domains')
const Skills = require('../../schema/skills');
const lookingFor = require('../../schema/looking_for');
const User = require('../../schema/users')
const UserDomainMapping = require('../../schema/user_domains');
const UserSkillMapping = require('../../schema/user_skills');
const statuses = require('../../schema/statuses');
const build_types = require('../../schema/build_types');
const user_build_types = require('../../schema/user_build_types');



const fetchRoleService = async () => {

    const t = await sequelize.transaction();
    try {
      const serviceResponse = await roles.findAll({})
      await t.commit();
      logger.info('Data fetched successfully');
      return formatResponse(serviceResponse, 200);
    } catch (error) {
      await t.rollback();
      logger.info(error);
      return formatResponse(error, 500);
    }
  };

  const fetchDomainService = async () => {
    try {
      const domains = await Domains.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
        raw: true,
      });
  
      return formatResponse(domains, 200);
    } catch (error) {
      logger.error(error);
      return formatResponse(error, 500);
    }
  };

  const fetchSkillsByDomainService = async (domainIds) => {
    try {
      // Ensure it's always an array
      if (!Array.isArray(domainIds)) {
        if (typeof domainIds === 'string') {
          domainIds = domainIds.split(',').map(Number);
        } else {
          domainIds = [domainIds];
        }
      }
  
      const skills = await Skills.findAndCountAll({
        where: {
          domain_id: {
            [Op.in]: domainIds,
          },
        },
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
        raw: true,
      });
  
      return formatResponse(skills, 200);
    } catch (error) {
      logger.error(error);
      return formatResponse(error, 500);
    }
  };

  const fetchLookingforService = async () => {

    // const t = await sequelize.transaction();
    try {
      const serviceResponse = await lookingFor.findAll({
        attributes: ["id", "name", "label", "description"],
      });      // await t.commit();
      logger.info('Data fetched successfully');
      return formatResponse(serviceResponse, 200);
    } catch (error) {
    //   await t.rollback();
      logger.info(error);
      return formatResponse(error, 500);
    }
  };


  const fetchbuildtypesService = async () => {

    // const t = await sequelize.transaction();
    try {
      const serviceResponse = await build_types.findAll({
        attributes: ["id", "name", "label"],
      });      // await t.commit();
      logger.info('Data fetched successfully');
      return formatResponse(serviceResponse, 200);
    } catch (error) {
    //   await t.rollback();
      logger.info(error);
      return formatResponse(error, 500);
    }
  };

  //register user!!
  const registerUserService = async (data, userId, schemaName) => {
    const t = await sequelize.transaction();
  
    try {
      const {
        name,
        avatar,
        roleId,
        roleName,
  
        CollegeName,
        studyYear,
        collabStatus,
  
        buildTypeIds,
        currentBuild,
  
        projectName,
        projectProblem,
        projectChallenge,
        projectSolution,
        projectGithubUrl,
        ProjectLiveUrl,
  
        githubUrl,
        lookingfor,
        vibeAnswer,
      } = data;
  
      const status = await statuses.findOne({
        where: { name: "active" },
      });
  
      // 1. UPDATE USER
      await User.schema(schemaName).update(
        {
          username: name,
          profile_photo_url: avatar,
  
          // Basic
          college_name: CollegeName,
          study_year: studyYear,
          collab_status: collabStatus,
  
          // Role
          role_id: roleId,
          role_name: roleName,
  
          // Project
          project_name: projectName,
          project_problem: projectProblem,
          project_challenge: projectChallenge,
          project_solution: projectSolution,
          project_github_url: projectGithubUrl,
          project_live_url: ProjectLiveUrl,
          current_build:currentBuild,
  
          // Optional
          github_url: githubUrl,
  
          // Intent
          looking_for_id: Number(lookingfor),
          vibe_answer: vibeAnswer,
  
          // Status
          status_id: status?.id,
          profile_completed: true,
        },
        {
          where: { id: userId },
          transaction: t,
        }
      );
  
      // 2. BUILD TYPES MAPPING
      if (buildTypeIds?.length) {
        // delete old mappings
        await user_build_types.schema(schemaName).destroy({
          where: { user_id: userId },
          transaction: t,
        });
  
        // insert new mappings
        await user_build_types.schema(schemaName).bulkCreate(
          buildTypeIds.map((id) => ({
            user_id: userId,
            build_type_id: id,
          })),
          { transaction: t }
        );
      }
  
      await t.commit();

      const updatedUser = await User.schema(schemaName).findOne({
        where: { id: userId },
      });
  
      return formatResponse(updatedUser, 200);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  module.exports = {
    fetchRoleService, 
    fetchSkillsByDomainService,
    fetchDomainService,
    fetchLookingforService,
    registerUserService,
    fetchbuildtypesService
  }