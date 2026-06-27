const { User } = require("../models");

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { username, password, name, role } = req.body;
      const user = await User.findOne({ where: { id } });
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });

      user.username = username || user.username;
      user.password = password || user.password;
      user.name = name || user.name;
      user.role = role || user.role || user.role;
      await user.save();
      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
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
      await user.destroy();
      res.json({ message: "User berhasil dihapus" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
