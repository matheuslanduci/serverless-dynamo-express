import { Router } from 'express'
import { AuthorsController } from '../controllers/authors'

const router = Router()
const authorsController = new AuthorsController()

router.get('/', authorsController.index)
router.get('/:id', authorsController.show)
router.post('/', authorsController.store)
router.patch('/:id', authorsController.update)
router.delete('/:id', authorsController.destroy)

export default router
