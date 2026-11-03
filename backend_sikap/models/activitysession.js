"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activitysession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Activitysession.belongsTo(models.Activity, {
        foreignKey: "activity_id",
        onDelete: "CASCADE",
      });
      Activitysession.belongsTo(models.Teacher, {
        foreignKey: "pic_teacher_id",
      });
      Activitysession.hasMany(models.Activityateacherattendance, {
        foreignKey: "session_id",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Activitysession.init(
    {
      activity_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Activities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      pic_teacher_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Teachers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false,
      },
      academic_year: { type: DataTypes.STRING(9), allowNull: true },
      semester: { type: DataTypes.ENUM("odd", "even"), allowNull: true },
      date: { type: DataTypes.DATEONLY },
      session: {
        type: DataTypes.ENUM("morning", "afternoon", "all_day"),
        allowNull: true,
      },
      start_time: { type: DataTypes.TIME, allowNull: true },
      end_time: { type: DataTypes.TIME, allowNull: true },
      notes: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Activitysession",
    },
  );
  return Activitysession;
};
