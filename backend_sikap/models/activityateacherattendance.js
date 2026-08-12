"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activityateacherattendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Activityateacherattendance.belongsTo(models.Activitysession, {
        foreignKey: "session_id",
      });
      Activityateacherattendance.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
      });
    }
  }
  Activityateacherattendance.init(
    {
      session_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Activitysessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Teachers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "sick", "permission"),
        allowNull: true,
      },
      notes: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Activityateacherattendance",
    },
  );
  return Activityateacherattendance;
};
