"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // user-class and teacher relations removed in favor of enrollment/junction tables
      User.hasMany(models.Classteacherattendance, { foreignKey: 'validator_id', as: 'validations' });
      User.hasMany(models.Class, {foreignKey:"classleader_id", as: 'classleader' });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM,
        values: ["student", "teacher", "admin", "headmaster", "responsible"],
        allowNull: false,
      },
      // class_id and teacher_id removed; use Enrollments and ClassTeachers
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
