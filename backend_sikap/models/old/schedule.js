'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'Schedules',
  });

  Schedule.associate = function(models) {
    Schedule.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    Schedule.belongsTo(models.Subject, { foreignKey: 'subjectId' });
    Schedule.belongsTo(models.Classroom, { foreignKey: 'classroomId' });
    Schedule.hasMany(models.AttendanceValidation, { foreignKey: 'scheduleId' });
  };

  return Schedule;
};
