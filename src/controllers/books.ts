import { Request, Response } from 'express'
import { BooksServices } from '../services/books'

export class BooksController {
  private readonly booksService: BooksServices

  constructor() {
    this.booksService = new BooksServices()
  }

  async index(req: Request, res: Response) {
    const books = await this.booksService.findAll()

    res.json(books)
  }

  async show(req: Request, res: Response) {
    const book = await this.booksService.findOne(req.params.id)

    if (!book) {
      throw new Error('Author not found with provided ID.')
    }

    res.json(book)
  }

  async showAuthorBooks(req: Request, res: Response) {
    const books = await this.booksService.findAllByAuthorId(req.params.id)

    res.json(books)
  }

  async store(req: Request, res: Response) {
    const { name, authorId, releaseDate } = req.body

    const book = await this.booksService.create({ name, authorId, releaseDate })

    res.json(book)
  }

  async update(req: Request, res: Response) {
    const id = req.params.id
    const { name, releaseDate } = req.body

    const book = await this.booksService.update(id, { name, releaseDate })

    res.json(book)
  }

  async destroy(req: Request, res: Response) {
    await this.booksService.delete(req.params.id)

    res.json({ message: 'Book deleted successfully.' })
  }
}
