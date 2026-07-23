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
      Activitysession.belongsTo(models.Activity, { foreignKey: "activity_id" });
      Activitysession.belongsTo(models.Teacher, {
        foreignKey: "pic_teacher_id",
      });
      Activitysession.hasMany(models.Activityateacherattendance, {
        foreignKey: "session_id",
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
        onDelete: "RESTRICT",
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
      date: { type: DataTypes.DATE },
      session: {
        type: DataTypes.ENUM("morning", "afternoon", "all_day"),
        allowNull: true,
      },
      notes: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Activitysession",
    },
  );
  return Activitysession;
};
