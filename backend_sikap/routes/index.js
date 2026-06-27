const express = require("express");
const router = express.Router();

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const classRouter = require("./classRouter");
const classroomRouter = require("./classroomRouter");
const classscheduleRouter = require("./classscheduleRouter");
const classteacherattendanceRouter = require("./classteacherattendanceRouter");
const enrollmentRouter = require("./enrollmentRouter");
const subjectRouter = require("./subjectRouter");
const timeslotRouter = require("./timeslotRouter");
const teacherRouter = require("./teacherRouter");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/teachers", teacherRouter);
router.use("/classes", classRouter);
router.use("/classrooms", classroomRouter);
router.use("/classschedules", classscheduleRouter);
router.use("/classteacherattendances", classteacherattendanceRouter);
router.use("/enrollments", enrollmentRouter);
router.use("/subjects", subjectRouter);
router.use("/timeslots", timeslotRouter);

module.exports = router;
