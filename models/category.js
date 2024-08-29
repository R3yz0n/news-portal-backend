"use strict";
const { Model } = require("sequelize");
const post = require("./post");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(model) {
      category.hasMany(model.post, { foreignKey: "category_id", as: "post" });
    }
  }
  category.init(
    {
      name: {
        type: String,
        unique: true,
        allowNull: false,
      },
      slug:{
        type: String,
        unique: true,
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
      modelName: "category",
      timestamps: false,
    }
  );
  return category;
};
