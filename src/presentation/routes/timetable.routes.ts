import { Router } from 'express'
import { timetableController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

router.get('/students/:studentId', roleMiddleware('admin', 'secretary', 'student'), (r, s, n) => timetableController.studentTimetable(r, s, n))
router.get('/teachers/:teacherId', roleMiddleware('admin', 'secretary', 'teacher'), (r, s, n) => timetableController.teacherTimetable(r, s, n))

export const timetableRoutes = router
