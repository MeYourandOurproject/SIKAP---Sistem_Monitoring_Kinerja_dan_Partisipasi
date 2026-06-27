'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const rooms = [];
    const buildings = ['A','B','C','D','E','F','G','H'];
    const floors = [1,2];
    // For variety, per-floor room count will be random between 3 and 6
    function randCount() {
      return Math.floor(Math.random() * 4) + 3; // 3..6
    }

    for (const b of buildings) {
      for (const f of floors) {
        const count = randCount();
        for (let i = 1; i <= count; i++) {
          // assign type: ~25% labs, else theory
          const type = Math.random() < 0.25 ? 'lab' : 'theory';
          rooms.push({
            classroom_name: `${b}${f}.${i}`,
            classroom_type: type,
            classroom_status: 'available',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('Classrooms', rooms, {});
  },

  async down(queryInterface, Sequelize) {
    // remove classrooms created by this seeder (A1.*, A2.*, ..., H2.*)
    const patterns = [];
    for (const b of ['A','B','C','D','E','F','G','H']) {
      patterns.push({ classroom_name: { [Sequelize.Op.like]: `${b}1.%` } });
      patterns.push({ classroom_name: { [Sequelize.Op.like]: `${b}2.%` } });
    }
    await queryInterface.bulkDelete('Classrooms', { [Sequelize.Op.or]: patterns }, {});
  },
};
