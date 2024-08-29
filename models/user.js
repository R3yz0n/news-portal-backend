"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.belongsTo(models.fileuploads, { foreignKey: "user_profile_id" });
      this.hasMany(models.post, { foreignKey: "user_id" });
      this.hasMany(models.advertises, { foreignKey: "user_id" });
    }
  }
  user.init(
    {
      fullname: {
        type: String,
        allowNull: false,
      },
      username: {
        type: String,
        allowNull: false,
        unique: true,
      },
      password: {
        type: String,
        allowNull: false,
      },
      address: {
        type: String,
        allowNull: false,
      },
      phone_no: {
        type: String,
        allowNull: false,
        unique: true,
      },
      gender: {
        type: String,
        allowNull: false,
      },
      user_profile_id: {
        type: INTEGER,
        allowNull: false,
      },
      role: {
        type: String,
        allowNull: false,
      },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
        field: "created_at",
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "user",
      timestamps: false,
    }
  );
  return user;
};
