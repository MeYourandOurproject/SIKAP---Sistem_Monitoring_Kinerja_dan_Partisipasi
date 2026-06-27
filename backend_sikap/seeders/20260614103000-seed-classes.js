"use strict";

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const teachers = await queryInterface.sequelize.query(
      `SELECT id, name FROM Teachers`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    const teacherMap = teachers.reduce((map, teacher) => {
      map[normalizeName(teacher.name)] = teacher.id;
      return map;
    }, {});

    const findTeacherId = (teacherName) => {
      const normalized = normalizeName(teacherName);
      const exact = teacherMap[normalized];
      if (exact) return exact;

      const found = teachers.find((teacher) => {
        const normalizedTeacher = normalizeName(teacher.name);
        return (
          normalizedTeacher.includes(normalized) ||
          normalized.includes(normalizedTeacher)
        );
      });
      if (found) return found.id;

      const randomTeacher =
        teachers[Math.floor(Math.random() * teachers.length)];
      return randomTeacher ? randomTeacher.id : null;
    };

    const classes = [
      ["X DKV 1", "Desain Komunikasi Visual", 10, "Cucu Nursutani", 37],
      ["X DKV 2", "Desain Komunikasi Visual", 10, "Lasri Insani Kamilah", 38],
      [
        "X PPLG 1",
        "Pengembangan Perangkat Lunak dan Gim",
        10,
        "Tanti Kurniawati",
        39,
      ],
      [
        "X PPLG 2",
        "Pengembangan Perangkat Lunak dan Gim",
        10,
        "Muhammad Ryandi Adnan",
        40,
      ],
      [
        "X PPLG 3",
        "Pengembangan Perangkat Lunak dan Gim",
        10,
        "Mochamad Zafar Sidiq",
        39,
      ],
      ["X TELK 1", "Teknik Elektronika", 10, "Riza Triana", 39],
      ["X TELK 2", "Teknik Elektronika", 10, "Alis Lisnawati", 40],
      ["X TELK 3", "Teknik Elektronika", 10, "Yuyun Yunani", 41],
      ["X TELK 4", "Teknik Elektronika", 10, "Mochamad Fajar Firmansyah", 41],
      ["X TELK 5", "Teknik Elektronika", 10, "Leni Suherti Meilani", 40],
      ["X TELK 6", "Teknik Elektronika", 10, "Wulida Khoerunnisa", 40],
      [
        "X TJKT 1",
        "Teknik Jaringan Komputer dan Telekomunikasi",
        10,
        "Niken Alifya Dewi",
        39,
      ],
      [
        "X TJKT 2",
        "Teknik Jaringan Komputer dan Telekomunikasi",
        10,
        "Septiana Sulistyawati",
        38,
      ],
      ["X TKTL 1", "Teknik Ketenagalistrikan", 10, "Nina Mariyana", 42],
      ["X TKTL 2", "Teknik Ketenagalistrikan", 10, "Tuty Farihala", 38],
      ["X TKTL 3", "Teknik Ketenagalistrikan", 10, "Annisa Meilia Prayoga", 40],
      ["XI DKV 1", "Desain Komunikasi Visual", 11, "Reni Ratnaningsih", 35],
      ["XI DKV 2", "Desain Komunikasi Visual", 11, "Ivan Irianto", 36],
      ["XI RPL 1", "Rekayasa Perangkat Lunak", 11, "Hani Andiyani", 35],
      ["XI RPL 2", "Rekayasa Perangkat Lunak", 11, "Rima Ratna Puri", 36],
      ["XI RPL 3", "Rekayasa Perangkat Lunak", 11, "Asep Dada Wahyudin", 36],
      ["XI TAV 1", "Teknik Audio Video", 11, "Imas Rahayu", 31],
      ["XI TAV 2", "Teknik Audio Video", 11, "Diki Hidayat", 36],
      ["XI TAV 3", "Teknik Audio Video", 11, "Solihing Dzuldin", 33],
      [
        "XI TITL 1",
        "Teknik Instalasi Tenaga Listrik",
        11,
        "Raden Nurul Komala Canra",
        34,
      ],
      [
        "XI TITL 2",
        "Teknik Instalasi Tenaga Listrik",
        11,
        "Ruly Abdul Rasyid",
        32,
      ],
      ["XI TITL 3", "Teknik Instalasi Tenaga Listrik", 11, "Amalia Utami", 33],
      [
        "XI TKJ 1",
        "Teknik Komputer dan Jaringan",
        11,
        "Nurulhayat Rachim Diefa",
        36,
      ],
      ["XI TKJ 2", "Teknik Komputer dan Jaringan", 11, "Taopik Sidqi", 36],
      ["XI TOI 1", "Teknik Otomasi Industri", 11, "Susneti Martiani", 34],
      ["XI TOI 2", "Teknik Otomasi Industri", 11, "Dudin Wahyudin", 33],
      ["XI TOI 3", "Teknik Otomasi Industri", 11, "Rizal Firdaus", 35],
      ["XII DKV 1", "Desain Komunikasi Visual", 12, "Tinceu Rosida", 34],
      ["XII DKV 2", "Desain Komunikasi Visual", 12, "Bahar Nugraha Pradja", 34],
      ["XII RPL 1", "Rekayasa Perangkat Lunak", 12, "Entin Supriatin", 36],
      [
        "XII RPL 2",
        "Rekayasa Perangkat Lunak",
        12,
        "Neneng Wahdatul Fitriyah",
        36,
      ],
      ["XII RPL 3", "Rekayasa Perangkat Lunak", 12, "Rina Pujiati", 33],
      ["XII TAV 1", "Teknik Audio Video", 12, "Agus Sugiarto Sumarno", 33],
      ["XII TAV 2", "Teknik Audio Video", 12, "Fajar Dewi Ningsih", 33],
      ["XII TAV 3", "Teknik Audio Video", 12, "Kusmoro Rusli", 34],
      [
        "XII TITL 1",
        "Teknik Instalasi Tenaga Listrik",
        12,
        "Usi Nurazizah",
        35,
      ],
      ["XII TITL 2", "Teknik Instalasi Tenaga Listrik", 12, "Shela Rewata", 35],
      [
        "XII TITL 3",
        "Teknik Instalasi Tenaga Listrik",
        12,
        "Maria Hani Fitriani",
        34,
      ],
      [
        "XII TKJ 1",
        "Teknik Komputer dan Jaringan",
        12,
        "Lulu Riszeki Yuliani",
        34,
      ],
      ["XII TKJ 2", "Teknik Komputer dan Jaringan", 12, "Leni Nur Afni", 33],
      ["XII TOI 1", "Teknik Otomasi Industri", 12, "Lilis Hamidah", 35],
      ["XII TOI 2", "Teknik Otomasi Industri", 12, "Ina Suratma", 36],
    ].map(([class_name, major, level, teacherName, total_student], index) => ({
      class_name,
      major,
      level,

      // Ketua kelas (User id 4 - 50)
      classleader_id: index + 4,
      classleader_contact: "08770892304",

      // Wali kelas
      classteacher_id: findTeacherId(teacherName),
      classteacher_contact: "08770892304",

      total_student,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Classes", classes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Classes", null, {});
  },
};
