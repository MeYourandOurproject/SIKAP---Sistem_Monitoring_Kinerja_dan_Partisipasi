"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Classagenda extends Model {
    static associate(models) {
      Classagenda.belongsTo(models.Classschedule, {
        foreignKey: "classschedule_id",
        as: "schedule",
      });
      Classagenda.belongsTo(models.Class, {
        foreignKey: "class_id",
        as: "class",
      });
      Classagenda.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
        as: "teacher",
      });
    }
  }

  Classagenda.init(
    {
      classschedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Classschedules", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Classes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Teachers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      agenda_date: { type: DataTypes.DATEONLY, allowNull: false },
      activity_status: {
        type: DataTypes.ENUM("teaching", "assignment", "empty"),
        allowNull: false,
      },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Classagenda",
      indexes: [
        {
          unique: true,
          fields: ["classschedule_id", "agenda_date"],
          name: "class_agendas_schedule_date_unique",
        },
        { fields: ["class_id", "agenda_date"], name: "class_agendas_class_date" },
        { fields: ["teacher_id", "agenda_date"], name: "class_agendas_teacher_date" },
      ],
    },
  );

  return Classagenda;
};
