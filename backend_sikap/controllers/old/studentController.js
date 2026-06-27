'use strict';
const { Student, User, Classroom } = require('../models');

class StudentController {
  static async getAll(req, res, next) {
    try {
      const students = await Student.findAll({ include: [User, Classroom] });
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await Student.findOne({ where: { id }, include: [User, Classroom] });
      if (!student) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { userId, classroomId, isKm, status } = req.body;
      if (!userId) return res.status(400).json({ message: 'userId diperlukan' });
      const student = await Student.create({ userId, classroomId, isKm: !!isKm, status: status || 'active' });
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { classroomId, isKm, status } = req.body;
      const student = await Student.findByPk(id);
      if (!student) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
      student.classroomId = classroomId || student.classroomId;
      if (typeof isKm !== 'undefined') student.isKm = isKm;
      student.status = status || student.status;
      await student.save();
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await Student.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
      res.json({ message: 'Siswa dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentController;
