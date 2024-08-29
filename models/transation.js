"use strict";
const { Model, INTEGER } = require("sequelize");
const client = require("./client");
const advertises = require("./advertises");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.client, { foreignKey: "client_id" });
    }
  }
  transaction.init(
    {
      client_id: {
        type: INTEGER,
        allowNull: false,
      },
      paid: {
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
      modelName: "transaction",
      timestamps: false,
    }
  );
  return transaction;
};
