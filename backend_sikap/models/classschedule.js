"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Classschedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Classschedule.belongsTo(models.Class, { foreignKey: "class_id" });
      Classschedule.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
      Classschedule.belongsTo(models.Subject, { foreignKey: "subject_id" });
      Classschedule.belongsTo(models.Classroom, { foreignKey: "classroom_id" });
      Classschedule.belongsTo(models.Timeslot, {
        foreignKey: "start_timeslot_id",
        as: "startTimeslot",
      });
      Classschedule.belongsTo(models.Timeslot, {
        foreignKey: "end_timeslot_id",
        as: "endTimeslot",
      });
      Classschedule.hasMany(models.Classteacherattendance, {
        foreignKey: "classschedule_id",
        as: "attendances",
      });
    }
  }
  Classschedule.init(
    {
      day: { type: DataTypes.STRING },
      class_id: { type: DataTypes.INTEGER },
      teacher_id: { type: DataTypes.INTEGER },
      subject_id: { type: DataTypes.INTEGER },
      classroom_id: { type: DataTypes.INTEGER },
      start_timeslot_id: { type: DataTypes.INTEGER },
      end_timeslot_id: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Classschedule",
    },
  );
  return Classschedule;
};
