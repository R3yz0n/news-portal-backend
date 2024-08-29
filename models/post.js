"use strict";
const { Model, INTEGER, STRING, TEXT } = require("sequelize");
const category = require("./category");
const fileuploads = require("./fileuploads");
const postimage = require("./postimage");
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.category, {
        foreignKey: "category_id",
      });
      this.belongsTo(models.fileuploads, {
        foreignKey: "featured_image_id",
        as: "featured_image",
      });
      this.belongsTo(models.user, { foreignKey: "user_id" });
      // this.belongsTo(models.user, { foreignKey: "author", as: "author_name" });
    }
  }
  post.init(
    {
      title: {
        type: String,
        allowNull: false,
      },
      body: {
        type: TEXT,
        allowNull: false,
      },
      author: {
        type: String,
        allowNull: false,
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
      },
      status: {
        type: String,
        allowNull: false,
      },
      category_id: {
        type: INTEGER,
        allowNull: false,
      },
      featured_image_id: {
        type: INTEGER,
        allowNull: false,
      },
      is_mukhya_samachar: {
        type: Boolean,
        allowNull: false,
        defaultValue: false,
      },
      priority: {
        type: INTEGER,
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
      modelName: "post",
      timestamps: false,
    }
  );
  return post;
};
