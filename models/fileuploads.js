"use strict";
const { Model } = require("sequelize");
const company = require("./company");
const postimage = require("./postimage");
module.exports = (sequelize, DataTypes) => {
  class fileuploads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.company, { foreignKey: "logo_id" });
      this.hasOne(models.user, { foreignKey: "user_profile_id" });
      this.hasOne(models.post, { foreignKey: "featured_image_id" });
      this.hasOne(models.advertises, { foreignKey: "image" });
    }
  }
  fileuploads.init(
    {
      name: {
        type: String,
        allowNull: false,
      },
      size: {
        type: String,
        allowNull: false,
      },
      type: {
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
      modelName: "fileuploads",
      timestamps: false,
    }
  );
  return fileuploads;
};
