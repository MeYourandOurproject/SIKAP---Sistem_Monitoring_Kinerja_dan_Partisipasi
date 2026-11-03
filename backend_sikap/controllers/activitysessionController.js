const {
  Activitysession,
  Activity,
  Teacherassignment,
  Teacher,
  Activityateacherattendance,
  User,
  Academicperiod,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

function formatDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

class ActivitysessionController {
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

      const academicPeriod = await Academicperiod.findByPk(1);
      if (!academicPeriod) {
        return res.status(500).json({ message: "Periode akademik belum diatur" });
      }

      const assignments = await Teacherassignment.findAll({
        where: { teacher_id: user.teacher_id },
        include: [
          {
            model: Activity,
            attributes: ["id", "name", "type", "description", "target_type"],
          },
        ],
      });
      const relevantAssignments = assignments.filter(
        (assignment) =>
          assignment.Activity?.type !== "routine" ||
          (assignment.academic_year === academicPeriod.academic_year &&
            assignment.semester === academicPeriod.semester),
      );
      const assignedActivityIds = [
        ...new Set(relevantAssignments.map((assignment) => assignment.activity_id)),
      ];

      const sessions = await Activitysession.findAll({
        where: { date: { [Op.not]: null } },
        include: [
          {
            model: Activity,
            attributes: ["id", "name", "type", "description", "target_type"],
            where: {
              [Op.or]: [
                { target_type: "all_teachers" },
                { id: { [Op.in]: assignedActivityIds } },
              ],
            },
          },
        ],
        order: [
          ["date", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      const currentPeriodSessions = sessions.filter(
        (session) =>
          session.Activity?.type !== "routine" ||
          (session.academic_year === academicPeriod.academic_year &&
            session.semester === academicPeriod.semester),
      );

      const sessionIds = currentPeriodSessions.map((session) => session.id);
      const attendanceRecords = sessionIds.length
        ? await Activityateacherattendance.findAll({
            where: {
              session_id: { [Op.in]: sessionIds },
              teacher_id: user.teacher_id,
            },
            attributes: [
              "id",
              "session_id",
              "status",
              "notes",
              "createdAt",
              "updatedAt",
            ],
          })
        : [];
      const attendanceBySession = new Map(
        attendanceRecords.map((record) => [
          record.session_id,
          record.toJSON(),
        ]),
      );

      const scheduledSessions = currentPeriodSessions.map((session) => ({
        ...session.toJSON(),
        date: formatDateOnly(session.date),
        attendance: attendanceBySession.get(session.id) || null,
      }));

      const existingScheduleKeys = new Set(
        scheduledSessions.map(
          (session) =>
            `${session.activity_id}:${formatDateOnly(session.date)}:${session.session || ""}`,
        ),
      );
      const today = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Jakarta",
      });
      const [year, month, day] = today.split("-").map(Number);
      const todayWeekday = new Date(
        Date.UTC(year, month - 1, day),
      ).getUTCDay();
      const weekdayNumbers = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      relevantAssignments.forEach((assignment) => {
        const activity = assignment.Activity;
        const scheduledWeekday = weekdayNumbers[assignment.day_of_week];
        if (
          !activity ||
          activity.type !== "routine" ||
          scheduledWeekday === undefined ||
          !assignment.session
        ) {
          return;
        }

        const daysUntil = (scheduledWeekday - todayWeekday + 7) % 7;
        const scheduledDate = new Date(
          Date.UTC(year, month - 1, day + daysUntil),
        )
          .toISOString()
          .slice(0, 10);
        const scheduleKey = `${assignment.activity_id}:${scheduledDate}:${assignment.session}`;
        if (existingScheduleKeys.has(scheduleKey)) return;

        existingScheduleKeys.add(scheduleKey);
        scheduledSessions.push({
          id: `planned-${assignment.id}-${scheduledDate}`,
          activity_id: assignment.activity_id,
          date: scheduledDate,
          session: assignment.session,
          start_time: activity.start_time || null,
          end_time: activity.end_time || null,
          Activity: activity.toJSON(),
          attendance: null,
        });
      });

      scheduledSessions.sort((left, right) =>
        formatDateOnly(right.date).localeCompare(formatDateOnly(left.date)),
      );
      res.json(scheduledSessions);
    } catch (error) {
      next(error);
    }
  }

  // 1. Membuka atau membuat sesi hari ini secara otomatis (On-Demand)
  static async openOrCreateTodaySession(req, res, next) {
    try {
      const { activity_id, pic_teacher_id } = req.body;

      // Mendapatkan tanggal lokal WIB (Asia/Jakarta) dengan format YYYY-MM-DD
      const today = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Jakarta",
      });

      if (!activity_id) {
        return res.status(400).json({ message: "activity_id is required" });
      }

      const activity = await Activity.findByPk(activity_id, {
        include: [
          { model: Activitysession },
          { model: Teacherassignment },
        ],
      });

      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      const academicPeriod = await Academicperiod.findByPk(1);
      if (!academicPeriod) {
        return res.status(500).json({ message: "Periode akademik belum diatur" });
      }

      const relevantAssignments =
        activity.type === "routine"
          ? activity.Teacherassignments?.filter(
              (item) =>
                item.academic_year === academicPeriod.academic_year &&
                item.semester === academicPeriod.semester,
            ) || []
          : activity.Teacherassignments || [];
      const configuredSession =
        activity.Activitysessions?.find((item) => {
          if (
            activity.type === "routine" &&
            (item.academic_year !== academicPeriod.academic_year ||
              item.semester !== academicPeriod.semester)
          ) {
            return false;
          }
          if (!item.date) return true;
          return new Date(item.date).toLocaleDateString("sv-SE", {
            timeZone: "Asia/Jakarta",
          }) === today;
        })?.session ||
        relevantAssignments.find((item) => item.session)?.session;

      if (!configuredSession) {
        return res.status(400).json({
          message: "Session belum ditentukan pada activity",
        });
      }

      const existingSession = activity.Activitysessions?.find(
        (item) =>
          item.date &&
          new Date(item.date).toLocaleDateString("sv-SE", {
            timeZone: "Asia/Jakarta",
          }) === today &&
          item.session === configuredSession &&
          (activity.type !== "routine" ||
            (item.academic_year === academicPeriod.academic_year &&
              item.semester === academicPeriod.semester)),
      );

      const resolvedPicTeacherId =
        pic_teacher_id ||
        activity.pic_teacher_id ||
        existingSession?.pic_teacher_id;

      if (!resolvedPicTeacherId) {
        return res.status(400).json({
          message: "pic_teacher_id is required to open a session",
        });
      }

      const picTeacher = await Teacher.findByPk(resolvedPicTeacherId);
      if (!picTeacher) {
        return res.status(400).json({ message: "PIC guru tidak ditemukan" });
      }

      const [activeSession, created] = existingSession
        ? [existingSession, false]
        : await Activitysession.findOrCreate({
            where: {
              activity_id,
              date: today,
              session: configuredSession,
              academic_year: academicPeriod.academic_year,
              semester:
                activity.type === "routine" ? academicPeriod.semester : null,
            },
            defaults: {
              activity_id,
              pic_teacher_id: resolvedPicTeacherId,
              academic_year: academicPeriod.academic_year,
              semester:
                activity.type === "routine" ? academicPeriod.semester : null,
              date: today,
              session: configuredSession,
              notes: "Sesi harian otomatis",
            },
            include: [{ model: Activity }],
          });

      res.json({
        message: created
          ? "Sesi baru berhasil dibuka"
          : "Sesi hari ini sudah tersedia",
        session: activeSession,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Ambil daftar sesi yang aktif/berlangsung hari ini
  // static async getActiveSessions(req, res, next) {
  //   try {
  //     const today = new Date().toISOString().split("T")[0];

  //     const activeSessions = await Activitysession.findAll({
  //       where: {
  //         [Op.or]: [
  //           sequelize.where(
  //             sequelize.fn("DATE", sequelize.col("Activitysession.date")),
  //             today,
  //           ),
  //           { date: null },
  //         ],
  //       },
  //       include: [
  //         {
  //           model: Activity,
  //           attributes: ["id", "name", "type", "target_type"],
  //         },
  //         {
  //           model: Teacher,
  //           attributes: ["id", "name", "nip"],
  //         },
  //       ],
  //       order: [["createdAt", "DESC"]],
  //     });

  //     res.json(activeSessions);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getActiveSessions(req, res, next) {
    try {
      // const today = new Date().toISOString().split("T")[0];
      const today = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Jakarta",
      });
      const academicPeriod = await Academicperiod.findByPk(1);
      if (!academicPeriod) {
        return res.status(500).json({ message: "Periode akademik belum diatur" });
      }


      const activeSessions = await Activitysession.findAll({
        attributes: ["id", "activity_id", "session", "date", "academic_year", "semester"],
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn("DATE", sequelize.col("Activitysession.date")),
              today,
            ),
            { date: null },
          ],
        },
        include: [
          {
            model: Activity,
            attributes: ["name", "target_type", "type"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Flatten objek agar menjadi 1 baris/level per item
      const formattedResponse = activeSessions
        .filter(
          (item) =>
            item.Activity?.type !== "routine" ||
            (item.academic_year === academicPeriod.academic_year &&
              item.semester === academicPeriod.semester),
        )
        .map((item) => ({
        id: item.id,
        activity_id: item.Activity?.id || item.activity_id,
        session: item.session,
        date: item.date,
        activity_name: item.Activity?.name || null,
        target_type: item.Activity?.target_type || null,
        // semester: item.Activity?.semester || null,
        }));

      res.json(formattedResponse);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const data = await Activitysession.findAll({
        include: [{ model: Activity }, { model: Teacher }],
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getAttendanceHistory(req, res, next) {
    try {
      const { start_date, end_date, teacher_id, activity_id, activity_type } =
        req.query;
      const isValidDate = (value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
        const date = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === value;
      };

      if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({
          message: "Tanggal mulai dan tanggal selesai harus valid",
        });
      }

      if (start_date > end_date) {
        return res.status(400).json({
          message: "Tanggal mulai tidak boleh melewati tanggal selesai",
        });
      }

      const rangeInDays =
        (Date.parse(`${end_date}T00:00:00.000Z`) -
          Date.parse(`${start_date}T00:00:00.000Z`)) /
        86_400_000;
      if (rangeInDays > 90) {
        return res.status(400).json({
          message: "Periode riwayat maksimal 90 hari",
        });
      }

      if (teacher_id && (!/^\d+$/.test(teacher_id) || Number(teacher_id) < 1)) {
        return res.status(400).json({ message: "Filter guru tidak valid" });
      }
      if (activity_id && (!/^\d+$/.test(activity_id) || Number(activity_id) < 1)) {
        return res.status(400).json({ message: "Filter kegiatan tidak valid" });
      }
      if (activity_type && !["routine", "tentative"].includes(activity_type)) {
        return res.status(400).json({ message: "Jenis kegiatan tidak valid" });
      }

      const activityWhere = {};
      if (activity_id) activityWhere.id = Number(activity_id);
      if (activity_type) activityWhere.type = activity_type;

      const attendanceWhere = {};
      if (teacher_id) attendanceWhere.teacher_id = Number(teacher_id);

      const records = await Activityateacherattendance.findAll({
        where: attendanceWhere,
        attributes: ["id", "status", "notes", "createdAt", "updatedAt"],
        include: [
          {
            model: Teacher,
            required: true,
            attributes: ["id", "name", "nip"],
          },
          {
            model: Activitysession,
            required: true,
            attributes: [
              "id",
              "activity_id",
              "date",
              "session",
              "start_time",
              "end_time",
            ],
            where: {
              date: { [Op.between]: [start_date, end_date] },
            },
            include: [
              {
                model: Activity,
                required: true,
                attributes: ["id", "name", "type", "target_type"],
                where: activityWhere,
              },
            ],
          },
        ],
        order: [
          [{ model: Activitysession }, "date", "DESC"],
          ["updatedAt", "DESC"],
        ],
      });

      res.json(
        records.map((record) => {
          const item = record.toJSON();
          const session = item.Activitysession;
          return {
            id: item.id,
            status: item.status || "present",
            notes: item.notes || "",
            created_at: item.createdAt,
            updated_at: item.updatedAt,
            teacher: item.Teacher,
            session_id: session.id,
            date: formatDateOnly(session.date),
            session: session.session,
            start_time: session.start_time,
            end_time: session.end_time,
            activity_id: session.Activity.id,
            activity_name: session.Activity.name,
            activity_type: session.Activity.type,
            target_type: session.Activity.target_type,
          };
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Activitysession.findByPk(id, {
        include: [{ model: Activity }, { model: Teacher }],
      });
      if (!data)
        return res.status(404).json({ message: "Activitysession not found" });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const payload = req.body;
      const item = await Activitysession.create(payload);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Activitysession.findByPk(id);
      if (!item)
        return res.status(404).json({ message: "Activitysession not found" });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Activitysession.findByPk(id);
      if (!item)
        return res.status(404).json({ message: "Activitysession not found" });
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // 1. GET LEMBAR ABSENSI (GET /api/activitysessions/:id/attendances)
  // =========================================================================
  static async getAttendances(req, res, next) {
    try {
      const { id } = req.params;

      // 1. Ambil data Sesi beserta Induk Activity
      const session = await Activitysession.findByPk(id, {
        include: [{ model: Activity }],
      });

      if (!session) {
        return res
          .status(404)
          .json({ message: "Sesi kegiatan tidak ditemukan" });
      }

      const activity = session.Activity;
      let targetTeachers = [];
      const academicPeriod = await Academicperiod.findByPk(1);
      if (!academicPeriod) {
        return res.status(500).json({ message: "Periode akademik belum diatur" });
      }

      // 2. Tentukan Daftar Guru Wajib Hadir
      if (activity.target_type === "all_teachers") {
        targetTeachers = await Teacher.findAll({
          where: { status: "active" },
          attributes: ["id", "name", "nip", "nuptk"],
          order: [["name", "ASC"]],
        });
      } else {
        // Jika assigned_teachers, filter berdasarkan activity_id & session
        const assignments = await Teacherassignment.findAll({
          where: {
            activity_id: activity.id,
            session: session.session, // Filter sesuai sesi harian yang dibuka
            ...(activity.type === "routine"
              ? {
                  academic_year:
                    session.academic_year || academicPeriod.academic_year,
                  semester: session.semester || academicPeriod.semester,
                }
              : {}),
          },
          include: [
            {
              model: Teacher,
              where: { status: "active" },
              attributes: ["id", "name", "nip", "nuptk"],
            },
          ],
        });

        targetTeachers = assignments.map((a) => a.Teacher).filter(Boolean);
      }

      // 3. Ambil data presensi yang sudah tersimpan di database
      const existingAttendances = await Activityateacherattendance.findAll({
        where: { session_id: id },
      });

      const attendanceMap = new Map();
      existingAttendances.forEach((att) => {
        attendanceMap.set(att.teacher_id, att);
      });

      // 4. Format List untuk UI Frontend / Postman
      const formattedList = targetTeachers.map((teacher) => {
        const saved = attendanceMap.get(teacher.id);
        return {
          teacher_id: teacher.id,
          name: teacher.name,
          nip: teacher.nip,
          status: saved ? saved.status : "present", // Default 'present' jika belum diisi
          notes: saved ? saved.notes : "",
          is_saved: !!saved, // Penanda apakah data ini baru atau sudah di-db
        };
      });

      res.json({
        session_id: Number(id),
        activity_name: activity.name,
        target_type: activity.target_type,
        date: session.date,
        session: session.session,
        total_teachers: formattedList.length,
        attendances: formattedList,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // 2. SIMPAN/UPDATE ABSENSI BULK (POST /api/activitysessions/:id/attendances)
  // =========================================================================
  static async saveAttendances(req, res, next) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const { id: session_id } = req.params;
      const { attendances } = req.body;

      if (!Array.isArray(attendances) || attendances.length === 0) {
        return res.status(400).json({
          message:
            "Payload attendances harus berupa array dan tidak boleh kosong",
        });
      }

      // 1. Susun record HANYA untuk guru yang ada di payload req.body
      const recordsToUpsert = attendances.map((item) => ({
        session_id: Number(session_id),
        teacher_id: Number(item.teacher_id),
        status: item.status || "present",
        notes: item.notes || null,
      }));

      // 2. Upsert HANYA data yang dikirim (tidak menyentuh guru lain)
      await Activityateacherattendance.bulkCreate(recordsToUpsert, {
        updateOnDuplicate: ["status", "notes", "updatedAt"],
        transaction,
      });

      await transaction.commit();

      res.json({
        success: true,
        message: `Berhasil memperbarui ${recordsToUpsert.length} presensi guru`,
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      next(error);
    }
  }

  // POST /api/activitysessions/:id/attendance-single
  static async saveSingleAttendance(req, res, next) {
    try {
      const { id: session_id } = req.params;
      const { teacher_id, status = "present", notes } = req.body;

      if (!teacher_id) {
        return res.status(400).json({ message: "teacher_id is required" });
      }

      // Upsert 1 record guru secara spesifik
      const [record] = await Activityateacherattendance.upsert({
        session_id: Number(session_id),
        teacher_id: Number(teacher_id),
        status,
        notes: notes || (status === "present" ? "Scan Sidik Jari" : null),
      });

      res.json({
        success: true,
        message: `Presensi guru ID ${teacher_id} berhasil dicatat`,
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivitysessionController;
