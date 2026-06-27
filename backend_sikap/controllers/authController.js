const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      res.json({
        success: false,
        message: "An error occurred while logging in",
      });
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { username, password, name, role } = req.body;
      if (!username || !password || !name || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hashedPassword,
        name,
        role,
      });
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
