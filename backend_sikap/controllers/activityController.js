const {
  Activity,
  Teacher,
  Teacherassignment,
  Activitysession,
  Activityateacherattendance,
} = require("../models");

class ActivityController {
  static async getAll(req, res, next) {
    try {
      const data = await Activity.findAll({
        include: [
          {
            model: Teacherassignment,
            include: [Teacher],
          },
        ],
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Activity.findByPk(id);
      if (!data) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, type, date, responsiblePerson, description, status, target_type } = req.body;
      const activity = await Activity.create({
        name,
        type,
        date: date || null,
        responsiblePerson: responsiblePerson || null,
        description,
        status: status || "planned",
        target_type,
      });
      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      await activity.update(req.body);
      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const activity = await Activity.findByPk(id);
      if (!activity) return res.status(404).json({ message: "Activity not found" });

      const sessions = await Activitysession.findAll({
        where: { activity_id: id },
        attributes: ["id"],
      });
      const sessionIds = sessions.map((session) => session.id);

      if (sessionIds.length) {
        await Activityateacherattendance.destroy({
          where: {
            session_id: sessionIds,
          },
        });
      }

      await Activitysession.destroy({
        where: {
          activity_id: id,
        },
      });

      await Teacherassignment.destroy({
        where: {
          activity_id: id,
        },
      });

      await activity.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityController;
