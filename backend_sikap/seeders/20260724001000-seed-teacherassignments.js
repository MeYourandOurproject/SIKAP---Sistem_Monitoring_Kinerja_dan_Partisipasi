"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const activities = await queryInterface.sequelize.query(
      `SELECT id, name FROM Activities WHERE name = 'Piket 5S'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const piketActivity = activities[0];
    if (!piketActivity) return;

    const teachers = await queryInterface.sequelize.query(
      `SELECT id FROM Teachers WHERE status = 'active' ORDER BY id LIMIT 5`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (teachers.length < 5) return;

    const teacherAssignments = [
      {
        activity_id: piketActivity.id,
        teacher_id: teachers[0].id,
        semester: "odd",
        day_of_week: "Monday",
        session: "morning",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piketActivity.id,
        teacher_id: teachers[1].id,
        semester: "even",
        day_of_week: "Tuesday",
        session: "morning",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piketActivity.id,
        teacher_id: teachers[2].id,
        semester: "odd",
        day_of_week: "Wednesday",
        session: "morning",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piketActivity.id,
        teacher_id: teachers[3].id,
        semester: "even",
        day_of_week: "Thursday",
        session: "morning",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piketActivity.id,
        teacher_id: teachers[4].id,
        semester: "odd",
        day_of_week: "Friday",
        session: "morning",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Teacherassignments", teacherAssignments, {});
  },

  async down(queryInterface, Sequelize) {
    const activities = await queryInterface.sequelize.query(
      `SELECT id FROM Activities WHERE name = 'Piket 5S'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const piketActivity = activities[0];
    if (!piketActivity) return;

    await queryInterface.bulkDelete(
      "Teacherassignments",
      { activity_id: piketActivity.id },
      {}
    );
  },
};
