'use strict';

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\b(s\.p\.d|drs|dr|s\.s|s\.pd|m\.pd|m\.si|m\.kom|m\.t|m\.p\.d|m\.pd|m\.t|s\.t)\b/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Insert master activities
    const activities = [
      { name: 'Pancawaluya', type: 'routine', target_type: 'all_teachers', createdAt: now, updatedAt: now },
      { name: 'Piket KBM', type: 'routine', target_type: 'assigned_teachers', createdAt: now, updatedAt: now },
      { name: 'Piket 5S', type: 'routine', target_type: 'assigned_teachers', createdAt: now, updatedAt: now },
      { name: 'Rapat Dinas', type: 'tentative', target_type: 'assigned_teachers', createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert('Activities', activities, {});

    const [activityRows] = await queryInterface.sequelize.query(
      "SELECT id, name FROM Activities WHERE name IN ('Pancawaluya', 'Piket KBM', 'Piket 5S', 'Rapat Dinas')"
    );

    const activityByName = activityRows.reduce((acc, row) => {
      acc[row.name] = row.id;
      return acc;
    }, {});

    // 2. Load existing teachers from DB for name matching
    const [teacherRows] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Teachers WHERE status = "active" OR status = "inactive"'
    );

    const teacherByNormalizedName = teacherRows.reduce((acc, row) => {
      acc[normalizeName(row.name)] = row.id;
      return acc;
    }, {});

    // 3. Define assignment rows from PDF schedule.
    //    Ganti baris contoh di bawah ini dengan data nyata dari PDF.
    const assignmentData = [
      // Contoh:
      // {
      //   teacher_name: 'Dra Rita Yuliati',
      //   activity_name: 'Piket KBM',
      //   semester: 'odd',
      //   day_of_week: 'Monday',
      //   session: 'morning',
      // },
    ];

    if (assignmentData.length === 0) {
      throw new Error('Tidak ada data assignment. Isi `assignmentData` dengan jadwal dari PDF.');
    }

    const assignments = assignmentData.map(item => {
      const teacherId = teacherByNormalizedName[normalizeName(item.teacher_name)];
      if (!teacherId) {
        throw new Error(`Nama guru tidak ditemukan di tabel Teachers: ${item.teacher_name}`);
      }

      const activityId = activityByName[item.activity_name];
      if (!activityId) {
        throw new Error(`Nama activity tidak valid: ${item.activity_name}`);
      }

      return {
        activity_id: activityId,
        teacher_id: teacherId,
        semester: item.semester,
        day_of_week: item.day_of_week,
        session: item.session,
        createdAt: now,
        updatedAt: now,
      };
    });

    await queryInterface.bulkInsert('Teacherassignments', assignments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teacherassignments', {
      activity_id: Sequelize.literal(`(
        SELECT id FROM Activities WHERE name IN ('Piket KBM', 'Piket 5S')
      )`),
    }, {});

    await queryInterface.bulkDelete('Activities', {
      name: {
        [Sequelize.Op.in]: ['Pancawaluya', 'Piket KBM', 'Piket 5S', 'Rapat Dinas'],
      },
    }, {});
  },
};
