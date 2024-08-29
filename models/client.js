"use strict";
const { Model, INTEGER } = require("sequelize");
const transation = require("./transation");
module.exports = (sequelize, DataTypes) => {
  class client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.advertises, { foreignKey: "client_id" });
      this.hasMany(models.transaction, { foreignKey: "client_id" });
    }
  }
  client.init(
    {
      name: {
        type: String,
        allowNull: false,
      },
      phone_no: {
        type: String,
        unique: true,
        require: true,
        allowNull: false,
      },
      address: DataTypes.STRING,
      total: {
        type: INTEGER,
        defaultValue: 0,
      },
      total_transaction: {
        type: INTEGER,
        defaultValue: 0,
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
      modelName: "client",
      timestamps: false,
    }
  );
  return client;
};
