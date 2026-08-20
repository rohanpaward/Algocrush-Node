const jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");

const registerAuthPlugin = async (server) => {

    server.auth.scheme("jwt-cookie", () => {

        return {

            authenticate: async (request, h) => {
               
                console.log("🔥 JWT Authentication Started");
                const token = request.state.accessToken;
            
                if (!token) {
                    throw Boom.unauthorized("Access token missing");
                }
            
                let decoded;
            
                try {
                    decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );
                } catch (err) {
                    throw Boom.unauthorized("Invalid or expired token");
                }
            
                return h.authenticated({
                    credentials: {
                        userId: decoded.userId,
                        profileCompleted: decoded.profileCompleted
                    }
                });
            
            }

        };

    });

    server.auth.strategy("jwt", "jwt-cookie");

};

module.exports = registerAuthPlugin;