"use strict";

const { Classagenda, Classschedule, Timeslot, User } = require("../models");
const { getApplicationNow } = require("../utils/applicationClock");

const activityStatuses = ["teaching", "assignment", "empty"];

function getJakartaDateTime(date = getApplicationNow()) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return {
    day: values.weekday,
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}:${values.second}`,
  };
}

async function getTeacherSchedule(req, scheduleId) {
  const user = await User.findByPk(req.user.id, { attributes: ["teacher_id"] });
  if (!user?.teacher_id) {
    const error = new Error("Akun guru belum terhubung dengan data guru");
    error.status = 403;
    throw error;
  }

  const schedule = await Classschedule.findOne({
    where: { id: scheduleId, teacher_id: user.teacher_id },
    include: [
      { model: Timeslot, as: "startTimeslot", attributes: ["start"] },
      { model: Timeslot, as: "endTimeslot", attributes: ["end"] },
    ],
  });
  if (!schedule) {
    const error = new Error("Jadwal tidak ditemukan atau bukan jadwal Anda");
    error.status = 404;
    throw error;
  }
  return { schedule, teacherId: user.teacher_id };
}

function isScheduleInProgress(schedule, now) {
  const start = schedule.startTimeslot?.start;
  const end = schedule.endTimeslot?.end;
  return schedule.day === now.day && start && end && start <= now.time && now.time < end;
}

function isValidDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

class ClassagendaController {
  static async getForSchedule(req, res, next) {
    try {
      const { schedule } = await getTeacherSchedule(req, req.params.scheduleId);
      const date = req.query.date || getJakartaDateTime().date;
      if (!isValidDateOnly(date)) {
        return res.status(400).json({ message: "Format tanggal harus YYYY-MM-DD" });
      }
      const agenda = await Classagenda.findOne({
        where: { classschedule_id: schedule.id, agenda_date: date },
      });
      res.json({
        schedule_id: schedule.id,
        agenda_date: date,
        agenda,
      });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      next(error);
    }
  }

  static async saveForSchedule(req, res, next) {
    try {
      const { schedule, teacherId } = await getTeacherSchedule(req, req.params.scheduleId);
      const now = getJakartaDateTime();
      if (!isScheduleInProgress(schedule, now)) {
        return res.status(409).json({
          message: "Agenda hanya dapat disimpan saat jadwal sedang berlangsung",
        });
      }

      const { activity_status, content } = req.body || {};
      if (!activityStatuses.includes(activity_status)) {
        return res.status(400).json({
          message: "Status pembelajaran harus teaching, assignment, atau empty",
        });
      }
      if (typeof content !== "string" || content.trim().length > 10000) {
        return res.status(400).json({
          message: "Materi/agenda wajib berupa teks dengan maksimal 10.000 karakter",
        });
      }
      if (activity_status !== "empty" && !content.trim()) {
        return res.status(400).json({
          message: "Materi atau agenda wajib diisi untuk status ini",
        });
      }

      const [agenda] = await Classagenda.findOrCreate({
        where: {
          classschedule_id: schedule.id,
          agenda_date: now.date,
        },
        defaults: {
          class_id: schedule.class_id,
          teacher_id: teacherId,
          activity_status,
          content: content.trim(),
        },
      });
      if (agenda.class_id !== schedule.class_id || agenda.teacher_id !== teacherId) {
        return res.status(409).json({
          message: "Data agenda jadwal tidak konsisten; hubungi administrator",
        });
      }

      await agenda.update({
        activity_status,
        content: content.trim(),
      });
      res.json({
        message: "Agenda kelas berhasil disimpan",
        agenda_date: now.date,
        agenda,
      });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      next(error);
    }
  }
}

module.exports = ClassagendaController;
