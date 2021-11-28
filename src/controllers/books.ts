import { Request, Response } from 'express'
import dynamoDbClient from '../db/dynamo'
import { BooksService } from '../services/books'

const booksService = new BooksService(dynamoDbClient)

export class BooksController {
  async index(req: Request, res: Response) {
    const books = await booksService.findAll()

    res.json(books)
  }

  async show(req: Request, res: Response) {
    const book = await booksService.findOne(req.params.id)

    res.json(book)
  }

  async showAuthorBooks(req: Request, res: Response) {
    const books = await booksService.findAllByAuthorId(req.params.id)

    res.json(books)
  }

  async store(req: Request, res: Response) {
    const { fullName, authorId, releaseDate } = req.body

    const book = await booksService.create({
      fullName,
      authorId,
      releaseDate,
    })

    res.json(book)
  }

  async update(req: Request, res: Response) {
    const id = req.params.id
    const { fullName, releaseDate } = req.body

    const book = await booksService.update(id, { fullName, releaseDate })

    res.json(book)
  }

  async destroy(req: Request, res: Response) {
    await booksService.delete(req.params.id)

    res.json({ message: 'Book deleted successfully.' })
  }
}
