'use strict';
module.exports = (sequelize, DataTypes) => {
  const Classroom = sequelize.define('Classroom', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Classrooms',
  });

  Classroom.associate = function(models) {
    Classroom.hasMany(models.Student, { foreignKey: 'classroomId' });
    Classroom.hasMany(models.Schedule, { foreignKey: 'classroomId' });
    Classroom.hasMany(models.AttendanceValidation, { foreignKey: 'classroomId' });
  };

  return Classroom;
};
