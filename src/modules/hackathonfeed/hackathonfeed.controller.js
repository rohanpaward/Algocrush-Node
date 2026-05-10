const responseToolkit = require('../../utility/response-toolkit');
const { httpProtocols } = require('../../utility/constants');
const {hackathonfeedEndpoints} = require('./hackathonfeed.endpoint')
const hackathonService = require('./hackathonfeed.service')




  const createHackathonPostHandler = async (req, res) => {
    const payload = req.payload;
    const schemaName = 'public'
    const response = await hackathonService.createHackathonPostService(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  };

  const hackathonFeedHandler = async (req, res) => {
    // const payload = req.payload;
    const userId = req.query.userId
    const schemaName = 'public'
    const response = await hackathonService.hackathonFeedService(userId,schemaName);
    return responseToolkit.sendResponse(response, res);
  };
  

module.exports = [
  {
    method: httpProtocols.POST,
    path: hackathonfeedEndpoints.CREATE_POST,
    options: {
        auth:false
    },
    handler: createHackathonPostHandler,
    
  },
  {
    method:httpProtocols.GET,
    path: hackathonfeedEndpoints.HACKATHON_FEED,
    options:{
        auth:false
    },
    handler: hackathonFeedHandler
  }
];