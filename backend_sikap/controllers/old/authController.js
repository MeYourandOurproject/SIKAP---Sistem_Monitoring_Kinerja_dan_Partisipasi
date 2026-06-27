const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email }, include: Role });
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      const token = jwt.sign({ id: user.id, role: user.Role ? user.Role.name : null }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email, role: user.Role ? user.Role.name : null } });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { fullname, email, password, roleName } = req.body;
      if (!fullname || !email || !password || !roleName) {
        return res.status(400).json({ message: 'fullname, email, password, dan roleName diperlukan' });
      }

      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) {
        return res.status(404).json({ message: 'Role tidak ditemukan' });
      }

      const user = await User.create({ fullname, email, password, roleId: role.id });
      res.status(201).json({ id: user.id, fullname: user.fullname, email: user.email, role: role.name });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
