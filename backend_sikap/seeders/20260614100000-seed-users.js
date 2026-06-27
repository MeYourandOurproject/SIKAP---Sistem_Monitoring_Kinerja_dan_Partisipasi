"use strict";
const bcrypt = require("bcrypt");

function generateRandomName(index) {
  const firstNames = [
    "Alya",
    "Bima",
    "Citra",
    "Dina",
    "Eka",
    "Fajar",
    "Gita",
    "Hadi",
    "Indra",
    "Jihan",
    "Karina",
    "Lukas",
    "Maya",
    "Nisa",
    "Oki",
    "Putri",
    "Qori",
    "Rafi",
    "Sari",
    "Tito",
    "Uli",
    "Vina",
    "Wawan",
    "Xena",
    "Yudha",
    "Zahara",
  ];
  const lastNames = [
    "Santoso",
    "Pratama",
    "Cahyadi",
    "Wijaya",
    "Putra",
    "Nur",
    "Hidayat",
    "Saputra",
    "Ramadhan",
    "Halim",
  ];
  const first = firstNames[index % firstNames.length];
  const last = lastNames[index % lastNames.length];
  return `${first} ${last}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const passwordHash = bcrypt.hashSync("123", 10);
    const students = [
      { username: "admin", name: "Ruly Abdul Rasyid", role: "admin" },
      {
        username: "kepsek",
        name: "Yudi Kartiwa, S.Pd., MT.",
        role: "headmaster",
      },
      {
        username: "wakasek_kurikulum",
        name: "Yuyun Yuniarsih",
        role: "responsible",
      },
    ];

    const nonameUsers = [
      "km_xdkv1",
      "km_xdkv2",
      "km_xpplg1",
      "km_xpplg2",
      "km_xpplg3",
      "km_xtelk1",
      "km_xtelk2",
      "km_xtelk3",
      "km_xtelk4",
      "km_xtelk5",
      "km_xtelk6",
      "km_xtjkt1",
      "km_xtjkt2",
      "km_xtktl1",
      "km_xtktl2",
      "km_xtktl3",
      "km_xidkv1",
      "km_xidkv2",
      "km_xirpl1",
      "km_xirpl2",
      "km_xirpl3",
      "km_xitav1",
      "km_xitav2",
      "km_xitav3",
      "km_xititl1",
      "km_xititl2",
      "km_xititl3",
      "km_xitkj1",
      "km_xitkj2",
      "km_xitoi1",
      "km_xitoi2",
      "km_xitoi3",
      "km_xiidkv1",
      "km_xiidkv2",
      "km_xiirpl1",
      "km_xiirpl2",
      "km_xiirpl3",
      "km_xiitav1",
      "km_xiitav2",
      "km_xiitav3",
      "km_xiititl1",
      "km_xiititl2",
      "km_xiititl3",
      "km_xiitkj1",
      "km_xiitkj2",
      "km_xiitoi1",
      "km_xiitoi2",
    ];

    const nonameEntries = nonameUsers.map((username, index) => ({
      username,
      password: passwordHash,
      name: generateRandomName(index),
      role: "student",
      createdAt: now,
      updatedAt: now,
    }));

    const users = [
      ...students.map((user) => ({
        ...user,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      })),
      ...nonameEntries,
    ];

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      {
        username: [
          "admin",
          "kepsek",
          "wakasek_kurikulum",
          "km_xdkv1",
          "km_xdkv2",
          "km_xpplg1",
          "km_xpplg2",
          "km_xpplg3",
          "km_xtelk1",
          "km_xtelk2",
          "km_xtelk3",
          "km_xtelk4",
          "km_xtelk5",
          "km_xtelk6",
          "km_xtjkt1",
          "km_xtjkt2",
          "km_xtktl1",
          "km_xtktl2",
          "km_xtktl3",
          "km_xidkv1",
          "km_xidkv2",
          "km_xirpl1",
          "km_xirpl2",
          "km_xirpl3",
          "km_xitav1",
          "km_xitav2",
          "km_xitav3",
          "km_xititl1",
          "km_xititl2",
          "km_xititl3",
          "km_xitkj1",
          "km_xitkj2",
          "km_xitoi1",
          "km_xitoi2",
          "km_xitoi3",
          "km_xiidkv1",
          "km_xiidkv2",
          "km_xiirpl1",
          "km_xiirpl2",
          "km_xiirpl3",
          "km_xiitav1",
          "km_xiitav2",
          "km_xiitav3",
          "km_xiititl1",
          "km_xiititl2",
          "km_xiititl3",
          "km_xiitkj1",
          "km_xiitkj2",
          "km_xiitoi1",
          "km_xiitoi2",
        ],
      },
      {},
    );
  },
};
