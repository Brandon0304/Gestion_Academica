import { Router } from 'express'
import { studentsController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()

router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/students:
 *   get:
 *     tags: [Students]
 *     summary: Listar estudiantes (paginado)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de estudiantes
 *   post:
 *     tags: [Students]
 *     summary: Crear estudiante
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, documentId]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               documentId: { type: string }
 *     responses:
 *       201:
 *         description: Estudiante creado
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (req, res, next) => studentsController.list(req, res, next))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (req, res, next) => studentsController.get(req, res, next))
router.post('/', roleMiddleware('admin', 'secretary'), (req, res, next) => studentsController.create(req, res, next))
router.put('/:id', roleMiddleware('admin', 'secretary'), (req, res, next) => studentsController.update(req, res, next))
router.delete('/:id', roleMiddleware('admin'), (req, res, next) => studentsController.delete(req, res, next))

export const studentRoutes = router
