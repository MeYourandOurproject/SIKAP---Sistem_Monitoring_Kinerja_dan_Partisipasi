"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Activitysessions", "start_time", {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.addColumn("Activitysessions", "end_time", {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Activitysessions", "end_time");
    await queryInterface.removeColumn("Activitysessions", "start_time");
  },
};
