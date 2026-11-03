"use strict";

const {
  Classschedule,
  Student,
  Studentattendance,
  Timeslot,
  User,
  sequelize,
} = require("../models");

const attendanceStatuses = ["present", "permission", "sick", "absent"];

function getJakartaDateTime(date = new Date()) {
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

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

async function getAuthorizedCurrentSchedule(req, scheduleId) {
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

  const now = getJakartaDateTime();
  const start = schedule.startTimeslot?.start;
  const end = schedule.endTimeslot?.end;
  if (
    schedule.day !== now.day ||
    !start ||
    !end ||
    !(start <= now.time && now.time < end)
  ) {
    const error = new Error("Presensi hanya dapat diakses saat jadwal sedang berlangsung");
    error.status = 409;
    throw error;
  }

  return { schedule, attendanceDate: now.date, userId: req.user.id };
}

class StudentattendanceController {
  static async getForSchedule(req, res, next) {
    try {
      const { schedule, attendanceDate } = await getAuthorizedCurrentSchedule(
        req,
        req.params.scheduleId,
      );
      const [students, attendanceRecords] = await Promise.all([
        Student.findAll({
          where: { class_id: schedule.class_id, status: "active" },
          attributes: ["id", "nis", "nisn", "name"],
          order: [["name", "ASC"]],
        }),
        Studentattendance.findAll({
          where: {
            classschedule_id: schedule.id,
            attendance_date: attendanceDate,
          },
          attributes: ["student_id", "attendance_status"],
        }),
      ]);
      const attendanceByStudent = new Map(
        attendanceRecords.map((record) => [
          Number(record.student_id),
          record.attendance_status,
        ]),
      );

      res.json({
        schedule_id: schedule.id,
        attendance_date: attendanceDate,
        students: students.map((student) => ({
          ...student.toJSON(),
          attendance_status: attendanceByStudent.get(Number(student.id)) || null,
        })),
      });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      next(error);
    }
  }

  static async saveForSchedule(req, res, next) {
    try {
      const { schedule, attendanceDate, userId } = await getAuthorizedCurrentSchedule(
        req,
        req.params.scheduleId,
      );
      const attendance = req.body?.attendance;
      if (!Array.isArray(attendance)) {
        return res.status(400).json({ message: "attendance harus berupa array" });
      }

      const seenStudentIds = new Set();
      for (const record of attendance) {
        if (
          !record ||
          typeof record !== "object" ||
          !isPositiveInteger(record.student_id) ||
          seenStudentIds.has(Number(record.student_id))
        ) {
          return res.status(400).json({
            message: "Daftar presensi berisi ID siswa tidak valid atau duplikat",
          });
        }
        if (!attendanceStatuses.includes(record.attendance_status)) {
          return res.status(400).json({
            message: "Status presensi harus present, permission, sick, atau absent",
          });
        }
        seenStudentIds.add(Number(record.student_id));
      }

      const activeStudents = await Student.findAll({
        where: { class_id: schedule.class_id, status: "active" },
        attributes: ["id"],
      });
      const activeStudentIds = new Set(activeStudents.map(({ id }) => Number(id)));
      if (
        attendance.length !== activeStudentIds.size ||
        [...seenStudentIds].some((id) => !activeStudentIds.has(id))
      ) {
        return res.status(400).json({
          message: "Presensi harus mencakup seluruh siswa aktif pada kelas ini",
        });
      }

      const timestamp = new Date();
      await sequelize.transaction(async (transaction) => {
        if (attendance.length) {
          await Studentattendance.bulkCreate(
            attendance.map((record) => ({
              student_id: Number(record.student_id),
              classschedule_id: schedule.id,
              attendance_date: attendanceDate,
              attendance_status: record.attendance_status,
              marked_by: userId,
              createdAt: timestamp,
              updatedAt: timestamp,
            })),
            {
              transaction,
              updateOnDuplicate: ["attendance_status", "marked_by", "updatedAt"],
            },
          );
        }
      });

      res.json({
        message: "Presensi siswa berhasil disimpan",
        attendance_date: attendanceDate,
        saved_count: attendance.length,
      });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Presensi berubah secara bersamaan. Muat ulang data lalu coba kembali.",
        });
      }
      next(error);
    }
  }
}

module.exports = StudentattendanceController;
