"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      await queryInterface.bulkInsert(
        "companies",
        [
          {
            name: "Khurak Media Pvt. Ltd.",
            logo_id: 1,
            slogan: "Media company",
            phone_no: "9876543210",
            external_phoneno: "9876543210",
            email: "KhurakMedia@gmail.com",
            sanchalak: "Khurak Media",
            reporter: "Khurak Media",
            salahakar: "Khurak Media",
            privacypolicy: "Khurak Media",
            ji_pra_ka_ru_d_no: "1234567",
            media_biva_registration_cretificate_no: "1234567",
            press_council_registration_no: "1234567",
            local_pra_registration_no: "1234567",
            company_description: "Khurak Media",
            pradhan_sanchalak: "Khurak Media",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
