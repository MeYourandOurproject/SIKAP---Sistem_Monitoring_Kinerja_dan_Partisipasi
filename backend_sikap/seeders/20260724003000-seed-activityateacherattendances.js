"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const sessions = await queryInterface.sequelize.query(
      `SELECT asess.id, asess.pic_teacher_id FROM Activitysessions asess
       JOIN Activities a ON a.id = asess.activity_id
       WHERE a.name IN ('Panca Waluya', 'Piket 5S')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (sessions.length === 0) return;

    const attendances = sessions.map((session) => ({
      session_id: session.id,
      teacher_id: session.pic_teacher_id,
      status: "present",
      notes: "Guru hadir sebagai PIC kegiatan.",
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Activityateacherattendances", attendances, {});
  },

  async down(queryInterface, Sequelize) {
    const sessions = await queryInterface.sequelize.query(
      `SELECT asess.id FROM Activitysessions asess
       JOIN Activities a ON a.id = asess.activity_id
       WHERE a.name IN ('Panca Waluya', 'Piket 5S')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const sessionIds = sessions.map((session) => session.id);
    if (sessionIds.length === 0) return;

    await queryInterface.bulkDelete(
      "Activityateacherattendances",
      { session_id: sessionIds },
      {}
    );
  },
};
