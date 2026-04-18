const Joi = require('joi');

const headerValidator = Joi.object({
  authorization: Joi.string().invalid(null, false, 0, '').required(),
}).options({
  allowUnknown: true,
});

module.exports = {
    headerValidator,

  };
