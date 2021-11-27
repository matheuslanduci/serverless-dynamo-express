import dynamoDbClient, { AUTHORS_TABLE } from '../db/dynamo'

import type {
  Author,
  AuthorInput,
  AuthorUpdateInput,
  AuthorWithBooks,
} from '../entities/author'

export class AuthorsService {
  async findAll(): Promise<AuthorWithBooks[]> {
    const authors = await dynamoDbClient
      .scan({
        TableName: AUTHORS_TABLE,
        ProjectionExpression: 'id, name, country, birthDate, #books',
        ExpressionAttributeNames: {
          '#books': 'books',
        },
      })
      .promise()

    return authors.Items as AuthorWithBooks[]
  }

  async findOne(id: string): Promise<AuthorWithBooks> {
    const author = await dynamoDbClient
      .get({
        TableName: AUTHORS_TABLE,
        Key: {
          id,
        },
        ProjectionExpression: 'id, name, country, birthDate, #books',
        ExpressionAttributeNames: {
          '#books': 'books',
        },
      })
      .promise()

    return author.Item as AuthorWithBooks
  }

  async create(author: AuthorInput): Promise<Author> {
    const createdAuthor = await dynamoDbClient
      .put({
        TableName: AUTHORS_TABLE,
        Item: author,
      })
      .promise()

    return createdAuthor.Attributes as Author
  }

  async update(id: string, author: AuthorUpdateInput): Promise<Author> {    
    const updateExpresion = Object.keys(author)
      .map((key) => `${key} = :${key}`)
      .join(', ')

    const expressionAttributeValues = Object.keys(author).reduce((acc, key) => {
      acc[`:${key}`] = author[key]

      return acc
    }, {})

    const updatedAuthor = await dynamoDbClient
      .update({
        TableName: AUTHORS_TABLE,
        Key: {
          id,
        },
        UpdateExpression: updateExpresion,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise()

    return updatedAuthor.Attributes as Author
  }

  async delete(id: string): Promise<void> {
    await dynamoDbClient
      .delete({
        TableName: AUTHORS_TABLE,
        Key: {
          id,
        },
      })
      .promise()
  }
}
