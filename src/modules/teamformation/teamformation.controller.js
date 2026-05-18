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


module.exports = [
  {
    method: httpProtocols.POST,
    path: teamformationEndpoints.REQUEST_JOIN,
    options: {
        auth:false
    },
    handler: createHackathonRequestHandler,
    
  },
  
];