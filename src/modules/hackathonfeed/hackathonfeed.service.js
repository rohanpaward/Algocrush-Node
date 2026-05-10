// Sequelize
const { Op, Sequelize, col, literal, fn, where } = require('sequelize');
const { sequelize } = require('../../../db');

// Utilities
const { formatResponse } = require('../../utility/response-toolkit');

// Logger
const { logger } = require('../../utility/logger');

// Joi
const hackathon_posts = require('../../schema/hackathon_posts');
const hackathon_roles = require('../../schema/hackathon_roles');
const users = require('../../schema/users');


const hackathonFeedService = async (userId, offset = 0) => {
  try {

    const hackathonFeed = await hackathon_posts.findAll({
      attributes: [
        'id',
        'mode',
        'project_name',
        'hook_line',
        'problem_statement',
        'already_built',
        'team_vibe',
        'category',
        'vibe_note',
        'hackathon_name',
        'format',
        'date_range',
        'prize',
        'status',
        'created_at',
        'updated_at',

        [
          Sequelize.literal(`(
            SELECT COALESCE(SUM(hr.slots_total), 0)
            FROM hackathon_roles hr
            WHERE hr.post_id = "hackathon_posts"."id"
          )`),
          'total_slots'
        ],

        [
          Sequelize.literal(`(
            SELECT COALESCE(SUM(hr.slots_filled), 0)
            FROM hackathon_roles hr
            WHERE hr.post_id = "hackathon_posts"."id"
          )`),
          'filled_slots'
        ],

        [
          Sequelize.literal(`(
            SELECT COUNT(hr.id)
            FROM hackathon_roles hr
            WHERE hr.post_id = "hackathon_posts"."id"
              AND hr.slots_filled < hr.slots_total
          )`),
          'open_roles_count'
        ],
      ],

      where: {
        status: 'open',
        ...(userId && {
          creator_id: {
            [Op.ne]: userId,
          }
        })
      },

      include: [
        {
          model: users,
          as: 'creator',
          attributes: [
            'id',
            'username',
            'profile_photo_url',
            'role_name',
            'college_name',
            'study_year',
          ],
        },
        {
          model: hackathon_roles,
          as: 'roles',
          attributes: [
            'id',
            'role_name',
            'slots_total',
            'slots_filled',
            'requirement',
          ],
          required: false,
        },
      ],

      order:    [['created_at', 'DESC']],
      limit:    20,
      offset:   parseInt(offset) || 0,   // ← force number always
      distinct: true,
    });

    return formatResponse(
      {
        posts:      hackathonFeed,
        nextOffset: hackathonFeed.length === 20 ? (parseInt(offset) || 0) + 20 : null,
      },
      200
    );

  } catch (error) {
    logger.info(error);
    console.error('hackathon-feed:error', error);
    throw error;
  }
};


const createHackathonPostService = async (payload, schemaName) => {
    const t = await sequelize.transaction();
  
    try {
      const {
        creator_id,
        mode,
        project_name,
        hook_line,
        category,
        hackathon_name,
        format,
        date_range,
        prize,
        problem_statement,
        already_built,
        team_vibe,
        roles
      } = payload;
  
      /* ---------------- CREATE POST ---------------- */
      const hackathonPost = await hackathon_posts.schema(schemaName).create(
        {
          creator_id,
          mode,
          project_name,
          hook_line,
          category,
          hackathon_name,
          format,
          date_range,
          prize,
          problem_statement,
          already_built,
          team_vibe,
        },
        { transaction: t }
      );
  
      /* ---------------- ROLES ---------------- */
      if (roles?.length) {
        const uniqueRoles = [];
        const seen = new Set();
  
        for (const r of roles) {
          if (!seen.has(r.role_name)) {
            seen.add(r.role_name);
            uniqueRoles.push(r);
          }
        }
  
        await hackathon_roles.schema(schemaName).bulkCreate(
          uniqueRoles.map((r) => ({
            post_id: hackathonPost.id,
            role_name: r.role_name,
            slots_total: r.slots_total,
            requirement: r.requirement,
          })),
          { transaction: t }
        );
      }
  
      /* ---------------- FETCH ---------------- */
      const post = await hackathon_posts.schema(schemaName).findOne({
        where: { id: hackathonPost.id },
        transaction: t
      });
  
      const rolesData = await hackathon_roles.schema(schemaName).findAll({
        where: { post_id: hackathonPost.id },
        transaction: t
      });
  
      await t.commit();
  
      /* ---------------- FINAL RESPONSE ---------------- */
      const createdPost = {
        ...post.toJSON(),
        roles: rolesData
      };
  
      return formatResponse(createdPost, 200);
  
    } catch (error) {
      console.log(error);
      await t.rollback();
      logger.info(error);
  
      return formatResponse(null, 500);
    }
  };


module.exports = {
    hackathonFeedService,
    createHackathonPostService,
}