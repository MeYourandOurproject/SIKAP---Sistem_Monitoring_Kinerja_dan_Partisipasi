'use strict';
const { ParticipationValidation, SchoolActivity, Teacher, User } = require('../models');

class ParticipationController {
  static async getAll(req, res, next) {
    try {
      const validations = await ParticipationValidation.findAll({ include: [SchoolActivity, Teacher, User] });
      res.json(validations);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const validation = await ParticipationValidation.findOne({ where: { id }, include: [SchoolActivity, Teacher, User] });
      if (!validation) return res.status(404).json({ message: 'Validasi tidak ditemukan' });
      res.json(validation);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { activityId, teacherId, participationStatus, note } = req.body;
      if (!activityId || !teacherId || !participationStatus) {
        return res.status(400).json({ message: 'activityId, teacherId, dan participationStatus diperlukan' });
      }
      const validation = await ParticipationValidation.create({
        activityId,
        teacherId,
        validatorId: req.user.id,
        participationStatus,
        note,
      });
      res.status(201).json(validation);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ParticipationController;
