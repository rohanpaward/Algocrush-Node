const jwt = require('jsonwebtoken');

const createAppJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const verifyAppJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createAppJWT,
  verifyAppJWT,
};
