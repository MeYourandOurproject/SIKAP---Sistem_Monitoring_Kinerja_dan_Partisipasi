"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "teacher_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: "Teachers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      after: "role",
    });

    await queryInterface.addColumn("Users", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: "contact"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "is_active");
    await queryInterface.removeColumn("Users", "teacher_id");
  },
};
