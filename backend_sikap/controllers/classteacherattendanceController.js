const { Classteacherattendance } = require('../models');
const { Op } = require('sequelize');
const { getApplicationNow } = require('../utils/applicationClock');

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
      const payload = {
        date: req.body.date ? new Date(req.body.date) : getApplicationNow(),
        classschedule_id: req.body.classschedule_id,
        attendance_status: req.body.attendance_status,
        activity_status: req.body.activity_status,
        validator_id: req.user?.id || req.body.validator_id || null,
        validated_at: req.body.validated_at
          ? new Date(req.body.validated_at)
          : getApplicationNow(),
        lateness: req.body.lateness || 0,
        notes: req.body.notes || null,
      };

      if (!payload.classschedule_id) {
        return res.status(400).json({ message: 'classschedule_id is required' });
      }

      if (!payload.attendance_status) {
        return res.status(400).json({ message: 'attendance_status is required' });
      }

      if (!payload.activity_status) {
        return res.status(400).json({ message: 'activity_status is required' });
      }

      // guard: check existing validation for same schedule in the same day
      const existing = await Classteacherattendance.findOne({
        where: {
          classschedule_id: payload.classschedule_id,
          date: {
            [Op.gte]: new Date(new Date(payload.date).setHours(0, 0, 0, 0)),
            [Op.lt]: new Date(new Date(payload.date).setHours(24, 0, 0, 0)),
          },
        },
      });

      if (existing) {
        return res.status(409).json({
          message: 'Validasi untuk jadwal ini sudah ada hari ini',
          existing,
        });
      }

      // Filter payload to only attributes defined in the model to avoid
      // sending obsolete fields (e.g. teacher_id) to the DB
      const allowedAttrs = Object.keys(Classteacherattendance.rawAttributes || {});
      const filtered = {};
      for (const k of allowedAttrs) {
        if (payload[k] !== undefined) filtered[k] = payload[k];
      }

      // Debugging: if incoming body had unexpected fields, log small warning
      const unknownKeys = Object.keys(req.body || {}).filter(k => !allowedAttrs.includes(k));
      if (unknownKeys.length) {
        console.warn('Classteacherattendance.create: ignoring unknown fields ->', unknownKeys);
      }

      const item = await Classteacherattendance.create(filtered);
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
