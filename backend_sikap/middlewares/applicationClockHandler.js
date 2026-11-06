"use strict";

const { Applicationclock } = require("../models");
const { setApplicationClock } = require("../utils/applicationClock");

async function applicationClockHandler(req, res, next) {
  try {
    const [settings] = await Applicationclock.findOrCreate({
      where: { id: 1 },
      defaults: { mode: "realtime", simulated_at: null },
    });
    setApplicationClock(settings);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = applicationClockHandler;
