const {
  Activity,
  Teacher,
  Teacherassignment,
  Activitysession,
  Activityateacherattendance,
  Academicperiod,
  sequelize,
} = require("../models");
const { getActivityStatus } = require("../utils/statusHelper");

function validateActivityTimes(startTime, endTime) {
  if (!startTime && !endTime) return null;
  if (!startTime || !endTime) {
    return "Jam mulai dan jam selesai harus diisi berpasangan";
  }
  const toMinutes = (value) => {
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;
    const [hours, minutes, seconds = "0"] = value.split(":").map(Number);
    if (hours > 23 || minutes > 59 || seconds > 59) return null;
    return hours * 60 + minutes + seconds / 60;
  };
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  if (startMinutes === null || endMinutes === null) {
    return "Format jam kegiatan tidak valid";
  }
  if (startMinutes >= endMinutes) {
    return "Jam selesai harus setelah jam mulai";
  }
  return null;
}

class ActivityController {
  static async getAll(req, res, next) {
    try {
      const data = await Activity.findAll({
        include: [
          { model: Teacherassignment, include: [Teacher] },
          { model: Activitysession },
        ],
      });

      // Sisipkan status dinamis ke setiap item
      const formattedData = data.map((item) => {
        const json = item.toJSON();
        json.status = getActivityStatus(json);
        return json;
      });

      res.json(formattedData);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Activity.findByPk(id, {
        include: [
          { model: Teacherassignment, include: [Teacher] },
          { model: Activitysession },
        ],
      });

      if (!data) return res.status(404).json({ message: "Activity not found" });

      const json = data.toJSON();
      json.status = getActivityStatus(json);

      res.json(json);
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // 1. CREATE KEGIATAN TENTATIVE
  // =========================================================================
  static async createTentative(req, res, next) {
    let transaction;
    try {
      const {
        name,
        date,
        responsiblePerson,
        description,
        target_type,
        pic_teacher_id,
        semester, // Root level
        day_of_week, // Root level
        session, // Root level
        session_time,
        start_time,
        end_time,
        assignments,
      } = req.body;

      const timeError = validateActivityTimes(start_time, end_time);
      if (timeError) return res.status(400).json({ message: timeError });

      transaction = await sequelize.transaction();
      const academicPeriod = await Academicperiod.findByPk(1, { transaction });
      if (!academicPeriod) throw new Error("Periode akademik belum diatur");
      const todayWib = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Asia/Jakarta",
      });

      let teacherName = responsiblePerson || null;
      if (pic_teacher_id) {
        const teacher = await Teacher.findByPk(pic_teacher_id, { transaction });
        if (teacher) teacherName = teacher.name;
      }

      // 1. Buat Induk Activity
      const activity = await Activity.create(
        {
          name,
          type: "tentative",
          date: date || todayWib,
          responsiblePerson: teacherName,
          pic_teacher_id: pic_teacher_id || null,
          description,
          target_type: target_type || "all_teachers",
        },
        { transaction },
      );

      // 2. Buat Sesi Otomatis
      await Activitysession.create(
        {
          activity_id: activity.id,
          pic_teacher_id: pic_teacher_id || null,
          date: date || todayWib,
          session: session || session_time || "all_day",
          start_time: start_time || null,
          end_time: end_time || null,
          notes: `Sesi otomatis untuk kegiatan: ${name}`,
        },
        { transaction },
      );

      // 3. Simpan Penugasan Guru (Mengambil jadwal dari Root / Fallback)
      if (
        target_type === "assigned_teachers" &&
        Array.isArray(assignments) &&
        assignments.length > 0
      ) {
        const assignmentData = assignments.map((item) => {
          const isObject = typeof item === "object" && item !== null;
          const teacherId = isObject ? item.teacher_id : item;

          return {
            activity_id: activity.id,
            teacher_id: teacherId,
            academic_year: academicPeriod.academic_year,
            semester: (isObject && item.semester) || semester || null,
            day_of_week: (isObject && item.day_of_week) || day_of_week || null,
            session:
              (isObject && item.session) || session || session_time || null,
          };
        });

        await Teacherassignment.bulkCreate(assignmentData, { transaction });
      }

      await transaction.commit();

      const result = await Activity.findByPk(activity.id, {
        include: [
          {
            model: Teacherassignment,
            include: [{ model: Teacher, attributes: ["id", "name", "nip"] }],
          },
          { model: Activitysession },
        ],
      });

      const json = result.toJSON();
      json.status = getActivityStatus(json);

      res.status(201).json(json);
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      next(error);
    }
  }

  // =========================================================================
  // 2. CREATE KEGIATAN ROUTINE
  // =========================================================================
  static async createRoutine(req, res, next) {
    let transaction;
    try {
      const {
        name,
        responsiblePerson,
        description,
        target_type,
        pic_teacher_id,
        start_time,
        end_time,
        semester, // Root level
        day_of_week, // Root level
        session, // Root level
        assignments,
      } = req.body;

      const timeError = validateActivityTimes(start_time, end_time);
      if (timeError) return res.status(400).json({ message: timeError });

      transaction = await sequelize.transaction();
      const academicPeriod = await Academicperiod.findByPk(1, { transaction });
      if (!academicPeriod) throw new Error("Periode akademik belum diatur");
      if (target_type === "assigned_teachers" && !["odd", "even"].includes(semester)) {
        await transaction.rollback();
        transaction = null;
        return res.status(400).json({ message: "Semester penugasan tidak valid" });
      }
      if (
        target_type === "assigned_teachers" &&
        (!Array.isArray(assignments) || assignments.length === 0)
      ) {
        await transaction.rollback();
        transaction = null;
        return res.status(400).json({ message: "Pilih minimal satu guru untuk kegiatan ini" });
      }
      let teacherName = responsiblePerson || null;
      if (pic_teacher_id) {
        const teacher = await Teacher.findByPk(pic_teacher_id, { transaction });
        if (teacher) teacherName = teacher.name;
      }

      // 1. Buat Induk Activity
      const activity = await Activity.create(
        {
          name,
          type: "routine",
          date: null,
          start_time: start_time || null,
          end_time: end_time || null,
          responsiblePerson: teacherName,
          pic_teacher_id: pic_teacher_id || null,
          description,
          target_type: target_type || "all_teachers",
        },
        { transaction },
      );

      // 2. Simpan Penugasan Guru (Mewariskan atribut root level)
      if (
        target_type === "assigned_teachers" &&
        Array.isArray(assignments) &&
        assignments.length > 0
      ) {
        const assignmentData = assignments.map((item) => {
          const isObject = typeof item === "object" && item !== null;
          const teacherId = isObject ? item.teacher_id : item;

          return {
            activity_id: activity.id,
            teacher_id: teacherId,
            academic_year: academicPeriod.academic_year,
            semester,
            day_of_week: (isObject && item.day_of_week) || day_of_week || null,
            session: (isObject && item.session) || session || null,
          };
        });

        await Teacherassignment.bulkCreate(assignmentData, { transaction });
      }

      await transaction.commit();

      const result = await Activity.findByPk(activity.id, {
        include: [
          {
            model: Teacherassignment,
            include: [{ model: Teacher, attributes: ["id", "name", "nip"] }],
          },
        ],
      });

      const json = result.toJSON();
      json.status = getActivityStatus(json);

      res.status(201).json(json);
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      next(error);
    }
  }

  static async update(req, res, next) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const { id } = req.params;
      const activity = await Activity.findByPk(id, { transaction });
      if (!activity) {
        await transaction.rollback();
        transaction = null;
        return res.status(404).json({ message: "Activity not found" });
      }

      const {
        start_time,
        end_time,
        session_time,
        assignments,
        target_type,
      } = req.body;
      const activityPayload = { ...req.body };
      delete activityPayload.session_time;
      delete activityPayload.assignments;
      delete activityPayload.semester;
      delete activityPayload.day_of_week;
      if (activity.type === "routine") delete activityPayload.session;
      if (activity.type !== "routine") {
        delete activityPayload.start_time;
        delete activityPayload.end_time;
      }
      const timeError = validateActivityTimes(start_time, end_time);
      if (timeError) {
        await transaction.rollback();
        transaction = null;
        return res.status(400).json({ message: timeError });
      }

      const effectiveTargetType = target_type || activity.target_type;
      const hasAssignmentInput = Object.hasOwn(req.body, "assignments");
      const shouldUpdateAssignments =
        hasAssignmentInput ||
        (Object.hasOwn(req.body, "target_type") &&
          (effectiveTargetType !== activity.target_type ||
            effectiveTargetType === "all_teachers"));
      if (!["all_teachers", "assigned_teachers"].includes(effectiveTargetType)) {
        await transaction.rollback();
        transaction = null;
        return res.status(400).json({ message: "Target guru kegiatan tidak valid" });
      }

      let assignmentData = [];
      let assignmentAcademicYear = null;
      if (
        shouldUpdateAssignments &&
        effectiveTargetType === "assigned_teachers"
      ) {
        if (!Array.isArray(assignments) || assignments.length === 0) {
          await transaction.rollback();
          transaction = null;
          return res.status(400).json({
            message: "Pilih minimal satu guru untuk kegiatan ini",
          });
        }

        const hasInvalidTeacherId = assignments.some((item) => {
          const isObject = typeof item === "object" && item !== null;
          const teacherId = Number(isObject ? item.teacher_id : item);
          return !Number.isInteger(teacherId) || teacherId <= 0;
        });
        if (hasInvalidTeacherId) {
          await transaction.rollback();
          transaction = null;
          return res.status(400).json({
            message: "ID guru yang ditugaskan tidak valid",
          });
        }

        const academicPeriod = await Academicperiod.findByPk(1, { transaction });
        if (!academicPeriod) {
          await transaction.rollback();
          transaction = null;
          return res.status(400).json({ message: "Periode akademik belum diatur" });
        }
        assignmentAcademicYear = academicPeriod.academic_year;
        if (
          activity.type === "routine" &&
          !["odd", "even"].includes(req.body.semester)
        ) {
          await transaction.rollback();
          transaction = null;
          return res.status(400).json({ message: "Semester penugasan tidak valid" });
        }

        assignmentData = assignments.map((item) => {
          const isObject = typeof item === "object" && item !== null;
          const teacherId = Number(isObject ? item.teacher_id : item);
          return {
            activity_id: activity.id,
            teacher_id: teacherId,
            academic_year: assignmentAcademicYear,
            semester:
              activity.type === "routine"
                ? req.body.semester
                : (isObject && item.semester) || req.body.semester || null,
            day_of_week:
              (isObject && item.day_of_week) || req.body.day_of_week || null,
            session: (isObject && item.session) || req.body.session || null,
          };
        });
      }

      await activity.update(activityPayload, { transaction });

      if (
        activity.type !== "routine" &&
        (Object.hasOwn(req.body, "start_time") ||
          Object.hasOwn(req.body, "end_time") ||
          Object.hasOwn(req.body, "session_time"))
      ) {
        const activitySession = await Activitysession.findOne({
          where: { activity_id: activity.id },
          order: [["id", "ASC"]],
          transaction,
        });
        if (activitySession) {
          await activitySession.update({
            ...(Object.hasOwn(req.body, "start_time")
              ? { start_time: start_time || null }
              : {}),
            ...(Object.hasOwn(req.body, "end_time")
              ? { end_time: end_time || null }
              : {}),
            ...(Object.hasOwn(req.body, "session_time")
              ? { session: session_time }
              : {}),
            ...(Object.hasOwn(activityPayload, "date")
              ? { date: activityPayload.date }
              : {}),
            ...(Object.hasOwn(activityPayload, "pic_teacher_id")
              ? { pic_teacher_id: activityPayload.pic_teacher_id }
              : {}),
          }, { transaction });
        }
      }

      if (shouldUpdateAssignments) {
        const assignmentWhere = { activity_id: activity.id };
        if (
          activity.type === "routine" &&
          effectiveTargetType === "assigned_teachers"
        ) {
          assignmentWhere.academic_year = assignmentAcademicYear;
          assignmentWhere.semester = req.body.semester;
        }
        await Teacherassignment.destroy({ where: assignmentWhere, transaction });
        if (effectiveTargetType === "assigned_teachers") {
          await Teacherassignment.bulkCreate(assignmentData, { transaction });
        }
      }

      await transaction.commit();
      transaction = null;
      const updatedActivity = await Activity.findByPk(activity.id, {
        include: [
          { model: Teacherassignment, include: [Teacher] },
          { model: Activitysession },
        ],
      });
      const json = updatedActivity.toJSON();
      json.status = getActivityStatus(json);

      res.json(json);
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      next(error);
    }
  }

  static async delete(req, res, next) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const { id } = req.params;
      const activity = await Activity.findByPk(id, { transaction });
      if (!activity) {
        await transaction.rollback();
        transaction = null;
        return res.status(404).json({ message: "Activity not found" });
      }

      const sessions = await Activitysession.findAll({
        where: { activity_id: id },
        attributes: ["id"],
        transaction,
      });
      const sessionIds = sessions.map((session) => session.id);

      if (sessionIds.length) {
        await Activityateacherattendance.destroy({
          where: { session_id: sessionIds },
          transaction,
        });
      }

      await Activitysession.destroy({
        where: { activity_id: id },
        transaction,
      });

      await Teacherassignment.destroy({
        where: { activity_id: id },
        transaction,
      });

      await activity.destroy({ transaction });

      await transaction.commit();
      transaction = null;
      res.status(204).send();
    } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      next(error);
    }
  }
}

module.exports = ActivityController;
