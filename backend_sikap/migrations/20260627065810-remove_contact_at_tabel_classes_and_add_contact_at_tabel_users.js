'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Classes', 'classleader_contact');
    await queryInterface.removeColumn('Classes', 'classteacher_contact');
    await queryInterface.addColumn('Users', 'contact', {
      type: Sequelize.STRING,
      allowNull: true,
      after:'role'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'contact');
    await queryInterface.addColumn('Classes', 'classleader_contact', {
      type: Sequelize.STRING,
      allowNull: true,
      after:'classleader_id'
    });
    await queryInterface.addColumn('Classes', 'classteacher_contact', {
      type: Sequelize.STRING,
      allowNull: true,
      after:'classteacher_id'
    });   
  }
};
