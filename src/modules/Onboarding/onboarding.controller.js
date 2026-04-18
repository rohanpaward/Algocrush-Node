const responseToolkit = require('../../utility/response-toolkit');
const { httpProtocols } = require('../../utility/constants');
const { onboardingEndpoints } = require('./onboarding.endpoint');
const queryParser = require('../../utility/query-parser')
const OnboardingOptions = require('./onboarding.options');
const OnboardingService = require('./onboarding.service')
const {fetchDomainService, fetchSkillsByDomainService} = require('./onboarding.service')
const jwt = require("jsonwebtoken");
const { options } = require('joi');



const fetchRolesHandler = async (req, res) => {
    const serviceResponse = await OnboardingService.fetchRoleService();
    return responseToolkit.sendResponse(serviceResponse, res);
  };

  const fetchDomainHandler = async (req, res) => {
    const response = await fetchDomainService();
    return responseToolkit.sendResponse(response, res);
  };
  
  const fetchSkillsByDomainHandler = async (req, res) => {
    const { domainId } = req.query;
    const response = await fetchSkillsByDomainService(domainId);
    return responseToolkit.sendResponse(response, res);
  };


  const fetchLookingforHandler = async (req, res) => {
    const response = await OnboardingService.fetchLookingforService();
    return responseToolkit.sendResponse(response, res);
  };


  const registerUser = async (req, res) => {
    try {
      const payload = req.payload;
      const { schemaName } = req.app;
  
      // 🔥 1. Get token from cookie
      const token = req.state.token;
  
      if (!token) {
        return h.response({ message: "Unauthorized" }).code(401);
      }
  
      // 🔥 2. Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const userId = decoded.userId;
  
      // 🔥 3. Call service with userId
      const serviceResponse = await OnboardingService.registerUserService(
        payload,
        userId,
        schemaName || "public"
      );
  
      return responseToolkit.sendResponse(serviceResponse, res);
  
    } catch (error) {
      console.error(error);
      return responseToolkit.sendResponse(error, res);
    }
  };
  

module.exports = [
  {
    method: httpProtocols.GET,
    path: onboardingEndpoints.GET_ROLES,
//    options: OnboardingOptions.fetchRolesOptions,
    options: {
        auth:false
    },
    handler: fetchRolesHandler,
    
  },
  {
    method: httpProtocols.GET,
    path: onboardingEndpoints.GET_DOMAINS,
//    options: OnboardingOptions.fetchRolesOptions,
    options: {
        auth:false
    },
    handler: fetchDomainHandler,
    
  },
  {
    method: httpProtocols.GET,
    path: onboardingEndpoints.GET_SKILLS_BY_DOMAIN,
//    options: OnboardingOptions.fetchRolesOptions,
    options: {
        auth:false
    },
    handler: fetchSkillsByDomainHandler,
    
  },
  {
    method: httpProtocols.GET,
    path: onboardingEndpoints.GET_LOOKING_FOR,
//    options: OnboardingOptions.fetchRolesOptions,
    options: {
        auth:false
    },
    handler: fetchLookingforHandler,
    
  },
  {
    method:httpProtocols.POST,
    path:onboardingEndpoints.ONBOARD_USER,
    options: {
      auth:false
    },
    handler:registerUser,
  }
];