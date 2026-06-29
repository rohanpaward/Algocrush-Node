const responseToolkit = require('../../utility/response-toolkit');
const { httpProtocols } = require('../../utility/constants');
const {teamformationEndpoints} = require('./teamformation.endpoint')
const  teamformationService = require('./teamformation.service')



  const createHackathonRequestHandler = async (req, res) => {
    const payload = req.payload;
    const schemaName = 'public'
    const response = await teamformationService.createHackathonRequestService(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  };

  const getHackathonRequestHandler = async (req, res) => {
    const payload = req.payload;
    const schemaName = 'public'
    const response = await teamformationService.getHackathonRequestService(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  };

  const getHackathonSentRequestsHandler = async (req, res) => {
    const payload = req.payload;
    const schemaName = 'public'
    const response = await teamformationService.getHackathonSentRequestsService(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  };

  const acceptRequest = async(req, res)=>{
    const payload = req.payload;
    const schemaName = 'public'
    const response = await teamformationService.acceptRequest(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  }

  const rejectRequest = async(req, res)=>{
    const payload = req.payload;
    const schemaName = 'public'
    const response = await teamformationService.rejectRequestService(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  }

module.exports = [
  {
    method: httpProtocols.POST,
    path: teamformationEndpoints.REQUEST_JOIN,
    options: {
        auth:false
    },
    handler: createHackathonRequestHandler,
    
  },
  {
    method:httpProtocols.POST,
    path:teamformationEndpoints.HACKTHON_REQUEST,
    options:{
        auth:false
    },
    handler:getHackathonRequestHandler
  },
  {
    method:httpProtocols.POST,
    path:teamformationEndpoints.HACKTHON_SENT_REQUESTS,
    options:{
        auth:false
    },
    handler:getHackathonSentRequestsHandler
  },
  {
    method:httpProtocols.POST,
    path:teamformationEndpoints.HACKATHON_ACCEPT_REQUEST,
    options:{
        auth:false
    },
    handler:acceptRequest
  },
  {
    method:httpProtocols.POST,
    path:teamformationEndpoints.HACKATHON_REJECT_REQUEST,
    options:{
        auth:false
    },
    handler:rejectRequest
    
  }
  
];