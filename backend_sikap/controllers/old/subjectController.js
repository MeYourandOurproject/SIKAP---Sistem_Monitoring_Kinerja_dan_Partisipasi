'use strict';
const { Subject } = require('../models');

class SubjectController {
  static async getAll(req, res, next) {
    try {
      const subjects = await Subject.findAll();
      res.json(subjects);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const subject = await Subject.findByPk(id);
      if (!subject) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Nama mata pelajaran diperlukan' });
      const subject = await Subject.create({ name });
      res.status(201).json(subject);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const subject = await Subject.findByPk(id);
      if (!subject) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });
      subject.name = name || subject.name;
      await subject.save();
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await Subject.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'Mata pelajaran tidak ditemukan' });
      res.json({ message: 'Mata pelajaran dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubjectController;
