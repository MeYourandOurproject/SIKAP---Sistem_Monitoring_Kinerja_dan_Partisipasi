const { Classteacherattendance } = require('../models');

class ClassteacherattendanceController {
  static async getAll(req, res, next) {
    try {
      const items = await Classteacherattendance.findAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const item = await Classteacherattendance.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Record not found' });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const item = await Classteacherattendance.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const item = await Classteacherattendance.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Record not found' });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const item = await Classteacherattendance.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Record not found' });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassteacherattendanceController;
