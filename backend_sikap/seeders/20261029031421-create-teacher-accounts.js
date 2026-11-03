
"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    // 1. Ambil seluruh data guru
    const teachers = await queryInterface.sequelize.query(
      "SELECT id, name FROM `Teachers`",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const defaultPassword = "password12345";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    let created = 0;
    let skipped = 0;

    // 2. Proses setiap guru
    for (const teacher of teachers) {
      if (!teacher.name || !teacher.name.trim()) {
        console.log(`Lewati teacher ID ${teacher.id}: nama kosong`);
        skipped++;
        continue;
      }

      // 3. Bersihkan gelar yang umum digunakan
      const cleanName = teacher.name
        .trim()
        .replace(
          /,?\s*\b(S\.?Pd\.?|M\.?Pd\.?|S\.?Kom\.?|M\.?Kom\.?|S\.?T\.?|M\.?T\.?|Dr\.?|Prof\.?)\b/gi,
          ""
        )
        .trim();

      // 4. Buat username dari nama
      const username = cleanName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

      if (!username) {
        console.log(
          `Lewati teacher ID ${teacher.id}: username kosong`
        );
        skipped++;
        continue;
      }

      // 5. Periksa apakah guru atau username sudah memiliki akun
      const existingUsers = await queryInterface.sequelize.query(
        `SELECT id
         FROM \`Users\`
         WHERE username = :username
            OR teacher_id = :teacherId`,
        {
          replacements: {
            username,
            teacherId: teacher.id,
          },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );

      if (existingUsers.length > 0) {
        console.log(`Lewati ${teacher.name}: akun sudah ada`);
        skipped++;
        continue;
      }

      // 6. Buat akun guru
      await queryInterface.bulkInsert("Users", [
        {
          username,
          password: passwordHash,
          name: teacher.name,
          role: "teacher",
          teacher_id: teacher.id,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      console.log(
        `Akun dibuat: ${teacher.name} -> ${username}`
      );

      created++;
    }

    console.log("\n=== HASIL SEEDER ===");
    console.log(`Total guru: ${teachers.length}`);
    console.log(`Akun dibuat: ${created}`);
    console.log(`Dilewati: ${skipped}`);
  },

  async down() {
    console.log(
      "Rollback tidak menghapus akun guru secara otomatis."
    );
  },
};
