const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: payload.id }, include: Role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.Role ? user.Role.name : null,
      status: user.status,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
