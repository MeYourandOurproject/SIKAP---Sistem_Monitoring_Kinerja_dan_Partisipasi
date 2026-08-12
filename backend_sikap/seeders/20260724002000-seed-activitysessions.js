"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const activities = await queryInterface.sequelize.query(
      `SELECT id, name FROM Activities WHERE name IN ('Panca Waluya', 'Piket 5S')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const pancaWaluya = activities.find((activity) => activity.name === "Panca Waluya");
    const piket5S = activities.find((activity) => activity.name === "Piket 5S");
    if (!pancaWaluya || !piket5S) return;

    const teachers = await queryInterface.sequelize.query(
      `SELECT id FROM Teachers WHERE status = 'active' ORDER BY id LIMIT 10`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (teachers.length < 10) return;

    const sessions = [
      {
        activity_id: pancaWaluya.id,
        pic_teacher_id: teachers[0].id,
        date: new Date("2026-08-03T06:30:00"),
        session: "morning",
        notes: "Tema: Panca Waluya - Senin. Acara rutin pembukaan pagi dan pembiasaan nilai karakter.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: pancaWaluya.id,
        pic_teacher_id: teachers[1].id,
        date: new Date("2026-08-04T06:30:00"),
        session: "morning",
        notes: "Tema: Panca Waluya - Selasa. Acara rutin penguatan karakter dan doa bersama.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: pancaWaluya.id,
        pic_teacher_id: teachers[2].id,
        date: new Date("2026-08-05T06:30:00"),
        session: "morning",
        notes: "Tema: Panca Waluya - Rabu. Acara rutin motivasi pagi dan nilai kebersamaan.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: pancaWaluya.id,
        pic_teacher_id: teachers[3].id,
        date: new Date("2026-08-06T06:30:00"),
        session: "morning",
        notes: "Tema: Panca Waluya - Kamis. Acara rutin refleksi sikap dan perilaku positif.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: pancaWaluya.id,
        pic_teacher_id: teachers[4].id,
        date: new Date("2026-08-07T06:30:00"),
        session: "morning",
        notes: "Tema: Panca Waluya - Jumat. Acara rutin penutup pekan dan komitmen kebersihan.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piket5S.id,
        pic_teacher_id: teachers[5].id,
        date: new Date("2026-08-03T06:30:00"),
        session: "morning",
        notes: "Piket 5S Senin - guru bertugas menjaga kebersihan dan kerapian lingkungan.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piket5S.id,
        pic_teacher_id: teachers[6].id,
        date: new Date("2026-08-04T06:30:00"),
        session: "morning",
        notes: "Piket 5S Selasa - guru bertugas menjaga kebersihan dan ketertiban area sekolah.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piket5S.id,
        pic_teacher_id: teachers[7].id,
        date: new Date("2026-08-05T06:30:00"),
        session: "morning",
        notes: "Piket 5S Rabu - guru bertugas menjaga kebersihan ruang kelas dan lingkungan.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piket5S.id,
        pic_teacher_id: teachers[8].id,
        date: new Date("2026-08-06T06:30:00"),
        session: "morning",
        notes: "Piket 5S Kamis - guru bertugas menata area sekolah dan memastikan 5S diterapkan.",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: piket5S.id,
        pic_teacher_id: teachers[9].id,
        date: new Date("2026-08-07T06:30:00"),
        session: "morning",
        notes: "Piket 5S Jumat - guru bertugas menjaga kebersihan akhir pekan dan laporan piket.",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Activitysessions", sessions, {});
  },

  async down(queryInterface, Sequelize) {
    const activities = await queryInterface.sequelize.query(
      `SELECT id, name FROM Activities WHERE name IN ('Panca Waluya', 'Piket 5S')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const activityIds = activities.map((activity) => activity.id);
    if (activityIds.length === 0) return;

    await queryInterface.bulkDelete(
      "Activitysessions",
      { activity_id: activityIds },
      {}
    );
  },
};
