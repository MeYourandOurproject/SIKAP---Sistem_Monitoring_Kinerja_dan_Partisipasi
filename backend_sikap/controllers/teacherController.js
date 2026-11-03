const { Teacher } = require("../models");

class TeacherController {
  static async getAll(req, res, next) {
    try {
      const teachers = await Teacher.findAll({
        // attributes: ["id", "name", "nip", "nuptk"],
      });
      // const teachers = await Teacher.findAll();
      res.json(teachers);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      next(error);
    }
  }

  static async count(req, res, next) {
    try {
      const total = await Teacher.count();
      res.json({ total });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, nip, nuptk, gender, ptk_type, gtk_type, status } = req.body;

      if (!name || !gender || !status) {
        return res
          .status(400)
          .json({ message: "name, gender, and status are required" });
      }

      const teacher = await Teacher.create({
        name,
        nip,
        nuptk,
        gender,
        ptk_type,
        gtk_type,
        status,
      });

      res.status(201).json(teacher);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, nip, nuptk, gender, ptk_type, gtk_type, status } = req.body;
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      teacher.name = name ?? teacher.name;
      teacher.nip = nip ?? teacher.nip;
      teacher.nuptk = nuptk ?? teacher.nuptk;
      teacher.gender = gender ?? teacher.gender;
      teacher.ptk_type = ptk_type ?? teacher.ptk_type;
      teacher.gtk_type = gtk_type ?? teacher.gtk_type;
      teacher.status = status ?? teacher.status;

      await teacher.save();
      res.json(teacher);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusBulk(req, res, next) {
    try {
      const { ids, status } = req.body;
      if (
        !Array.isArray(ids) ||
        ids.length === 0 ||
        !ids.every((id) => Number.isInteger(Number(id)) && Number(id) > 0)
      ) {
        return res.status(400).json({
          message: "ids must be a non-empty array of valid teacher IDs",
        });
      }
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          message: "status must be active or inactive",
        });
      }

      const uniqueIds = [...new Set(ids.map(Number))];
      const teachers = await Teacher.findAll({
        attributes: ["id"],
        where: { id: uniqueIds },
      });
      if (teachers.length !== uniqueIds.length) {
        return res.status(404).json({
          message: "One or more selected teachers were not found",
        });
      }

      const [updatedCount] = await Teacher.update(
        { status },
        { where: { id: uniqueIds } },
      );
      res.json({
        message: "Teacher statuses updated successfully",
        updatedCount,
        status,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await Teacher.destroy({ where: { id } });
      if (!destroyed) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json({ message: "Teacher deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;
