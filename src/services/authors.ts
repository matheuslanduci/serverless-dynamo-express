import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 as randomUUID } from 'uuid'
import { AUTHORS_TABLE, BOOKS_TABLE } from '../db/dynamo'

import type {
  Author,
  AuthorInput,
  AuthorUpdateInput,
  AuthorWithBooks,
} from '../entities/author'

export class AuthorsService {
  constructor(private readonly dynamoDbClient: DocumentClient) {}

  async findAll(): Promise<AuthorWithBooks[]> {
    const authors = await this.dynamoDbClient
      .scan({
        TableName: AUTHORS_TABLE,
        ProjectionExpression: 'id, fullName, country, birthDate',
      })
      .promise()

    const items = authors.Items

    for (const author of items) {
      const authorWithBooks = await this.dynamoDbClient
        .scan({
          TableName: BOOKS_TABLE,
          FilterExpression: 'authorId = :authorId',
          ExpressionAttributeValues: {
            ':authorId': author.id,
          },
        })
        .promise()

      author.books = authorWithBooks.Items
    }

    return items as AuthorWithBooks[]
  }

  async findOne(id: string): Promise<AuthorWithBooks> {
    const author = await this.dynamoDbClient
      .get({
        TableName: AUTHORS_TABLE,
        Key: {
          id,
        },
        ProjectionExpression: 'id, fullName, country, birthDate',
      })
      .promise()

    const books = await this.dynamoDbClient
      .scan({
        TableName: BOOKS_TABLE,
        FilterExpression: 'authorId = :authorId',
        ExpressionAttributeValues: {
          ':authorId': id,
        },
      })
      .promise()

    const authorWithBooks = {
      ...author.Item,
      books: books.Items,
    } as AuthorWithBooks

    return authorWithBooks
  }

  async create(author: AuthorInput): Promise<Author> {
    const createdAuthor = await this.dynamoDbClient
      .put({
        TableName: AUTHORS_TABLE,
        Item: {
          id: randomUUID(),
          ...author,
        },
        ReturnValues: 'ALL_OLD',
      })
      .promise()

    return createdAuthor.Attributes as Author
  }

  async update(id: string, author: AuthorUpdateInput): Promise<Author> {
    const updateExpresion = String('SET ').concat(
      Object.keys(author)
        .filter((key) => !!author[key])
        .map((key) => `${key} = :${key}`)
        .join(', ')
    )

    const expressionAttributeValues = Object.keys(author)
      .filter((key) => !!author[key])
      .reduce((acc, key) => {
        acc[`:${key}`] = author[key]

        return acc
      }, {})

    const updatedAuthor = await this.dynamoDbClient
      .update({
        TableName: AUTHORS_TABLE,
        Key: {
          id,
        },
        UpdateExpression: updateExpresion,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise()

    return updatedAuthor.Attributes as Author
  }

  async delete(id: string): Promise<void> {
    await this.dynamoDbClient
      .delete({
        TableName: AUTHORS_TABLE,
        Key: {
          id,
        },
      })
      .promise()
  }
}
