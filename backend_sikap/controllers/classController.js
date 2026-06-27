const { Class} = require('../models');

class ClassController {
  static async getAll(req, res, next) {
    try {
      const classes = await Class.findAll();
      res.json(classes);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const cls = await Class.findByPk(req.params.id);
      if (!cls) return res.status(404).json({ message: 'Class not found' });
      res.json(cls);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        class_name,
        major,
        level,
        teacher_id = null,
        class_teacher_contact = null,
        total_student = 0,
      } = req.body;

      const cls = await Class.create({
        class_name,
        major,
        level,
        teacher_id,
        class_teacher_contact,
        total_student,
      });

      res.status(201).json(cls);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const cls = await Class.findByPk(req.params.id);
      if (!cls) return res.status(404).json({ message: 'Class not found' });

      await cls.update(req.body);
      res.json(cls);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const cls = await Class.findByPk(req.params.id);
      if (!cls) return res.status(404).json({ message: 'Class not found' });

      await cls.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassController;
