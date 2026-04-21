/* eslint-disable comma-dangle */
/* eslint-disable camelcase */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const users = require('./users');
const build_types = require('./build_types');

const user_build_types = sequelize.define(
  'user_build_types',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },

    build_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'build_types',
        key: 'id',
      },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'user_build_types',
    timestamps: false,

    // 🔥 prevent duplicate mappings
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'build_type_id'],
      },
    ],
  }
);


// =========================
// 🔥 ASSOCIATIONS (FINAL)
// =========================

// Mapping → User
user_build_types.belongsTo(users, {
  foreignKey: 'user_id',
});

// Mapping → BuildType
user_build_types.belongsTo(build_types, {
  foreignKey: 'build_type_id',
});

// User → Mapping
users.hasMany(user_build_types, {
  foreignKey: 'user_id',
});

// BuildType → Mapping
build_types.hasMany(user_build_types, {
  foreignKey: 'build_type_id',
});


module.exports = user_build_types;