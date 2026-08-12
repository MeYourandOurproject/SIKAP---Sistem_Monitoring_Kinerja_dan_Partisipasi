const { Activityateacherattendance } = require("../models");

class ActivityateacherattendanceController {
  static async getAll(req, res, next) {
    try {
      const data = await Activityateacherattendance.findAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Activityateacherattendance.findByPk(id);
      if (!data) return res.status(404).json({ message: "Activity attendance not found" });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const payload = req.body;
      const item = await Activityateacherattendance.create(payload);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Activityateacherattendance.findByPk(id);
      if (!item) return res.status(404).json({ message: "Activity attendance not found" });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Activityateacherattendance.findByPk(id);
      if (!item) return res.status(404).json({ message: "Activity attendance not found" });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityateacherattendanceController;
