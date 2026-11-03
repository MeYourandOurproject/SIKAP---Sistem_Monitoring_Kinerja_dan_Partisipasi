const { Class, Student, Teacher, sequelize } = require('../models');

async function getActiveStudentCounts(classIds) {
  if (classIds.length === 0) return new Map();

  const counts = await Student.findAll({
    attributes: [
      'class_id',
      [sequelize.fn('COUNT', sequelize.col('id')), 'active_student_count'],
    ],
    where: { class_id: classIds, status: 'active' },
    group: ['class_id'],
    raw: true,
  });

  return new Map(
    counts.map((record) => [Number(record.class_id), Number(record.active_student_count)]),
  );
}

function withActiveStudentCount(classRecord, counts) {
  const data = classRecord.toJSON();
  data.total_student = counts.get(Number(classRecord.id)) || 0;
  return data;
}

class ClassController {
  static async getAll(req, res, next) {
    try {
      const classes = await Class.findAll();
      const counts = await getActiveStudentCounts(classes.map((classRecord) => classRecord.id));
      res.json(classes.map((classRecord) => withActiveStudentCount(classRecord, counts)));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const cls = await Class.findByPk(req.params.id);
      if (!cls) return res.status(404).json({ message: 'Class not found' });
      const counts = await getActiveStudentCounts([cls.id]);
      res.json(withActiveStudentCount(cls, counts));
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

      const updates = { ...req.body };
      if (Object.prototype.hasOwnProperty.call(updates, 'classteacher_id')) {
        const teacherId = updates.classteacher_id;
        if (teacherId === null || teacherId === '') {
          updates.classteacher_id = null;
        } else if (!Number.isInteger(Number(teacherId)) || Number(teacherId) < 1) {
          return res.status(400).json({ message: 'classteacher_id must be a valid teacher ID or null' });
        } else {
          const teacher = await Teacher.findByPk(Number(teacherId));
          if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
          }
          updates.classteacher_id = Number(teacherId);
        }
      }

      await cls.update(updates);
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
