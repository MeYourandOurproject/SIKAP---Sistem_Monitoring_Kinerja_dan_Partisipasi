"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "Activitycancellations";
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
        activity_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "Activities", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        session: {
          type: Sequelize.ENUM("morning", "afternoon", "all_day"),
          allowNull: false,
        },
        reason: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        cancelled_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "Users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
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
    if (
      !indexes.some(
        (index) => index.name === "activity_cancellations_schedule_unique",
      )
    ) {
      await queryInterface.addIndex(
        tableName,
        ["activity_id", "date", "session"],
        {
          unique: true,
          name: "activity_cancellations_schedule_unique",
        },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Activitycancellations");
  },
};
