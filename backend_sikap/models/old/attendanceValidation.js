'use strict';
module.exports = (sequelize, DataTypes) => {
  const AttendanceValidation = sequelize.define('AttendanceValidation', {
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    validatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attendanceStatus: {
      type: DataTypes.ENUM('present', 'absent'),
      allowNull: false,
    },
    timeStatus: {
      type: DataTypes.ENUM('ontime', 'late'),
      allowNull: false,
    },
    learningStatus: {
      type: DataTypes.ENUM('active_teaching', 'assigning_tasks', 'practical', 'discussion', 'empty_class'),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'AttendanceValidations',
  });

  AttendanceValidation.associate = function(models) {
    AttendanceValidation.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
    AttendanceValidation.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    AttendanceValidation.belongsTo(models.Classroom, { foreignKey: 'classroomId' });
    AttendanceValidation.belongsTo(models.User, { foreignKey: 'validatorId' });
  };

  return AttendanceValidation;
};
