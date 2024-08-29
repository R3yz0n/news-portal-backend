'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull:false
        },
        logo_id: {
          type: Sequelize.INTEGER,
          allowNull:false
        },
        slogan: {
          type: Sequelize.STRING,
          allowNull:false
        },
        phone_no: {
          type: Sequelize.STRING,
          allowNull:false
        },
        external_phoneno: {
          type: Sequelize.STRING,
          allowNull:false
        },
        email: {
          type: Sequelize.STRING,
          allowNull:false
        },
        sanchalak: {
          type: Sequelize.STRING,
          allowNull:false
        },
        pradhan_sanchalak: {
          type: Sequelize.STRING,
          allowNull:false
        },
        reporter: {
          type: Sequelize.STRING,
          allowNull:false
        },
        salahakar: {
          type: Sequelize.STRING,
          allowNull:false
        },
        ji_pra_ka_ru_d_no: {
          type: Sequelize.STRING,
          allowNull:false
        },
        media_biva_registration_cretificate_no: {
          type: Sequelize.STRING,
          allowNull:false
        },
        press_council_registration_no: {
          type: Sequelize.STRING,
          allowNull:false
        },
        local_pra_registration_no: {
          type: Sequelize.STRING,
          allowNull:false
        },
        privacypolicy: {
          type: Sequelize.STRING,
          allowNull:false
        },
        company_description: {
          type: Sequelize.STRING,
          allowNull:false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
     
     
     
     
     
     
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('companies');
  }
};