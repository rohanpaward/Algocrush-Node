const { googleCallbackValidation } = require('./auth.validation')

const googleAuthOptions = {
  tags: ['api', 'auth'],
  description: 'Login or register user via Google OAuth',
  validate: googleCallbackValidation,
  auth: false, // public route
};

module.exports = {
  googleAuthOptions
}