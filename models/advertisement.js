'use strict';
const {
  Model, INTEGER
} = require('sequelize');
const advertises = require('./advertises');
module.exports = (sequelize, DataTypes) => {
  class advertisement extends Model {
    
    static associate(models) {
      // advertisement.hasMany(advertises);
      this.hasMany(models.advertises, { foreignKey: "advertisement_id" });
    }
  }
  advertisement.init({
    type: {
      type:String,
      allowNull:false,
      unique:true
    },
    rate: {
      type:INTEGER,
      allowNull:false,
    },
    max_count:{
      type:INTEGER,
    },
    created_at:{
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field:'created_at',
      allowNull:false
    },
    updated_at:{
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field:'updated_at',
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'advertisement',
    timestamps: false,
  });
  return advertisement;
};