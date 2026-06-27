const { Classschedule, Timeslot, sequelize } = require("../models");
const Sequelize = require("sequelize");

class ClassscheduleController {
  static async getAll(req, res, next) {
    try {
      const items = await Classschedule.findAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentByClass(req, res, next) {
    try {
      const { class_name } = req.params;

      const now = new Date();

      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      const dayName = req.query.day || days[now.getDay()];

      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");

      let time = req.query.time || `${hh}:${mm}:${ss}`;

      if (/^\d{2}:\d{2}$/.test(time)) {
        time = `${time}:00`;
      }

      if (dayName === "Sabtu" || dayName === "Minggu") {
        return res.json({
          class_id: classId,
          data: null,
          note: "Hari libur",
        });
      }

      const sql = `
      SELECT
        c.id AS class_id,
        c.class_name,
        t.id AS teacher_id,
        t.name AS teacher_name,
        s.id AS subject_id,
        s.subject_name,
        cr.classroom_name,
        ts.start,
        te.end
      FROM Classschedules cs
      JOIN Classes c ON cs.class_id = c.id
      JOIN Teachers t ON cs.teacher_id = t.id
      JOIN Subjects s ON cs.subject_id = s.id
      JOIN Classrooms cr ON cs.classroom_id = cr.id
      JOIN Timeslots ts ON cs.start_timeslot_id = ts.id
      JOIN Timeslots te ON cs.end_timeslot_id = te.id
      WHERE
        cs.class_id = ?
        AND cs.day = ?
        AND ? BETWEEN ts.start AND te.end
      LIMIT 1
    `;

      const rows = await sequelize.query(sql, {
        replacements: [classId, dayName, time],
        type: Sequelize.QueryTypes.SELECT,
      });

      if (!rows.length) {
        return res.json({
          class_id: classId,
          data: null,
          note: "Tidak ada jadwal KBM saat ini",
        });
      }

      res.json({
        class_id: classId,
        data: rows[0],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrent(req, res, next) {
    try {
      const now = new Date();
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      // const dayName = req.query.day || days[now.getDay()];
      const dayName = 'Senin';
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      //   let time = req.query.time || `${hh}:${mm}:${ss}`;
      let time = "08:40:50";

      if (/^\d{2}:\d{2}$/.test(time)) {
        time = `${time}:00`;
      }

      const schoolStart = "07:00:00";
      const schoolEnd = "15:10:00";

      if (dayName === "Sabtu" || dayName === "Minggu") {
        return res.json({
          total: 0,
          data: [],
          note: "Hari libur, tidak ada KBM",
        });
      }

      if (time < schoolStart || time > schoolEnd) {
        return res.json({
          total: 0,
          data: [],
          note: `Belum masuk waktu sekolah atau sudah selesai. Jam efektif KBM adalah ${schoolStart} - ${schoolEnd}`,
        });
      }

      const sql = `
        SELECT
          c.id AS class_id,
          c.class_name,
          t.name AS teacher_name,
          s.subject_name,
          cr.classroom_name,
          ts.start,
          te.end
        FROM Classschedules cs
        JOIN Classes c ON cs.class_id = c.id
        JOIN Teachers t ON cs.teacher_id = t.id
        JOIN Subjects s ON cs.subject_id = s.id
        JOIN Classrooms cr ON cs.classroom_id = cr.id
        JOIN Timeslots ts ON cs.start_timeslot_id = ts.id
        JOIN Timeslots te ON cs.end_timeslot_id = te.id
        WHERE cs.day = ? AND ? BETWEEN ts.start AND te.end
        ORDER BY c.id ASC
      `;

      const rows = await sequelize.query(sql, {
        replacements: [dayName, time],
        type: Sequelize.QueryTypes.SELECT,
      });

      res.json({
        total: rows.length,
        data: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const item = await Classschedule.findByPk(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Classschedule not found" });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const item = await Classschedule.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const item = await Classschedule.findByPk(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Classschedule not found" });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const item = await Classschedule.findByPk(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Classschedule not found" });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassscheduleController;
