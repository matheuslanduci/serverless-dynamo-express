import { Request, Response } from 'express'
import { AuthorsService } from '../services/authors'

export class AuthorsController {
  private readonly authorsService: AuthorsService

  constructor() {
    this.authorsService = new AuthorsService()
  }

  async index(_req: Request, res: Response) {
    const authors = await this.authorsService.findAll()

    res.json(authors)
  }

  async show(req: Request, res: Response) {
    const author = await this.authorsService.findOne(req.params.id)

    if (!author) {
      throw new Error('Author not found with provided ID.')
    }

    res.json(author)
  }

  async store(req: Request, res: Response) {
    const { name, country, birthDate } = req.body

    const author = await this.authorsService.create({
      name,
      birthDate,
      country,
    })

    res.json(author)
  }

  async update(req: Request, res: Response) {
    const id = req.params.id
    const { name, country, birthDate } = req.body

    const author = await this.authorsService.update(id, {
      name,
      birthDate,
      country,
    })

    res.json(author)
  }

  async destroy(req: Request, res: Response) {
    await this.authorsService.delete(req.params.id)

    res.json({
      message: 'Author deleted successfully.',
    })
  }
}
