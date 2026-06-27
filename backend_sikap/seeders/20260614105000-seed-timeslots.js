"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const timeslots = [
      ["regular", "1", "07:00", "07:40"],
      ["regular", "2", "07:40", "08:20"],
      ["regular", "3", "08:20", "09:00"],
      ["regular", "4", "09:00", "09:40"],
      ["regular", "Break 1", "09:40", "09:55"],
      ["regular", "5", "09:55", "10:35"],
      ["regular", "6", "10:35", "11:15"],
      ["regular", "7", "11:15", "11:55"],
      ["regular", "Break 2", "11:45", "12:30"],
      ["regular", "8", "12:30", "13:10"],
      ["regular", "9", "13:10", "13:50"],
      ["regular", "10", "13:50", "14:30"],
      ["regular", "11", "14:30", "15:10"],
      ["friday", "1", "07:00", "07:40"],
      ["friday", "2", "07:40", "08:20"],
      ["friday", "3", "08:20", "09:00"],
      ["friday", "4", "09:00", "09:40"],
      ["friday", "Break 1", "09:40", "09:55"],
      ["friday", "5", "09:55", "10:35"],
      ["friday", "6", "10:35", "11:15"],
    ].map(([schema, jp, start, end]) => ({
      schema,
      jp,
      start,
      end,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Timeslots", timeslots, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Timeslots", null, {});
  },
};
