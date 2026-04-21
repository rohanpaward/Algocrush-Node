/*
 * This file contains all the endpoints for the Authentication Module
 *
 *
 */

const onboardingEndpoints = {
    GET_ROLES:'/api/v1/algocrush/get-roles',
    GET_DOMAINS:'/api/v1/algocrush/get-domains',
    GET_SKILLS_BY_DOMAIN:'/api/v1/algocrush/get-skill-by-domian',
    GET_LOOKING_FOR: '/api/v1/algocrush/get-looking-for',
    ONBOARD_USER:'/api/v1/algocrush/register-user',
    GET_BUILD_TYPES:'/api/v1/algocrush/get-build-types'
    // LOGIN_CAPTAIN: '/captain/login',
    // LOGOUT: '/logout',
    // USER_REGISTER: '/user/register',
    // CAPTAIN_REGISTER: '/captain/register'
  };
  module.exports = {
    onboardingEndpoints,
  };