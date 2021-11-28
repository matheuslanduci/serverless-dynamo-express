import { v4 as randomUUID } from 'uuid'
import dynamoDbClient, { AUTHORS_TABLE, BOOKS_TABLE } from '../db/dynamo'

import type {
  Book,
  BookInput,
  BookUpdateInput,
  BookWithAuthor,
} from '../entities/book'

export class BooksService {
  async findAll(): Promise<BookWithAuthor[]> {
    const books = await dynamoDbClient
      .scan({
        TableName: BOOKS_TABLE,
        ProjectionExpression: 'id, fullName, releaseDate, authorId',
      })
      .promise()

    const items = books.Items

    for (const book of items) {
      const author = await dynamoDbClient
        .get({
          TableName: AUTHORS_TABLE,
          Key: {
            id: book.authorId,
          },
          ProjectionExpression: 'id, fullName, country, birthDate',
        })
        .promise()

      book.author = author.Item
    }

    return items as BookWithAuthor[]
  }

  async findOne(id: string): Promise<BookWithAuthor> {
    const books = await dynamoDbClient
      .get({
        TableName: BOOKS_TABLE,
        Key: {
          id,
        },
        ProjectionExpression: 'id, fullName, releaseDate, authorId, #author',
        ExpressionAttributeNames: {
          '#author': 'author',
        },
      })
      .promise()

    const author = await dynamoDbClient
      .get({
        TableName: AUTHORS_TABLE,
        Key: {
          id: books.Item.authorId,
        },
        ProjectionExpression: 'id, fullName, country, birthDate',
      })
      .promise()

    const bookWithAuthor = {
      ...books.Item,
      author: author.Item,
    }

    return bookWithAuthor as BookWithAuthor
  }

  async findAllByAuthorId(authorId: string): Promise<Book[]> {
    const books = await dynamoDbClient
      .scan({
        TableName: BOOKS_TABLE,
        FilterExpression: 'authorId = :authorId',
        ExpressionAttributeValues: {
          ':authorId': authorId,
        },
      })
      .promise()

    return books.Items as Book[]
  }

  async create(book: BookInput): Promise<Book> {
    const createdBook = await dynamoDbClient
      .put({
        TableName: BOOKS_TABLE,
        Item: {
          id: randomUUID(),
          ...book,
        },
      })
      .promise()

    return createdBook.Attributes as Book
  }

  async update(id: string, book: BookUpdateInput): Promise<Book> {
    const updateExpresion = String('SET ').concat(
      Object.keys(book)
        .filter((key) => !!book[key])
        .map((key) => `${key} = :${key}`)
        .join(', ')
    )

    const expressionAttributeValues = Object.keys(book)
      .filter((key) => !!book[key])
      .reduce((acc, key) => {
        acc[`:${key}`] = book[key]

        return acc
      }, {})

    const updatedBook = await dynamoDbClient
      .update({
        TableName: BOOKS_TABLE,
        Key: {
          id,
        },
        UpdateExpression: updateExpresion,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise()

    return updatedBook.Attributes as Book
  }

  async delete(id: string): Promise<void> {
    await dynamoDbClient
      .delete({
        TableName: BOOKS_TABLE,
        Key: {
          id,
        },
      })
      .promise()
  }
}
