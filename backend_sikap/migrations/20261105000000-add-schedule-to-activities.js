"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Activities", "day_of_week", {
      type: Sequelize.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ),
      allowNull: true,
      after: "date",
    });
    await queryInterface.addColumn("Activities", "session", {
      type: Sequelize.ENUM("morning", "afternoon", "all_day"),
      allowNull: true,
      after: "day_of_week",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Activities", "session");
    await queryInterface.removeColumn("Activities", "day_of_week");
  },
};
