'use strict';
const { SchoolActivity } = require('../models');

class ActivityController {
  static async getAll(req, res, next) {
    try {
      const activities = await SchoolActivity.findAll();
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const activity = await SchoolActivity.findByPk(id);
      if (!activity) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, type, date, responsiblePerson, description, status } = req.body;
      if (!name || !type || !date) {
        return res.status(400).json({ message: 'name, type, dan date diperlukan' });
      }
      const activity = await SchoolActivity.create({ name, type, date, responsiblePerson, description, status: status || 'planned' });
      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, type, date, responsiblePerson, description, status } = req.body;
      const activity = await SchoolActivity.findByPk(id);
      if (!activity) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
      activity.name = name || activity.name;
      activity.type = type || activity.type;
      activity.date = date || activity.date;
      activity.responsiblePerson = responsiblePerson || activity.responsiblePerson;
      activity.description = description || activity.description;
      activity.status = status || activity.status;
      await activity.save();
      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await SchoolActivity.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
      res.json({ message: 'Kegiatan dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityController;
