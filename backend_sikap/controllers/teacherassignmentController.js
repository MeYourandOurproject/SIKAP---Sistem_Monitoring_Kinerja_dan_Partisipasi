const { Teacherassignment } = require("../models");

class TeacherassignmentController {
  static async getAll(req, res, next) {
    try {
      const data = await Teacherassignment.findAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Teacherassignment.findByPk(id);
      if (!data) return res.status(404).json({ message: "Teacherassignment not found" });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const payload = req.body;
      const item = await Teacherassignment.create(payload);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Teacherassignment.findByPk(id);
      if (!item) return res.status(404).json({ message: "Teacherassignment not found" });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Teacherassignment.findByPk(id);
      if (!item) return res.status(404).json({ message: "Teacherassignment not found" });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherassignmentController;
