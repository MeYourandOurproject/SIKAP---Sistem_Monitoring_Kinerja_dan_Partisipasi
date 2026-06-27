'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isKm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    tableName: 'Students',
  });

  Student.associate = function(models) {
    Student.belongsTo(models.User, { foreignKey: 'userId' });
    Student.belongsTo(models.Classroom, { foreignKey: 'classroomId' });
  };

  return Student;
};
