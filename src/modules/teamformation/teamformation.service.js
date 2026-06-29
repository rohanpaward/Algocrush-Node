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
const hackathon_requests = require('../../schema/hackathon_requests');
const chat_rooms = require('../../schema/chat_rooms');
const users = require('../../schema/users');
const hackathon_team_members = require('../../schema/hackathon_team_members')

const createHackathonRequestService = async (payload, schemaName) => {
    const t = await sequelize.transaction();

    try {
        const {
            post_id,
            role_id,
            applicant_id,
            intro_message,
        } = payload;

        /* ---------------- CHECK POST ---------------- */

        const post = await hackathon_posts.findOne({
            where: {
                id: post_id,
                status: 'open',
            },
            transaction: t,
        });

        if (!post) {
            await t.rollback();

            return formatResponse(
                'Hackathon post not found or closed',
                404
            );
        }

        /* ---------------- PREVENT OWN POST APPLY ---------------- */

        if (Number(post.creator_id) === Number(applicant_id)) {
            await t.rollback();

            return formatResponse(
                'You cannot apply to your own post',
                400
            );
        }

        /* ---------------- CHECK ROLE ---------------- */

        const role = await hackathon_roles.findOne({
            where: {
                id: role_id,
                post_id,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (!role) {
            await t.rollback();

            return formatResponse(
                'Role not found for this post',
                404
            );
        }

        /* ---------------- CHECK SLOT AVAILABILITY ---------------- */

        if (role.slots_filled >= role.slots_total) {
            await t.rollback();

            return formatResponse(
                'This role is already full',
                400
            );
        }

        /* ---------------- CHECK DUPLICATE REQUEST ---------------- */

        const existingRequest = await hackathon_requests.findOne({
            where: {
                post_id,
                role_id,
                applicant_id,
            },
            transaction: t,
        });

        if (existingRequest) {
            await t.rollback();

            return formatResponse(
                'You have already applied for this role',
                400
            );
        }

        /* ---------------- CREATE REQUEST ---------------- */

        const request = await hackathon_requests.create(
            {
                post_id,
                role_id,
                applicant_id,
                intro_message,
                status: 'pending',
            },
            {
                transaction: t,
            }
        );

        await t.commit();

        return formatResponse(request, 200);

    } catch (error) {
        console.log(error);

        await t.rollback();

        logger.info(error);

        return formatResponse(
            'Internal Server Error',
            500
        );
    }
};


const getHackathonRequestService = async (payload, schemaName) => {
    try {

        const { userId } = payload;

        const requests = await hackathon_requests.findAll({

            include: [

                {
                    model: hackathon_posts,
                    as: 'post',

                    required: true,

                    where: {
                        creator_id: userId
                    },

                    attributes: [
                        'id',
                        'project_name',
                        'hackathon_name',
                        'category'
                    ]
                },

                {
                    model: hackathon_roles,
                    as: 'role',

                    attributes: [
                        'id',
                        'role_name'
                    ]
                },

                {
                    model: users,
                    as: 'applicant',

                    attributes: [
                        'id',
                        'username',
                        'profile_photo_url'
                    ]
                }

            ],

            order: [['created_at', 'DESC']]
        });

        return formatResponse(
            requests,
            200,
            'Hackathon requests fetched successfully'
        );

    } catch (error) {

        console.log(error);
        logger.info(error);

        return formatResponse(
            'Internal Server Error',
            500
        );
    }
};


const getHackathonSentRequestsService = async (payload, schemaName) => {
    try {
        const { userId } = payload;

        const requests = await hackathon_requests.schema(schemaName).findAll({
            where: {
                applicant_id: userId,
            },

            include: [
                {
                    model: hackathon_posts.schema(schemaName),
                    as: "post",
                    attributes: [
                        "id",
                        "project_name",
                        "hackathon_name",
                        "category",
                        "creator_id",
                        "status",
                    ],
                    include: [
                        {
                            model: users.schema(schemaName),
                            as: "creator",
                            attributes: [
                                "id",
                                "username",
                                "profile_photo_url",
                            ],
                        },
                    ],
                },

                {
                    model: hackathon_roles.schema(schemaName),
                    as: "role",
                    attributes: [
                        "id",
                        "role_name",
                    ],
                },
            ],

            order: [["created_at", "DESC"]],
        });

        return formatResponse(
            requests,
            200,
            'Sent requests fetched successfully'
        );
    } catch (error) {
        console.log(error);
        logger.info(error);
        return formatResponse("Internal Server Error", 500);
    }
};

const acceptRequest = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            requestId,
            userId,
            postId,
            roleId,
        } = req;

        // Check if post exists
        const post = await hackathon_posts.findOne({
            where: {
                id: postId,
            },
            transaction: t,
        });

        if (!post) {
            await t.rollback();
            return formatResponse("Hackathon post not found.", 404);
        }

        const creatorId = post.creator_id;

        // Update request status
        await hackathon_requests.update(
            {
                status: "accepted",
            },
            {
                where: {
                    id: requestId,
                },
                transaction: t,
            }
        );

        // Check if owner already exists in team
        const ownerExists = await hackathon_team_members.findOne({
            where: {
                post_id: postId,
                user_id: creatorId,
            },
            transaction: t,
        });

        // Insert owner only once
        if (!ownerExists) {
            await hackathon_team_members.create(
                {
                    post_id: postId,
                    user_id: creatorId,
                    member_type: "creator",
                },
                {
                    transaction: t,
                }
            );
        }

        // Check if applicant already exists in team
        const memberExists = await hackathon_team_members.findOne({
            where: {
                post_id: postId,
                user_id: userId,
            },
            transaction: t,
        });

        // Insert applicant only once
        if (!memberExists) {
            await hackathon_team_members.create(
                {
                    post_id: postId,
                    user_id: userId,
                    role_id: roleId,
                    request_id: requestId,
                    member_type: "member",
                },
                {
                    transaction: t,
                }
            );
        }

        await t.commit();

        return formatResponse(
            "Request accepted successfully.",
            200
        );

    } catch (error) {
        await t.rollback();

        console.log(error);
        logger.error(error);

        return formatResponse(
            "Internal Server Error",
            500
        );
    }
};


const rejectRequestService = async (req, res) => {
    try {
        const { requestId } = req;

        const request = await hackathon_requests.findOne({
            where: {
                id: requestId,
            },
        });

        if (!request) {
            return formatResponse(
                "Hackathon request not found.",
                404
            );
        }

        await request.update({
            status: "rejected",
        });

        return formatResponse(
            "Request rejected successfully.",
            200
        );
    } catch (error) {
        console.log(error);
        logger.error(error);

        return formatResponse(
            "Internal Server Error",
            500
        );
    }
};

const getTeamsService = async (req, res) => {
    try {
        const { userId } = req;

        const teams = await hackathon_team_members.findAll({
            where: {
                user_id: userId,
            },
            include: [
                {
                    model: hackathon_posts,
                    as: "post",
                    attributes: [
                        "id",
                        "project_name",
                        "hackathon_name",
                        "status",
                        "creator_id",
                    ],
                },
            ],
            order: [["joined_at", "DESC"]],
        });

        return formatResponse(
            teams,
            200,
            "Teams fetched successfully.",
        );
    } catch (error) {
        console.log(error);
        logger.error(error);

        return formatResponse(
            "Internal Server Error",
            500
        );
    }
};


module.exports = {
    createHackathonRequestService,
    getHackathonRequestService,
    getHackathonSentRequestsService,
    acceptRequest,
    rejectRequestService,
    getTeamsService
}