const responseToolkit = require('../../utility/response-toolkit');
const { httpProtocols } = require('../../utility/constants');
// const discoveryService = require('./discovery.service');
const chatService = require('./chat.service')
const { chatEndpoints } = require('./chat.endpoints');



  const fetchAllChatsHandler = async (req, res) => {
    const userId = req.query.userId
    const schemaName = 'public'
    const serviceResponse = await chatService.fetchAllChatsService(userId,schemaName);
    return responseToolkit.sendResponse(serviceResponse, res);
  };

  

module.exports = [
  {
    method: httpProtocols.GET,
    path: chatEndpoints.GET_ALL_CHATS,
    options: {
        auth:false
    },
    handler: fetchAllChatsHandler,
    
  },
];