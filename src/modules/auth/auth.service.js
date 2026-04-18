const arctic = require("arctic");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth_providers = require("../../schema/auth_providers");
const Users = require("../../schema/users");
const statuses = require("../../schema/statuses");

const google = new arctic.Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// ==============================
// START OAUTH
// ==============================
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

// ==============================
// CALLBACK
// ==============================
const googleCallbackHandler = async (req, h) => {
  try {
    const { code, state } = req.query;

    const session = req.state["oauth-session"];

    if (!session || state !== session.state) {
      return h.response("Invalid state").code(400);
    }

    // 🔥 Exchange code
    const tokens = await google.validateAuthorizationCode(
      code,
      session.codeVerifier
    );

    const accessToken = tokens.accessToken();

    // 🔥 Fetch Google user
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const googleUser = await response.json();

    // ==============================
    // ✅ CLEAN DB LOGIC
    // ==============================

    // 1️⃣ Find auth provider
    let authProvider = await auth_providers.findOne({
      where: {
        provider: "google",
        provider_user_id: googleUser.id,
      },
    });
    
    let user;
    
    if (authProvider && authProvider.user_id) {
      // ✅ valid existing user
      user = await Users.findByPk(authProvider.user_id);
    }
    
    const status = await statuses.findOne({
      where:{
        name:"active"
      }
    })

    // 🔥 HANDLE BROKEN / FIRST TIME CASE
    if (!user) {
      // create user
      user = await Users.create({
        email: googleUser.email,
        profile_photo_url: googleUser.picture,
        profile_completed: false,
        status_id: status.id,
      });
    
      if (authProvider) {
        // 🔥 FIX existing row
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

    // ==============================
    // ✅ CREATE JWT
    // ==============================

    const token = jwt.sign(
      {
        userId: user.id,
        profileCompleted: user.profile_completed,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return h
      // .redirect("http://localhost:5173/oauth-success")
      // .redirect("https://algocrush-frontend.onrender.com/oauth-success")
      .redirect(`https://algocrush-frontend.onrender.com/oauth-success?token=${token}`)
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

// ==============================
// GET ME
// ==============================
const getMeHandler = async (token) => {
  try {
    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findByPk(decoded.userId);

    if (!user) throw new Error("User not found");

    return {
      user,
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