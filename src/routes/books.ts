import { Router } from 'express'
import { BooksController } from '../controllers/books'

const router = Router()
const booksController = new BooksController()

router.get('/', booksController.index)
router.get('/author/:id', booksController.showAuthorBooks)
router.get('/:id', booksController.show)
router.post('/', booksController.store)
router.patch('/:id', booksController.update)
router.delete('/:id', booksController.destroy)

export default router
