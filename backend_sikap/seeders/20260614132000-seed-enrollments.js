'use strict';

function normalizeClassName(name) {
  return name
    .toString()
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function parseClassNameFromUsername(username) {
  const normalized = username.toLowerCase();
  const match = normalized.match(/^km_(x(?:i{0,2}))([a-z]+)(\d)$/);
  if (!match) return null;

  const [, romanPart, subjectCode, roomNumber] = match;
  const grade = romanPart.toUpperCase();
  const className = `${grade} ${subjectCode.toUpperCase()} ${roomNumber}`;
  return normalizeClassName(className);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id, username FROM Users WHERE username LIKE 'km_%'`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    const classes = await queryInterface.sequelize.query(
      `SELECT id, class_name FROM Classes`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    const classMap = classes.reduce((map, cls) => {
      map[normalizeClassName(cls.class_name)] = cls.id;
      return map;
    }, {});

    const rows = [];
    const now = new Date();

    for (const user of users) {
      const className = parseClassNameFromUsername(user.username);
      if (!className) continue;
      const classId = classMap[className];
      if (!classId) continue;
      rows.push({
        user_id: user.id,
        class_id: classId,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (rows.length === 0) {
      throw new Error('No enrollments generated: class mapping failed or no km_ users found.');
    }

    await queryInterface.bulkInsert('Enrollments', rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Enrollments',
      {
        user_id: queryInterface.sequelize.literal(
          `(SELECT id FROM Users WHERE username LIKE 'km_%')`,
        ),
      },
      {},
    );
  },
};
