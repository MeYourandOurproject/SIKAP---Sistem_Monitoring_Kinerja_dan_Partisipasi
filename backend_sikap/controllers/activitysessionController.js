const { Activitysession, Activity, Teacherassignment, Teacher, Activityateacherattendance } = require("../models");

class ActivitysessionController {
  static async getAll(req, res, next) {
    try {
      const data = await Activitysession.findAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Activitysession.findByPk(id);
      if (!data) return res.status(404).json({ message: "Activitysession not found" });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const payload = req.body;
      const item = await Activitysession.create(payload);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Activitysession.findByPk(id);
      if (!item) return res.status(404).json({ message: "Activitysession not found" });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Activitysession.findByPk(id);
      if (!item) return res.status(404).json({ message: "Activitysession not found" });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getAttendances(req, res, next) {
    try {
      const { id } = req.params;
      const session = await Activitysession.findByPk(id, {
        include: [
          {
            model: Activity,
            include: [
              {
                model: Teacherassignment,
                include: [Teacher],
              },
            ],
          },
          {
            model: Activityateacherattendance,
            include: [Teacher],
          },
        ],
      });
      if (!session) return res.status(404).json({ message: "Activitysession not found" });
      res.json(session);
    } catch (error) {
      next(error);
    }
  }

  static async saveAttendances(req, res, next) {
    try {
      const { id } = req.params; // session id
      const { attendances } = req.body;

      const session = await Activitysession.findByPk(id);
      if (!session) return res.status(404).json({ message: "Activitysession not found" });

      if (!Array.isArray(attendances)) {
        return res.status(400).json({ message: "attendances must be an array" });
      }

      const results = [];
      for (const a of attendances) {
        const teacherId = a.teacher_id;
        const status = a.status || null;
        const notes = a.notes || null;

        let row = await Activityateacherattendance.findOne({ where: { session_id: id, teacher_id: teacherId } });
        if (row) {
          await row.update({ status, notes });
        } else {
          row = await Activityateacherattendance.create({ session_id: id, teacher_id: teacherId, status, notes });
        }
        const withTeacher = await Activityateacherattendance.findByPk(row.id, { include: [Teacher] });
        results.push(withTeacher);
      }

      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivitysessionController;
