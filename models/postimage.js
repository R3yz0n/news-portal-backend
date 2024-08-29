'use strict';
const {
  Model, INTEGER
} = require('sequelize');
const fileuploads = require('./fileuploads');
module.exports = (sequelize, DataTypes) => {
  class postimage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   postimage.belongsTo(post,{
    //     foreignKey:'post_image_id',
    //   });
    //  postimage.belongsToMany()
    }
  }
  postimage.init({
    post_id: {
      type:INTEGER,
      allowNull:false
    },
    post_image_id: {
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
    modelName: 'postimage',
  });
  return postimage;
};