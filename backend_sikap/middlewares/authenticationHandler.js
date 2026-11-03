const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authen(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const user = await User.findByPk(decodedToken.id, {
      attributes: ["id", "is_active"],
    });
    if (!user || !user.is_active) {
      return res.status(401).json({ message: "Akun ini sedang tidak aktif" });
    }
    req.user = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authen;
