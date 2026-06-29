/*
 * This file contains all the endpoints for the teamformation Module
 *
 *
 */

const teamformationEndpoints = {
    REQUEST_JOIN:'/api/v1/algocrush/teamformation/requset',
    HACKTHON_REQUEST:'/api/v1/algocrush/teamformation/hackathon-received-requests',
    HACKTHON_SENT_REQUESTS:'/api/v1/algocrush/teamformation/hackathon-sent-requests',
    HACKATHON_ACCEPT_REQUEST: '/api/v1/algocrush/teamformation/accept-request',
    HACKATHON_REJECT_REQUEST:'/api/v1/algocrush/teamformation/reject-request',
    GET_HACKATHON_TEAMS:'/api/v1/algocrush/teamformation/get-hackathon-teams'
    
  };
  module.exports = {
    teamformationEndpoints,
  };