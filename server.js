require('dotenv').config();
const Hapi = require('@hapi/hapi');
const { sequelize, testConnection } = require('./db');
const routes = require('./src/router');
const { initSocket, initChatSocket, initSocketHandlers } = require('./src/sockets');
const registerAuthPlugin = require("./src/plugin/auth.plugin")

const init = async () => {
  try {
    const hapiServer = Hapi.server({
      port: process.env.PORT || 3001,
      host: '0.0.0.0',
      routes: {
        cors: {
          origin:[
            "http://localhost:3000",
            "http://localhost:5173",
            "https://algocrush-frontend.onrender.com"
            ],
          credentials: true,
        },
      },
    });

    await testConnection();

    //  1. REGISTER COOKIE PLUGIN
    await hapiServer.register(require('@hapi/cookie'));
    await registerAuthPlugin(hapiServer);

    // ✅ 2. DEFINE SESSION STRATEGY
    hapiServer.auth.strategy('session', 'cookie', {
      cookie: {
        name: 'oauth-session',
        password: process.env.COOKIE_PASSWORD,
        isSecure: true, // ⚠️ true in production (HTTPS)
        isSameSite: "None", // ✅ Change from "Lax" to "None"
      },
      redirectTo: false,
    });

    // ✅ 3. SET DEFAULT AUTH (optional but good)
    hapiServer.auth.default('session');

    // ✅ 4. REGISTER ROUTES AFTER AUTH SETUP
    hapiServer.route(routes);

    await hapiServer.start();
    initSocket(hapiServer.listener)
    initSocketHandlers()
    console.log(`Server running at: ${hapiServer.info.uri}`);
  } catch (err) {
    console.error(' Startup error:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});

init();