'use strict';
const { Classroom } = require('../models');

class ClassController {
  static async getAll(req, res, next) {
    try {
      const classrooms = await Classroom.findAll();
      res.json(classrooms);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const classroom = await Classroom.findByPk(id);
      if (!classroom) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
      res.json(classroom);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, department, grade } = req.body;
      if (!name) return res.status(400).json({ message: 'Nama kelas diperlukan' });
      const classroom = await Classroom.create({ name, department, grade });
      res.status(201).json(classroom);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, department, grade } = req.body;
      const classroom = await Classroom.findByPk(id);
      if (!classroom) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
      classroom.name = name || classroom.name;
      classroom.department = department || classroom.department;
      classroom.grade = grade || classroom.grade;
      await classroom.save();
      res.json(classroom);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await Classroom.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
      res.json({ message: 'Kelas dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassController;
