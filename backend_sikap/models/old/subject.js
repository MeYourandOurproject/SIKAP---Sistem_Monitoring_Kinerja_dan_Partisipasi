'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'Subjects',
  });

  Subject.associate = function(models) {
    Subject.hasMany(models.Schedule, { foreignKey: 'subjectId' });
  };

  return Subject;
};
