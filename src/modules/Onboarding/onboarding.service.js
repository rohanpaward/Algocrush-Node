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
      const serviceResponse = await lookingFor.findAll({})
      // await t.commit();
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
        builderType,
        projectName,
        projectDesc,
        githubUrl,
        lookingfor,
        vibeAnswer,
        domainIds,
        experience,
        skillIds,
      } = data;

      const status = await statuses.findOne({
        where:{
          name:"active"
        }
      })
  
      //  1. UPDATE EXISTING USER
      await User.schema(schemaName).update(
        {
          username: name,
          avatar,
          role_id: roleId,
          builder_type: builderType,
          best_product_title: projectName,
          best_product_description: projectDesc,
          looking_for_id:lookingfor,
          best_product_link: githubUrl,
          looking_for_id: lookingfor,
          bio_question: vibeAnswer,
          status_id: status.id, // active
          profile_completed: true,
          experience_level:experience,
        },
        {
          where: { id: userId },
          transaction: t,
        }
      );
  
      //  2. Domains
      if (domainIds?.length) {
        await UserDomainMapping.schema(schemaName).bulkCreate(
          domainIds.map((d) => ({
            user_id: userId,
            domain_id: d,
          })),
          { transaction: t }
        );
      }
  
      //  3. Skills
      if (skillIds?.length) {
        await UserSkillMapping.schema(schemaName).bulkCreate(
          skillIds.map((s) => ({
            user_id: userId,
            skill_id: s,
          })),
          { transaction: t }
        );
      }
  
      await t.commit();
  
      return formatResponse(userId, 200)
  
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
    registerUserService
  }