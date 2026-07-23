'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Activities', 'target_type', {
      type: Sequelize.ENUM('all_teachers', 'assigned_teachers'),
      allowNull: false,
      defaultValue: 'all_teachers',
      after: 'description' // specify the column after which the new column should be added,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Activities', 'target_type');
  }
};
