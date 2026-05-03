const auth = require('../modules/auth/auth.controller.js')
const onboarding = require('../modules/Onboarding/onboarding.controller.js')
const discovery = require('../modules/discovery/discovery.controller.js')
const chats = require('../modules/chat/chat.controller.js')
module.exports = [].concat(auth,onboarding,discovery,chats);