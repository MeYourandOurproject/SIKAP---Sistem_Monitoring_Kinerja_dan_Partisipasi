'use strict';
const { User, Role } = require('../models');

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await User.findAll({ include: Role });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id }, include: Role });
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { fullname, email, password, roleName, status } = req.body;
      if (!fullname || !email || !password || !roleName) {
        return res.status(400).json({ message: 'fullname, email, password, dan roleName diperlukan' });
      }

      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) return res.status(404).json({ message: 'Role tidak ditemukan' });

      const user = await User.create({ fullname, email, password, roleId: role.id, status: status || 'active' });
      res.status(201).json({ id: user.id, fullname: user.fullname, email: user.email, role: role.name });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { fullname, email, password, roleName, status } = req.body;
      const user = await User.findOne({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

      if (roleName) {
        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) return res.status(404).json({ message: 'Role tidak ditemukan' });
        user.roleId = role.id;
      }

      user.fullname = fullname || user.fullname;
      user.email = email || user.email;
      if (password) user.password = password;
      user.status = status || user.status;
      await user.save();
      res.json({ id: user.id, fullname: user.fullname, email: user.email, roleName });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const destroyed = await User.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ message: 'User tidak ditemukan' });
      res.json({ message: 'User dihapus' });
    } catch (error) {
      next(error);
    }
  }

  static async listRoles(req, res, next) {
    try {
      const roles = await Role.findAll();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
