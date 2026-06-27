'use strict';
const { AttendanceValidation, Schedule, Teacher, Classroom, User } = require('../models');

class AttendanceController {
  static async getAll(req, res, next) {
    try {
      const validations = await AttendanceValidation.findAll({ include: [Schedule, Teacher, Classroom, User] });
      res.json(validations);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const validation = await AttendanceValidation.findOne({ where: { id }, include: [Schedule, Teacher, Classroom, User] });
      if (!validation) return res.status(404).json({ message: 'Validasi tidak ditemukan' });
      res.json(validation);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { scheduleId, teacherId, classroomId, attendanceStatus, timeStatus, learningStatus, note } = req.body;
      if (!scheduleId || !teacherId || !classroomId || !attendanceStatus || !timeStatus || !learningStatus) {
        return res.status(400).json({ message: 'scheduleId, teacherId, classroomId, attendanceStatus, timeStatus, dan learningStatus diperlukan' });
      }
      const validation = await AttendanceValidation.create({
        scheduleId,
        teacherId,
        classroomId,
        validatorId: req.user.id,
        attendanceStatus,
        timeStatus,
        learningStatus,
        note,
      });
      res.status(201).json(validation);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AttendanceController;
