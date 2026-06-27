'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subjectExpertise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Teachers',
  });

  Teacher.associate = function(models) {
    Teacher.belongsTo(models.User, { foreignKey: 'userId' });
    Teacher.hasMany(models.Schedule, { foreignKey: 'teacherId' });
    Teacher.hasMany(models.AttendanceValidation, { foreignKey: 'teacherId' });
    Teacher.hasMany(models.ParticipationValidation, { foreignKey: 'teacherId' });
  };

  return Teacher;
};
