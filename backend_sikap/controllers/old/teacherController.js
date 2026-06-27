'use strict';
const { Teacher, User } = require('../models');

class TeacherController {
  static async getAll(req, res, next) {
    try {
      const teachers = await Teacher.findAll({ include: User });
      res.json(teachers);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findOne({ where: { id }, include: User });
      if (!teacher) return res.status(404).json({ message: 'Guru tidak ditemukan' });
      res.json(teacher);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { userId, nip, subjectExpertise, department } = req.body;
      if (!userId || !nip) {
        return res.status(400).json({ message: 'userId dan nip diperlukan' });
      }
      const teacher = await Teacher.create({ userId, nip, subjectExpertise, department });
      res.status(201).json(teacher);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nip, subjectExpertise, department } = req.body;
      const teacher = await Teacher.findByPk(id);
      if (!teacher) return res.status(404).json({ message: 'Guru tidak ditemukan' });
      teacher.nip = nip || teacher.nip;
      teacher.subjectExpertise = subjectExpertise || teacher.subjectExpertise;
      teacher.department = department || teacher.department;
      await teacher.save();
      res.json(teacher);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await Teacher.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'Guru tidak ditemukan' });
      res.json({ message: 'Guru dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;
