"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Classagendas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      classschedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Classschedules", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Classes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Teachers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      agenda_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      activity_status: {
        type: Sequelize.ENUM("teaching", "assignment", "empty"),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(
      "Classagendas",
      ["classschedule_id", "agenda_date"],
      { unique: true, name: "class_agendas_schedule_date_unique" },
    );
    await queryInterface.addIndex(
      "Classagendas",
      ["class_id", "agenda_date"],
      { name: "class_agendas_class_date" },
    );
    await queryInterface.addIndex(
      "Classagendas",
      ["teacher_id", "agenda_date"],
      { name: "class_agendas_teacher_date" },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Classagendas");
  },
};
