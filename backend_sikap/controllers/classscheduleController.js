const {
  Classschedule,
  Timeslot,
  Class,
  Teacher,
  Classroom,
  Subject,
  User,
  Student,
  Studentattendance,
  Classagenda,
  sequelize,
} = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { getApplicationNow } = require("../utils/applicationClock");

const dayNamesByUtcDay = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

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
    dayName: values.weekday,
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}:${values.second}`,
  };
}

class ClassscheduleController {
  static async getAll(req, res, next) {
    try {
      const items = await Classschedule.findAll({
        include: [
          { model: Class, attributes: ["id", "class_name"] },
          { model: Teacher, attributes: ["id", "name"] },
          { model: Subject, attributes: ["id", "subject_name"] },
          { model: Classroom, attributes: ["id", "classroom_name"] },
          {
            model: Timeslot,
            as: "startTimeslot",
            attributes: ["id", "start", "end"],
          },
          {
            model: Timeslot,
            as: "endTimeslot",
            attributes: ["id", "start", "end"],
          },
        ],
        order: [["day", "ASC"]],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getForCurrentTeacher(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["teacher_id"],
      });

      if (!user?.teacher_id) {
        return res.status(403).json({
          message: "Akun guru belum terhubung dengan data guru",
        });
      }

      const schedules = await Classschedule.findAll({
        where: { teacher_id: user.teacher_id },
        include: [
          { model: Class, attributes: ["id", "class_name"] },
          { model: Subject, attributes: ["id", "subject_name"] },
          { model: Classroom, attributes: ["id", "classroom_name"] },
          {
            model: Timeslot,
            as: "startTimeslot",
            attributes: ["start"],
          },
          {
            model: Timeslot,
            as: "endTimeslot",
            attributes: ["end"],
          },
        ],
      });

      const dayOrder = [
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Minggu",
      ];
      schedules.sort((left, right) => {
        const dayDifference =
          dayOrder.indexOf(left.day) - dayOrder.indexOf(right.day);
        if (dayDifference !== 0) return dayDifference;
        return (left.startTimeslot?.start || "").localeCompare(
          right.startTimeslot?.start || "",
        );
      });

      res.json(schedules);
    } catch (error) {
      next(error);
    }
  }

  static async getTodaySchedules(req, res, next) {
    try {
      const user_id = req.user.id;

      const student_class = await Class.findOne({
        where: {
          classleader_id: user_id,
        },
      });

      if (!student_class) {
        return res.status(404).json({
          message: "Class not found for this user",
        });
      }

      const today = getApplicationNow();

      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      // sementara
      const dayName = "Senin";
      // nanti
      // const dayName = days[today.getDay()];

      // Production (WIB)
      // const nowTime = today.toLocaleTimeString("en-GB", {
      //   timeZone: "Asia/Jakarta",
      //   hour12: false,
      // });

      // Testing
      const nowTime = "09:30:00";

      const todayDate = today.toISOString().slice(0, 10);

      const sql = `
      SELECT
          cs.id,
          t.id AS teacher_id,
          t.name AS teacher_name,
          s.subject_name,
          cr.classroom_name,
          ts.start,
          te.end,
          CASE WHEN ta.count > 0 THEN 1 ELSE 0 END AS validated
      FROM Classschedules cs
      JOIN Teachers t
          ON cs.teacher_id=t.id
      JOIN Subjects s
          ON cs.subject_id=s.id
      JOIN Classrooms cr
          ON cs.classroom_id=cr.id
      JOIN Timeslots ts
          ON cs.start_timeslot_id=ts.id
      JOIN Timeslots te
          ON cs.end_timeslot_id=te.id
      LEFT JOIN (
        SELECT classschedule_id, COUNT(*) AS count
        FROM Classteacherattendances
        WHERE DATE(date) = DATE(?)
        GROUP BY classschedule_id
      ) ta ON ta.classschedule_id = cs.id
      WHERE
          cs.class_id=?
      AND
          cs.day=?
      ORDER BY ts.start
    `;

      const rows = await sequelize.query(sql, {
        replacements: [todayDate, student_class.id, dayName],
        type: Sequelize.QueryTypes.SELECT,
      });

      let current = null;

      const schedules = rows.map((item) => {
        let status = "upcoming";

        if (nowTime > item.end) {
          status = "finished";
        } else if (nowTime >= item.start && nowTime <= item.end) {
          status = "current";
        }

        const schedule = {
          ...item,
          status,
          validated: !!item.validated,
        };

        if (status === "current") {
          current = schedule;
        }

        return schedule;
      });

      res.json({
        class: student_class.class_name,
        current,
        data: schedules,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrent(req, res, next) {
    try {
      const { dayName, date: todayDate, time } = getJakartaDateTime();

      if (dayName === "Sabtu" || dayName === "Minggu") {
        return res.json({
          total: 0,
          data: [],
          note: "Hari libur, tidak ada KBM",
        });
      }

      const schedules = await Classschedule.findAll({
        where: { day: dayName },
        include: [
          { model: Class, attributes: ["id", "class_name"] },
          { model: Teacher, attributes: ["id", "name"] },
          { model: Subject, attributes: ["id", "subject_name"] },
          { model: Classroom, attributes: ["id", "classroom_name"] },
          { model: Timeslot, as: "startTimeslot", attributes: ["start"] },
          { model: Timeslot, as: "endTimeslot", attributes: ["end"] },
        ],
        order: [[{ model: Timeslot, as: "startTimeslot" }, "start", "ASC"]],
      });
      const visibleSchedules = schedules.filter((schedule) =>
        schedule.startTimeslot?.start &&
        schedule.endTimeslot?.end &&
        schedule.startTimeslot.start <= time &&
        time < schedule.endTimeslot.end,
      );
      if (visibleSchedules.length === 0) {
        return res.json({ total: 0, data: [] });
      }


      const scheduleIds = visibleSchedules.map((schedule) => schedule.id);
      const classIds = [...new Set(visibleSchedules.map((schedule) => schedule.class_id))];
      const [activeStudents, attendanceRecords, agendas] = await Promise.all([
        Student.findAll({
          where: { class_id: classIds, status: "active" },
          attributes: ["id", "class_id"],
        }),
        Studentattendance.findAll({
          where: { classschedule_id: scheduleIds, attendance_date: todayDate },
          include: [{
            model: Student,
            as: "student",
            attributes: ["id", "name", "nis"],
          }],
        }),
        Classagenda.findAll({
          where: { classschedule_id: scheduleIds, agenda_date: todayDate },
          attributes: ["classschedule_id", "activity_status", "content", "updatedAt"],
        }),
      ]);

      const activeStudentCounts = new Map();
      activeStudents.forEach((student) => {
        const classId = Number(student.class_id);
        activeStudentCounts.set(classId, (activeStudentCounts.get(classId) || 0) + 1);
      });
      const attendanceBySchedule = new Map();
      attendanceRecords.forEach((record) => {
        const scheduleId = Number(record.classschedule_id);
        const records = attendanceBySchedule.get(scheduleId) || [];
        records.push(record);
        attendanceBySchedule.set(scheduleId, records);
      });
      const agendaBySchedule = new Map(
        agendas.map((agenda) => [Number(agenda.classschedule_id), agenda]),
      );

      const mapped = visibleSchedules.map((schedule) => {
        const scheduleId = Number(schedule.id);
        const classId = Number(schedule.class_id);
        const activeStudentCount = activeStudentCounts.get(classId) || 0;
        const records = attendanceBySchedule.get(scheduleId) || [];
        const agenda = agendaBySchedule.get(scheduleId);
        const presentCount = records.filter(
          (record) => record.attendance_status === "present",
        ).length;
        const nonPresentStudents = records
          .filter((record) => record.attendance_status !== "present")
          .map((record) => ({
            student_id: record.student_id,
            name: record.student?.name || "Siswa",
            nis: record.student?.nis || null,
            attendance_status: record.attendance_status,
          }));
        const validated =
          activeStudentCount > 0 &&
          records.length === activeStudentCount &&
          Boolean(agenda);
        const scheduleEnded =
          schedule.endTimeslot?.end && schedule.endTimeslot.end <= time;
        const activityStatus = validated
          ? agenda.activity_status
          : scheduleEnded
            ? "empty"
            : null;
        const status = validated
          ? activityStatus === "teaching"
            ? "Mengajar"
            : activityStatus === "assignment"
              ? "Tugas"
              : "Kelas Kosong"
          : scheduleEnded
            ? "Kelas Kosong"
            : "Belum divalidasi";

        return {
          schedule_id: scheduleId,
          class_id: classId,
          class_name: schedule.Class?.class_name || "-",
          teacher_name: schedule.Teacher?.name || "-",
          subject_name: schedule.Subject?.subject_name || "-",
          classroom_name: schedule.Classroom?.classroom_name || "-",
          start: schedule.startTimeslot?.start || null,
          end: schedule.endTimeslot?.end || null,
          agenda_date: todayDate,
          agenda_status: agenda?.activity_status || null,
          agenda_content: agenda?.content || "",
          agenda_updated_at: agenda?.updatedAt || null,
          activity_status: activityStatus,
          status,
          validated,
          validation_status: validated ? "Tervalidasi" : "Belum divalidasi",
          student_count: activeStudentCount,
          attendance_count: records.length,
          present_count: presentCount,
          non_present_count: nonPresentStudents.length,
          non_present_students: nonPresentStudents,
          color: !validated
            ? scheduleEnded
              ? "red"
              : "blue"
            : activityStatus === "teaching"
              ? "green"
              : activityStatus === "assignment"
                ? "yellow"
                : "red",
        };
      });

      res.json({
        total: mapped.length,
        data: mapped,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const { date: todayDate, time } = getJakartaDateTime();
      const startDate = req.query.start_date;
      const endDate = req.query.end_date;
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      const isValidDate = (value) => {
        if (!datePattern.test(value)) return false;
        const parsed = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(parsed.getTime()) &&
          parsed.toISOString().slice(0, 10) === value;
      };

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "Tanggal awal dan akhir periode wajib diisi",
        });
      }

      if (!isValidDate(startDate) || !isValidDate(endDate) || startDate > endDate) {
        return res.status(400).json({
          message: "Rentang tanggal riwayat tidak valid",
        });
      }

      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T00:00:00.000Z`);
      const rangeDays = Math.floor((end - start) / 86400000) + 1;
      if (rangeDays > 90) {
        return res.status(400).json({
          message: "Rentang riwayat maksimal 90 hari",
        });
      }
      if (endDate > todayDate) {
        return res.status(400).json({
          message: "Tanggal akhir riwayat tidak boleh melewati hari ini",
        });
      }

      const allSchedules = await Classschedule.findAll({
        attributes: ["id", "class_id", "teacher_id", "day"],
        include: [
          { model: Class, attributes: ["id", "class_name"] },
          { model: Teacher, attributes: ["id", "name"] },
        ],
      });
      const classes = new Map();
      const teachers = new Map();
      allSchedules.forEach((schedule) => {
        if (schedule.Class) {
          classes.set(Number(schedule.Class.id), {
            id: Number(schedule.Class.id),
            name: schedule.Class.class_name,
          });
        }
        if (schedule.Teacher) {
          teachers.set(Number(schedule.Teacher.id), {
            id: Number(schedule.Teacher.id),
            name: schedule.Teacher.name,
          });
        }
      });

      const filters = {};
      if (req.query.class_id) {
        if (!/^[1-9]\d*$/.test(req.query.class_id)) {
          return res.status(400).json({ message: "Filter kelas tidak valid" });
        }
        filters.class_id = Number(req.query.class_id);
      }
      if (req.query.teacher_id) {
        if (!/^[1-9]\d*$/.test(req.query.teacher_id)) {
          return res.status(400).json({ message: "Filter guru tidak valid" });
        }
        filters.teacher_id = Number(req.query.teacher_id);
      }

      const filterOptions = {
        classes: [...classes.values()].sort((a, b) => a.name.localeCompare(b.name)),
        teachers: [...teachers.values()].sort((a, b) => a.name.localeCompare(b.name)),
      };
      if (!filters.class_id && !filters.teacher_id) {
        return res.json({
          total: 0,
          data: [],
          filters: filterOptions,
          start_date: startDate,
          end_date: endDate,
        });
      }

      const days = new Set();
      for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
        days.add(dayNamesByUtcDay[cursor.getUTCDay()]);
      }
      const scheduleWhere = { day: { [Op.in]: [...days] } };
      if (filters.class_id) scheduleWhere.class_id = filters.class_id;
      if (filters.teacher_id) scheduleWhere.teacher_id = filters.teacher_id;

      const schedules = await Classschedule.findAll({
        where: scheduleWhere,
        include: [
          { model: Class, attributes: ["id", "class_name"] },
          { model: Teacher, attributes: ["id", "name"] },
          { model: Subject, attributes: ["id", "subject_name"] },
          { model: Classroom, attributes: ["id", "classroom_name"] },
          { model: Timeslot, as: "startTimeslot", attributes: ["start"] },
          { model: Timeslot, as: "endTimeslot", attributes: ["end"] },
        ],
        order: [[{ model: Timeslot, as: "startTimeslot" }, "start", "ASC"]],
      });

      const occurrences = [];
      schedules.forEach((schedule) => {
        for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
          const date = cursor.toISOString().slice(0, 10);
          if (dayNamesByUtcDay[cursor.getUTCDay()] !== schedule.day) continue;
          if (
            date === todayDate &&
            (!schedule.startTimeslot?.start || schedule.startTimeslot.start > time)
          ) continue;
          occurrences.push({ schedule, date });
        }
      });

      if (!occurrences.length) {
        return res.json({
          total: 0,
          data: [],
          filters: filterOptions,
          start_date: startDate,
          end_date: endDate,
        });
      }

      const scheduleIds = [...new Set(occurrences.map(({ schedule }) => schedule.id))];
      const classIds = [...new Set(occurrences.map(({ schedule }) => schedule.class_id))];
      const [activeStudents, attendanceRecords, agendas] = await Promise.all([
        Student.findAll({
          where: { class_id: classIds, status: "active" },
          attributes: ["id", "class_id"],
        }),
        Studentattendance.findAll({
          where: {
            classschedule_id: scheduleIds,
            attendance_date: { [Op.between]: [startDate, endDate] },
          },
          include: [{
            model: Student,
            as: "student",
            attributes: ["id", "name", "nis"],
          }],
        }),
        Classagenda.findAll({
          where: {
            classschedule_id: scheduleIds,
            agenda_date: { [Op.between]: [startDate, endDate] },
          },
          attributes: ["classschedule_id", "agenda_date", "activity_status", "content", "updatedAt"],
        }),
      ]);

      const activeStudentCounts = new Map();
      activeStudents.forEach((student) => {
        const classId = Number(student.class_id);
        activeStudentCounts.set(classId, (activeStudentCounts.get(classId) || 0) + 1);
      });
      const attendanceByOccurrence = new Map();
      attendanceRecords.forEach((record) => {
        const key = `${record.classschedule_id}:${record.attendance_date}`;
        const records = attendanceByOccurrence.get(key) || [];
        records.push(record);
        attendanceByOccurrence.set(key, records);
      });
      const agendaByOccurrence = new Map(
        agendas.map((agenda) => [
          `${agenda.classschedule_id}:${agenda.agenda_date}`,
          agenda,
        ]),
      );

      const data = occurrences.map(({ schedule, date }) => {
        const occurrenceKey = `${schedule.id}:${date}`;
        const records = attendanceByOccurrence.get(occurrenceKey) || [];
        const agenda = agendaByOccurrence.get(occurrenceKey);
        const studentCount = activeStudentCounts.get(Number(schedule.class_id)) || 0;
        const presentStudents = records.filter(
          (record) => record.attendance_status === "present",
        ).length;
        const nonPresentStudents = records
          .filter((record) => record.attendance_status !== "present")
          .map((record) => ({
            student_id: record.student_id,
            name: record.student?.name || "Siswa",
            nis: record.student?.nis || null,
            attendance_status: record.attendance_status,
          }));
        const validated =
          studentCount > 0 &&
          records.length === studentCount &&
          Boolean(agenda);
        const scheduleEnded =
          date < todayDate ||
          (date === todayDate && schedule.endTimeslot?.end <= time);
        const hasValidationData = records.length > 0 || Boolean(agenda);
        const activityStatus = agenda?.activity_status || (records.length ? "attendance" : "empty");
        const status = agenda?.activity_status === "teaching"
          ? "Mengajar"
          : agenda?.activity_status === "assignment"
            ? "Tugas"
            : agenda?.activity_status === "empty" || (!hasValidationData && scheduleEnded)
              ? "Kelas Kosong"
              : hasValidationData
                ? "Presensi diisi"
                : "Belum divalidasi";

        if (date === todayDate && !scheduleEnded && !hasValidationData) {
          return null;
        }

        return {
          schedule_id: Number(schedule.id),
          class_id: Number(schedule.class_id),
          teacher_id: Number(schedule.teacher_id),
          class_name: schedule.Class?.class_name || "-",
          teacher_name: schedule.Teacher?.name || "-",
          subject_name: schedule.Subject?.subject_name || "-",
          classroom_name: schedule.Classroom?.classroom_name || "-",
          start: schedule.startTimeslot?.start || null,
          end: schedule.endTimeslot?.end || null,
          agenda_date: date,
          agenda_status: agenda?.activity_status || null,
          agenda_content: agenda?.content || "",
          agenda_updated_at: agenda?.updatedAt || null,
          activity_status: activityStatus,
          status,
          validated,
          validation_status: validated
            ? "Tervalidasi"
            : hasValidationData
              ? "Validasi sebagian"
              : "Tidak tervalidasi",
          student_count: studentCount,
          attendance_count: records.length,
          present_count: presentStudents,
          non_present_count: nonPresentStudents.length,
          non_present_students: nonPresentStudents,
          color: status === "Presensi diisi"
            ? "blue"
            : status === "Mengajar"
              ? "green"
              : status === "Tugas"
                ? "yellow"
                : "red",
        };
      }).filter(Boolean);
      data.sort((left, right) =>
        right.agenda_date.localeCompare(left.agenda_date) ||
        (left.start || "").localeCompare(right.start || ""),
      );

      res.json({
        total: data.length,
        data,
        filters: filterOptions,
        start_date: startDate,
        end_date: endDate,
      });
    } catch (error) {
      next(error);
    }
  }


  static async getById(req, res, next) {
    try {
      const item = await Classschedule.findByPk(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Classschedule not found" });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const item = await Classschedule.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const item = await Classschedule.findByPk(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Classschedule not found" });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const item = await Classschedule.findByPk(req.params.id);
      if (!item)
        return res.status(404).json({ message: "Classschedule not found" });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassscheduleController;
