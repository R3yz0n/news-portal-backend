'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.socialmedia,{foreignKey:"company_id",as:'social_media'});
      this.belongsTo(models.fileuploads,{foreignKey:'logo_id'});
    }
  }
  company.init({
   
      name: DataTypes.STRING,
      logo_id: DataTypes.INTEGER,
      slogan: DataTypes.STRING,
      phone_no: DataTypes.STRING,
      external_phoneno: DataTypes.STRING,
      email: DataTypes.STRING,
      sanchalak: DataTypes.STRING,
      pradhan_sanchalak: DataTypes.STRING,
      reporter: DataTypes.STRING,
      salahakar: DataTypes.STRING,
      ji_pra_ka_ru_d_no: DataTypes.STRING,  
      media_biva_registration_cretificate_no: DataTypes.STRING,
      press_council_registration_no: DataTypes.STRING,
      local_pra_registration_no: DataTypes.STRING,
      privacypolicy: DataTypes.STRING,
      company_description: DataTypes.STRING,
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
    modelName: 'company',
    timestamps:false,
  });
  return company;
};