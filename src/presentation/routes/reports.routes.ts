import { Router } from 'express'
import { reportsController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/reports/students/{studentId}/history:
 *   get:
 *     tags: [Reports]
 *     summary: Historial académico del estudiante
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses: { 200: { description: Historial con cursos y calificaciones } }
 * /api/v1/reports/courses/{courseId}/grades:
 *   get:
 *     tags: [Reports]
 *     summary: Reporte de calificaciones del curso
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses: { 200: { description: Reporte con estudiantes y notas } }
 */
router.get('/students/:studentId/history', roleMiddleware('admin', 'directive', 'secretary', 'student'), (r, s, n) => reportsController.studentHistory(r, s, n))
router.get('/courses/:courseId/grades', roleMiddleware('admin', 'directive', 'teacher', 'secretary'), (r, s, n) => reportsController.courseReport(r, s, n))

export const reportRoutes = router
