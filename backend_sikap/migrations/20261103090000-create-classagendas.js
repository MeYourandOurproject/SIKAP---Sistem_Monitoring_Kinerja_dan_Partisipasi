"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "Classagendas";
    const tables = await queryInterface.showAllTables();
    const tableExists = tables.some((table) => {
      const name = typeof table === "string" ? table : table.tableName;
      return name?.toLowerCase() === tableName.toLowerCase();
    });

    if (!tableExists) {
      await queryInterface.createTable(tableName, {
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
    }

    const indexes = await queryInterface.showIndex(tableName);
    const indexDefinitions = [
      {
        name: "class_agendas_schedule_date_unique",
        fields: ["classschedule_id", "agenda_date"],
        unique: true,
      },
      {
        name: "class_agendas_class_date",
        fields: ["class_id", "agenda_date"],
      },
      {
        name: "class_agendas_teacher_date",
        fields: ["teacher_id", "agenda_date"],
      },
    ];
    for (const index of indexDefinitions) {
      if (!indexes.some((existing) => existing.name === index.name)) {
        await queryInterface.addIndex(tableName, index.fields, {
          name: index.name,
          ...(index.unique ? { unique: true } : {}),
        });
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Classagendas");
  },
};
