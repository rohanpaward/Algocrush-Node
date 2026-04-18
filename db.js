const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,

    // 🔥 REQUIRED for Supabase
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    // ✅ optional but recommended
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');
  } catch (err) {
    console.error(' Unable to connect to the database:', err);
  }
};

module.exports = { sequelize, Sequelize, testConnection };