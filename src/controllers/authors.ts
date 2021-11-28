import { Request, Response } from 'express'
import dynamoDbClient from '../db/dynamo'
import { AuthorsService } from '../services/authors'

const authorsService = new AuthorsService(dynamoDbClient)

export class AuthorsController {
  async index(_req: Request, res: Response) {
    const authors = await authorsService.findAll()

    res.json(authors)
  }

  async show(req: Request, res: Response) {
    const author = await authorsService.findOne(req.params.id)

    res.json(author)
  }

  async store(req: Request, res: Response) {
    const { fullName, country, birthDate } = req.body

    const author = await authorsService.create({
      fullName,
      birthDate,
      country,
    })

    res.json(author)
  }

  async update(req: Request, res: Response) {
    const id = req.params.id
    const { fullName, country, birthDate } = req.body

    const author = await authorsService.update(id, {
      fullName: fullName || null,
      birthDate: birthDate || null,
      country: country || null,
    })

    res.json(author)
  }

  async destroy(req: Request, res: Response) {
    await authorsService.delete(req.params.id)

    res.json({
      message: 'Author deleted successfully.',
    })
  }
}
