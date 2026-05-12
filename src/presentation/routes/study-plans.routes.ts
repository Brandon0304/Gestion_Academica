import { Router } from 'express'
import { studyPlansController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/study-plans:
 *   get:
 *     tags: [Study Plans]
 *     summary: Listar planes de estudio
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de planes } }
 *   post:
 *     tags: [Study Plans]
 *     summary: Crear plan de estudio
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, year, totalCredits]
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               year: { type: integer }
 *               totalCredits: { type: integer }
 *     responses: { 201: { description: Plan creado } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => studyPlansController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => studyPlansController.get(r, s, n))
router.post('/', roleMiddleware('admin'), (r, s, n) => studyPlansController.create(r, s, n))
router.put('/:id', roleMiddleware('admin'), (r, s, n) => studyPlansController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => studyPlansController.delete(r, s, n))
export const studyPlanRoutes = router
