"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Activities", "start_time", {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.addColumn("Activities", "end_time", {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Activities", "end_time");
    await queryInterface.removeColumn("Activities", "start_time");
  },
};
