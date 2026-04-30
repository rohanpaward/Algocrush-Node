const responseToolkit = require('../../utility/response-toolkit');
const { httpProtocols } = require('../../utility/constants');
// const { onboardingEndpoints } = require('./onboarding.endpoint');
const { discoveryEndpoints } = require('./discovery.endpoint')

// const OnboardingService = require('./onboarding.service')
const discoveryService = require('./discovery.service')



  const recordSwipeHandler = async (req, res) => {
    const payload = req.payload;
    const schemaName = 'public'
    const response = await discoveryService.recordSwipeService(payload,schemaName);
    return responseToolkit.sendResponse(response, res);
  };

  const userFeedHandler = async (req, res) => {
    // const payload = req.payload;
    const userId = req.query.userId
    const schemaName = 'public'
    const response = await discoveryService.userFeedService(userId,schemaName);
    return responseToolkit.sendResponse(response, res);
  };
  

module.exports = [
  {
    method: httpProtocols.POST,
    path: discoveryEndpoints.SWIPE,
    options: {
        auth:false
    },
    handler: recordSwipeHandler,
    
  },
  {
    method:httpProtocols.GET,
    path: discoveryEndpoints.USER_FEED,
    options:{
        auth:false
    },
    handler: userFeedHandler
  }
];