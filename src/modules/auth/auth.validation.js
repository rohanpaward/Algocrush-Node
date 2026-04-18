const Joi = require("joi");

const googleCallbackValidation = {
  query: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required(),
  }),
};

module.exports = { googleCallbackValidation };