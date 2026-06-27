const express = require('express');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const teacherRouter = require('./teacherRouter');
const studentRouter = require('./studentRouter');
const classRouter = require('./classRouter');
const subjectRouter = require('./subjectRouter');
const scheduleRouter = require('./scheduleRouter');
const activityRouter = require('./activityRouter');
const attendanceRouter = require('./attendanceRouter');
const participationRouter = require('./participationRouter');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/teachers', teacherRouter);
router.use('/students', studentRouter);
router.use('/classes', classRouter);
router.use('/subjects', subjectRouter);
router.use('/schedules', scheduleRouter);
router.use('/activities', activityRouter);
router.use('/attendance-validations', attendanceRouter);
router.use('/participation-validations', participationRouter);

module.exports = router;
