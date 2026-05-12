import { Router } from 'express'
import { usersController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

router.get('/', roleMiddleware('admin'), (req, res, next) => usersController.list(req, res, next))
router.patch('/:id', roleMiddleware('admin'), (req, res, next) => usersController.update(req, res, next))

export const userRoutes = router
