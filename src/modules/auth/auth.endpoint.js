/*
 * This file contains all the endpoints for the Authentication Module
 *
 *
 */

const authEndpoints = {
    AUTH_GOOGLE:'/api/v1/algocrush/auth/google',
    AUTH_GOOGLE_CALLBACK:'/api/v1/algocrush/auth/google/callback',
    AUTH_ME:'/api/v1/algocrush/auth/me'
    // LOGIN_CAPTAIN: '/captain/login',
    // LOGOUT: '/logout',
    // USER_REGISTER: '/user/register',
    // CAPTAIN_REGISTER: '/captain/register'
  };
  module.exports = {
    authEndpoints,
  };