"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Class.hasMany(models.Enrollment, { foreignKey: 'class_id' });
      Class.belongsTo(models.Teacher, { foreignKey: 'classteacher_id', as: 'classTeacher' });
      Class.belongsTo(models.User, { foreignKey: 'classleader_id', as: 'classLeader' });
    }
  }
  Class.init(
    {
      class_name: { type: DataTypes.STRING, allowNull: false },
      major: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      classleader_id: { type: DataTypes.INTEGER, allowNull: true },
      classleader_contact: { type: DataTypes.STRING, allowNull: true },
      classteacher_id: { type: DataTypes.INTEGER, allowNull: true },
      classteacher_contact: { type: DataTypes.STRING, allowNull: true },
      total_student: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Class",
    },
  );
  return Class;
};
