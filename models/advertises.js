"use strict";
const { Model, INTEGER, BOOLEAN, DATE, DATEONLY, TEXT } = require("sequelize");
const advertisement = require("./advertisement");
const transation = require("./transation");
module.exports = (sequelize, DataTypes) => {
  class advertises extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // advertises.belongsTo(advertisement,{
      //   foreignKey:'adventisement_id',
      // });
      // advertises.hasMany(transation);
      this.belongsTo(models.fileuploads, { foreignKey: "image" });
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.belongsTo(models.advertisement, { foreignKey: "advertisement_id" });
      this.belongsTo(models.client, { foreignKey: "client_id" });
    }
  }
  advertises.init(
    {
      name: {
        type: String,
        allowNull: false,
      },
      description: {
        type: TEXT,
        allowNull: false,
      },
      advertisement_id: {
        type: INTEGER,
        allowNull: false,
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
      },
      image: {
        type: String,
      },
      start_date: {
        type: DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DATEONLY,
        allowNull: false,
      },
      total_price: {
        type: String,
        allowNull: false,
      },
      status: {
        type: BOOLEAN,
        defaultValue: true,
      },
      discount: {
        type: INTEGER,
      },
      client_id: {
        type: INTEGER,
        allowNull: false,
      },
      where_to_display: {
        type: INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,

        field: "created_at",
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "advertises",
      timestamps: false,
    }
  );
  return advertises;
};
