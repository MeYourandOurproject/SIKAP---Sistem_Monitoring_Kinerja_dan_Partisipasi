"use strict";

const { Applicationclock } = require("../models");
const {
  getApplicationClockResponse,
  setApplicationClock,
} = require("../utils/applicationClock");

class ApplicationClockController {
  static async getCurrent(req, res, next) {
    try {
      const [settings] = await Applicationclock.findOrCreate({
        where: { id: 1 },
        defaults: { mode: "realtime", simulated_at: null },
      });
      setApplicationClock(settings);
      res.json(getApplicationClockResponse());
    } catch (error) {
      next(error);
    }
  }

  static async updateCurrent(req, res, next) {
    try {
      const { mode, simulated_at } = req.body;
      if (!["realtime", "simulation"].includes(mode)) {
        return res.status(400).json({ message: "Mode jam aplikasi tidak valid" });
      }

      let simulatedAt = null;
      if (mode === "simulation") {
        const datetimeMatch =
          typeof simulated_at === "string" &&
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.exec(
            simulated_at,
          );
        if (!datetimeMatch) {
          return res.status(400).json({
            message: "Tanggal dan jam simulasi harus diisi",
          });
        }

        const [, year, month, day, hours, minutes, seconds] = datetimeMatch;
        const calendarDate = new Date(
          Date.UTC(Number(year), Number(month) - 1, Number(day)),
        );
        if (
          calendarDate.getUTCFullYear() !== Number(year) ||
          calendarDate.getUTCMonth() !== Number(month) - 1 ||
          calendarDate.getUTCDate() !== Number(day) ||
          Number(hours) > 23 ||
          Number(minutes) > 59 ||
          Number(seconds) > 59
        ) {
          return res.status(400).json({
            message: "Tanggal dan jam simulasi tidak valid",
          });
        }

        simulatedAt = new Date(simulated_at);
        if (Number.isNaN(simulatedAt.getTime())) {
          return res.status(400).json({
            message: "Format tanggal dan jam simulasi tidak valid",
          });
        }
      }

      const [settings] = await Applicationclock.findOrCreate({
        where: { id: 1 },
        defaults: { mode, simulated_at: simulatedAt },
      });
      await settings.update({
        mode,
        simulated_at: simulatedAt,
        updatedAt: new Date(),
      });
      setApplicationClock(settings);

      res.json(getApplicationClockResponse());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApplicationClockController;
