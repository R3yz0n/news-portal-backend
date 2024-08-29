'use strict';
const {
  Model, INTEGER
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class socialmedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model) {
      this.belongsTo(model.company,{foreignKey:'company_id',as:'social_media'});
    }
  }
  socialmedia.init({
    name: {
      type:String,
      allowNull:false
    },
    social_media_link: {
      type:String,
      allowNull:false
    },
    company_id: {
      type:INTEGER,
      allowNull:false
    },
    created_at:{
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
      field:'created_at'
    },
    updated_at:{
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
      field:'updated_at',
    }
  }, {
    sequelize,
    modelName: 'socialmedia',
    timestamps: false,
  });
  return socialmedia;
};