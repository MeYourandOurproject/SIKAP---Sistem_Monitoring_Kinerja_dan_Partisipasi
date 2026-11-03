const { User } = require("../models");
const bcrypt = require("bcrypt");

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["name", "ASC"]],
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { username, password, name, role, teacher_id, contact } = req.body;
      if (!username || !password || !name || !role) {
        return res.status(400).json({
          message: "username, password, name, and role are required",
        });
      }
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }
      if (role === "teacher" && !teacher_id) {
        return res.status(400).json({
          message: "A teacher account must be linked to a teacher record",
        });
      }

      const user = await User.create({
        username,
        password: await bcrypt.hash(password, 10),
        name,
        role,
        teacher_id: teacher_id || null,
        contact: contact || null,
      });

      res.status(201).json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        teacher_id: user.teacher_id,
        contact: user.contact,
        is_active: user.is_active,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { username, password, name, role, teacher_id, contact, is_active } =
        req.body;
      const user = await User.findOne({ where: { id } });
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });

      if (is_active === false && Number(req.user.id) === Number(user.id)) {
        return res.status(400).json({
          message: "Tidak dapat menonaktifkan akun sendiri",
        });
      }

      if (username !== undefined) user.username = username;
      if (password) {
        if (typeof password !== "string" || password.length < 8) {
          return res.status(400).json({
            message: "Password must be at least 8 characters",
          });
        }
        user.password = await bcrypt.hash(password, 10);
      }
      if (name !== undefined) user.name = name;
      if (role !== undefined) user.role = role;
      if (teacher_id !== undefined) user.teacher_id = teacher_id || null;
      if (contact !== undefined) user.contact = contact || null;
      if (typeof is_active === "boolean") user.is_active = is_active;
      if (role === "teacher" && !user.teacher_id) {
        return res.status(400).json({
          message: "A teacher account must be linked to a teacher record",
        });
      }
      await user.save();
      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        teacher_id: user.teacher_id,
        contact: user.contact,
        is_active: user.is_active,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });
      if (Number(req.user.id) === Number(user.id)) {
        return res.status(400).json({
          message: "Tidak dapat menghapus akun sendiri",
        });
      }
      await user.destroy();
      res.json({ message: "User berhasil dihapus" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
