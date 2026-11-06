import { reactive } from "vue";
import { getApplicationClock } from "./api";

export const applicationClock = reactive({
  mode: "realtime",
  currentTime: new Date(),
  loaded: false,
  error: "",
});

export function formatApplicationDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function getApplicationDateKey() {
  return formatApplicationDateKey(applicationClock.currentTime);
}

let clockBase = Date.now();
let clientBase = Date.now();
let tickInterval;
let refreshInterval;

export function applyApplicationClock(data) {
  const currentTime = new Date(data.current_time);
  if (Number.isNaN(currentTime.getTime())) {
    throw new Error("Waktu aplikasi dari server tidak valid.");
  }

  applicationClock.mode = data.mode;
  applicationClock.currentTime = currentTime;
  applicationClock.loaded = true;
  applicationClock.error = "";
  clockBase = currentTime.getTime();
  clientBase = Date.now();
}

export function updateApplicationClockTick() {
  if (!applicationClock.loaded) return;

  applicationClock.currentTime =
    applicationClock.mode === "simulation"
      ? new Date(clockBase + Date.now() - clientBase)
      : new Date();
}

export async function refreshApplicationClock() {
  try {
    applyApplicationClock(await getApplicationClock());
  } catch (error) {
    applicationClock.error = error.message || "Gagal memuat jam aplikasi.";
    console.error("Gagal memuat jam aplikasi:", error);
  }
}

export function startApplicationClock() {
  refreshApplicationClock();
  tickInterval = setInterval(updateApplicationClockTick, 1000);
  refreshInterval = setInterval(refreshApplicationClock, 10000);
}

export function stopApplicationClock() {
  clearInterval(tickInterval);
  clearInterval(refreshInterval);
}
