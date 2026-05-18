const auth = require('../modules/auth/auth.controller.js')
const onboarding = require('../modules/Onboarding/onboarding.controller.js')
const discovery = require('../modules/discovery/discovery.controller.js')
const chats = require('../modules/chat/chat.controller.js')
const hackathonfeed = require('../modules/hackathonfeed/hackathonfeed.controller.js')
const teamformation = require('../modules/teamformation/teamformation.controller.js')
module.exports = [].concat(auth,onboarding,discovery,chats,hackathonfeed,teamformation);