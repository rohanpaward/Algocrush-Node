// Sequelize
const { Op, Sequelize, col, literal, fn } = require('sequelize');
const { sequelize } = require('../../../db');

// Utilities
const { formatResponse } = require('../../utility/response-toolkit');

// Logger
const { logger } = require('../../utility/logger');

// Joi

const User = require('../../schema/users');
const swipes = require('../../schema/swipes');
const lookingFor = require('../../schema/looking_for');
const user_build_types = require('../../schema/user_build_types');
const build_types = require('../../schema/build_types');



//update user 
const recordSwipeService = async (data, schemaName) => {
    const t = await sequelize.transaction();

    try {
        const {
            swiper_id,
            swiped_id,
            direction
        } = data;

        // 1. UPDATE USER
        await swipes.schema(schemaName).create(
            {
                swiper_id,
                swiped_id,
                direction

            }
        );

        await t.commit();


        return formatResponse("swipe recorded", 200);
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// user-feed service
const userFeedService = async (userId, schemaName) => {
    const t = await sequelize.transaction();
    try {
        const users = await User.findAll({
            attributes: [
                'id',
                'username',
                'role_id',
                'role_name',
                'looking_for_id',
                'collab_status',
                'college_code',
                'college_name',
                'study_year',
                'profile_photo_url',
                'project_name',
                'project_problem',
                'project_challenge',
                'project_solution',
                'project_github_url',
                'project_live_url',
                'current_build',
                'vibe_answer',
                'created_at',
                'updated_at',
                'profile_completed',

                // looking_for label
                [col('lookingFor.label'), 'looking_for_label'],

                // array_agg with filter + coalesce
                [
                    literal(`
                        COALESCE(
                          array_agg("user_build_types->build_type"."label")
                          FILTER (WHERE "user_build_types->build_type"."name" IS NOT NULL),
                          '{}'
                        )
                      `),
                    'build_types'
                ]
            ],

            include: [
                {
                    model: lookingFor,
                    as: 'lookingFor',
                    attributes: [],
                    required: false // LEFT JOIN
                },
                {
                    model: user_build_types,
                    attributes: [],
                    required: false,
                    include: [
                        {
                            model: build_types,
                            attributes: [],
                            required: false
                        }
                    ]
                }
            ],

            where: {
                id: { [Op.ne]: userId },
                collab_status: { [Op.ne]: 'closed' },
                profile_completed: true
            },

            group: ['users.id', 'lookingFor.label'],

            raw: true
        });

        return formatResponse(users, 200)

    } catch (error) {
        logger.info(error)
        console.error("FULL DB ERROR:", err);
        t.rollback()
        throw error;

    }
}




module.exports = {
    userFeedService,
    recordSwipeService
}