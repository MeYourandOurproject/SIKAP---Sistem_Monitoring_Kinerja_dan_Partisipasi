'use strict';
const { Schedule, Teacher, Subject, Classroom } = require('../models');

class ScheduleController {
  static async getAll(req, res, next) {
    try {
      const schedules = await Schedule.findAll({ include: [Teacher, Subject, Classroom] });
      res.json(schedules);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findOne({ where: { id }, include: [Teacher, Subject, Classroom] });
      if (!schedule) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { day, startTime, endTime, teacherId, subjectId, classroomId, active } = req.body;
      if (!day || !startTime || !endTime || !teacherId || !subjectId || !classroomId) {
        return res.status(400).json({ message: 'day, startTime, endTime, teacherId, subjectId, dan classroomId diperlukan' });
      }
      const schedule = await Schedule.create({ day, startTime, endTime, teacherId, subjectId, classroomId, active: active !== false });
      res.status(201).json(schedule);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { day, startTime, endTime, teacherId, subjectId, classroomId, active } = req.body;
      const schedule = await Schedule.findByPk(id);
      if (!schedule) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
      schedule.day = day || schedule.day;
      schedule.startTime = startTime || schedule.startTime;
      schedule.endTime = endTime || schedule.endTime;
      schedule.teacherId = teacherId || schedule.teacherId;
      schedule.subjectId = subjectId || schedule.subjectId;
      schedule.classroomId = classroomId || schedule.classroomId;
      if (typeof active !== 'undefined') schedule.active = active;
      await schedule.save();
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await Schedule.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
      res.json({ message: 'Jadwal dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScheduleController;
