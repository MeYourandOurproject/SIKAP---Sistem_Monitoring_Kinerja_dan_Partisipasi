const { Academicperiod } = require("../models");

const isValidAcademicYear = (academicYear) => {
  const match = /^(\d{4})\/(\d{4})$/.exec(academicYear || "");
  return Boolean(match && Number(match[2]) === Number(match[1]) + 1);
};

class AcademicperiodController {
  static async getCurrent(req, res, next) {
    try {
      const period = await Academicperiod.findByPk(1);
      if (!period) {
        return res.status(404).json({ message: "Periode akademik belum diatur" });
      }
      res.json(period);
    } catch (error) {
      next(error);
    }
  }

  static async updateCurrent(req, res, next) {
    try {
      const { academic_year, semester } = req.body;
      if (!isValidAcademicYear(academic_year)) {
        return res.status(400).json({
          message: "Tahun ajaran harus berformat berurutan, misalnya 2026/2027",
        });
      }
      if (!["odd", "even"].includes(semester)) {
        return res.status(400).json({ message: "Semester tidak valid" });
      }

      const [period] = await Academicperiod.findOrCreate({
        where: { id: 1 },
        defaults: { academic_year, semester },
      });
      if (period.academic_year !== academic_year || period.semester !== semester) {
        await period.update({ academic_year, semester });
      }
      res.json(period);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AcademicperiodController;
