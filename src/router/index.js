const auth = require('../modules/auth/auth.controller.js')
const onboarding = require('../modules/Onboarding/onboarding.controller.js')
module.exports = [].concat(auth,onboarding);