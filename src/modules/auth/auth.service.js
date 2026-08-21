const arctic = require("arctic");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth_providers = require("../../schema/auth_providers");
const Users = require("../../schema/users");
const statuses = require("../../schema/statuses");
const user_build_types = require("../../schema/user_build_types");

const google = new arctic.Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);


// START OAUTH
const startGoogleOAuth = async (req, h) => {
  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();

  req.cookieAuth.set({ state, codeVerifier });

  const url = await google.createAuthorizationURL(
    state,
    codeVerifier,
    ["openid", "email", "profile"]
  );

  return h.redirect(url);
};

// CALLBACK
const googleCallbackHandler = async (req, h) => {
  try {
    console.log("Google Callback Handler hit now");
    const { code, state } = req.query;

    const session = req.state["oauth-session"];

    console.log("State from Google:", state);
    console.log("Session:", session);

    if (!session) {
      console.log("❌ oauth-session cookie missing");
      return h.response("Invalid state - no session").code(400);
    }

    console.log("State in cookie:", session.state);

    if (state !== session.state) {
      console.log("❌ State mismatch");
      return h.response("Invalid state - mismatch").code(400);
    }

    //  Exchange code
    const tokens = await google.validateAuthorizationCode(
      code,
      session.codeVerifier
    );

    const accessToken = tokens.accessToken();

    //  Fetch Google user
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const googleUser = await response.json();

    // CLEAN DB LOGIC

    // Find auth provider
    let authProvider = await auth_providers.findOne({
      where: {
        provider: "google",
        provider_user_id: googleUser.id,
      },
    });
    
    let user;

    if (authProvider && authProvider.user_id) {
      // valid existing user
      user = await Users.findByPk(authProvider.user_id);
    }

    const status = await statuses.findOne({
      where: {
        name: "active"
      }
    })

    //  HANDLE BROKEN / FIRST TIME CASE
    if (!user) {
      // create user
      user = await Users.create({
        email: googleUser.email,
        profile_photo_url: googleUser.picture,
        profile_completed: false,
        status_id: status.id,
      });

      if (authProvider) {
        // FIX existing row
        await authProvider.update({
          user_id: user.id,
        });
      } else {
        // create new auth provider
        await auth_providers.create({
          provider: "google",
          provider_user_id: googleUser.id,
          email: googleUser.email,
          user_id: user.id,
        });
      }
    }

    // CREATE JWT

    const token = jwt.sign(
      {
        userId: user.id,
        profileCompleted: user.profile_completed,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const frontendurl = process.env.FRONTEND_URL
    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
    console.log("process.env.NODE_ENV === 'production':", process.env.NODE_ENV === "production");

    h.state("accessToken", token, {
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
      // isSecure: true,
      // isSameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      isSameSite: "None",
      path: "/",
      ttl: 60 * 60 * 1000 // 1 hour
    });

    console.log("Access token cookie set");
   console.log("Redirecting to:", `${frontendurl}/oauth-success`);

    // Clear temporary OAuth session
    console.log("Clearing oauth-session");
    h.unstate("oauth-session", {
      path: "/api/v1/algocrush/auth",
    });    
    return h.redirect(`${frontendurl}/oauth-success`);
    // .redirect("http://localhost:5173/oauth-success?token")
    // .redirect("https://algocrush-frontend.onrender.com/oauth-success")
    // .redirect(`${frontendurl}/oauth-success?token=${token}`)
    // .state("token", token, {
    //   isHttpOnly: true,
    //   isSecure: true,
    //   isSameSite: "None",
    //   path: "/",
    // });

  } catch (err) {
    console.error("OAuth Error:", err);
    return h.response("OAuth failed").code(500);
  }
};

// GET ME
const getMeHandler = async (token) => {
  try {
    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findByPk(decoded.userId);
    if (!user) throw new Error("User not found");

    // 🔥 fetch build types
    const userBuildTypes = await user_build_types.findAll({
      where: { user_id: decoded.userId },
      attributes: ["build_type_id"],
    });

    const buildTypeIds = userBuildTypes.map(bt => bt.build_type_id);

    return {
      user: {
        ...user.toJSON(),
        buildTypeIds, // 👈 nested inside user
      },
      isNewUser: !user.profile_completed,
    };

  } catch (e) {
    throw e;
  }
};

module.exports = {
  startGoogleOAuth,
  googleCallbackHandler,
  getMeHandler,
};