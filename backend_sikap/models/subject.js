"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subject.hasMany(models.Classschedule, { foreignKey: 'subject_id' });
    }
  }
  Subject.init(
    {
      subject_name: { type: DataTypes.STRING, allowNull: false },
      subject_code: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Subject",
    },
  );
  return Subject;
};
