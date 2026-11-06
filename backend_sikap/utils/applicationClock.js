"use strict";

let clockSettings = null;

function setApplicationClock(settings) {
  clockSettings = settings;
}

function getApplicationNow() {
  if (
    clockSettings?.mode !== "simulation" ||
    !clockSettings.simulated_at ||
    !clockSettings.updatedAt
  ) {
    return new Date();
  }

  const simulatedAt = new Date(clockSettings.simulated_at).getTime();
  const savedAt = new Date(clockSettings.updatedAt).getTime();
  if (!Number.isFinite(simulatedAt) || !Number.isFinite(savedAt)) {
    throw new Error("Konfigurasi waktu simulasi tidak valid");
  }

  return new Date(simulatedAt + Math.max(0, Date.now() - savedAt));
}

function getApplicationClockResponse() {
  return {
    mode: clockSettings?.mode || "realtime",
    simulated_at: clockSettings?.simulated_at || null,
    current_time: getApplicationNow().toISOString(),
  };
}

module.exports = {
  getApplicationClockResponse,
  getApplicationNow,
  setApplicationClock,
};
