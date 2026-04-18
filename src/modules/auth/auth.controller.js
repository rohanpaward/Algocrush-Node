const { startGoogleOAuth, googleCallbackHandler, getMeHandler } = require('./auth.service');
const responseToolkit = require('../../utility/response-toolkit');
const { httpProtocols } = require('../../utility/constants');
const { authEndpoints } = require('./auth.endpoint')
const { googleAuthOptions } = require('./auth.options');
const { auth } = require('google-auth-library');


// const startGoogleOAuthcontroller  = async (req, res) => {
  
//     const schemaName = req.app?.schemaName || 'public';
//     const payload = req.payload;

//     const serviceResponse = await startGoogleOAuth(payload, schemaName);
//     return responseToolkit.sendResponse(serviceResponse, res);

// };

// const googleCallbackController = async (req, res) =>{
//   const schemaName = req.app?.schemaName || 'public';
//   const payload = req.payload;

//   const serviceResponse = await googleCallbackHandler(payload, schemaName);
//   return responseToolkit.sendResponse(serviceResponse, res);
// }

const startGoogleOAuthcontroller = async (req, res) => {
  console.log('entered here')
  return startGoogleOAuth(req, res); // ✅ pass full req/res
};

const googleCallbackController = async (req, res) => {
  return googleCallbackHandler(req, res); // ✅ same
};
const getMeController = async (req, h) => {
  try {
    const { schemaName } = req.app;

    // ✅ Read from Authorization header instead of cookie
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

    console.log(req,'this si req')
    console.log(authHeader,'this is authheader')

    const serviceResponse = await getMeHandler(token, schemaName);

    return h.response(serviceResponse).code(200);

  } catch (e) {
    console.error(e);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};

module.exports = [
  {
    method: httpProtocols.GET,
    path: authEndpoints.AUTH_GOOGLE,
   options: {
    auth : false
   },
    handler: startGoogleOAuthcontroller,
  },
  {
    method:httpProtocols.GET,
    path:authEndpoints.AUTH_GOOGLE_CALLBACK,
    // options: googleAuthOptions,
    options:{
      auth:false
    },
    handler: googleCallbackController
  },
  {
    method: httpProtocols.GET,
    path: authEndpoints.AUTH_ME,
    options: { auth: false }, // IMPORTANT
    handler: getMeController,
  }
];