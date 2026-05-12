import { Router } from 'express'
import { authRoutes } from './auth.routes.js'
import { userRoutes } from './users.routes.js'
import { studentRoutes } from './students.routes.js'
import { teacherRoutes } from './teachers.routes.js'
import { subjectRoutes } from './subjects.routes.js'
import { academicPeriodRoutes } from './academic-periods.routes.js'
import { classroomRoutes } from './classrooms.routes.js'
import { courseRoutes } from './courses.routes.js'
import { enrollmentRoutes } from './enrollments.routes.js'
import { gradeRoutes } from './grades.routes.js'
import { studyPlanRoutes } from './study-plans.routes.js'
import { reportRoutes } from './reports.routes.js'
import { timetableRoutes } from './timetable.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/students', studentRoutes)
router.use('/teachers', teacherRoutes)
router.use('/subjects', subjectRoutes)
router.use('/academic-periods', academicPeriodRoutes)
router.use('/classrooms', classroomRoutes)
router.use('/courses', courseRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/grades', gradeRoutes)
router.use('/study-plans', studyPlanRoutes)
router.use('/reports', reportRoutes)
router.use('/timetable', timetableRoutes)

export const apiRoutes = router
