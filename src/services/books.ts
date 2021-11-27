import dynamoDbClient, { BOOKS_TABLE } from '../db/dynamo'

import type {
  Book,
  BookInput,
  BookUpdateInput,
  BookWithAuthor,
} from '../entities/book'

export class BooksServices {
  async findAll(): Promise<BookWithAuthor[]> {
    const books = await dynamoDbClient
      .scan({
        TableName: BOOKS_TABLE,
        ProjectionExpression: 'id, name, releaseDate, authorId, #author',
        ExpressionAttributeNames: {
          '#author': 'author',
        },
      })
      .promise()

    return books.Items as BookWithAuthor[]
  }

  async findOne(id: string): Promise<BookWithAuthor> {
    const books = await dynamoDbClient
      .get({
        TableName: BOOKS_TABLE,
        Key: {
          id,
        },
        ProjectionExpression: 'id, name, releaseDate, authorId, #author',
        ExpressionAttributeNames: {
          '#author': 'author',
        },
      })
      .promise()

    return books.Item as BookWithAuthor
  }

  async findAllByAuthorId(authorId: string): Promise<Book[]> {
    const books = await dynamoDbClient
      .query({
        TableName: BOOKS_TABLE,
        KeyConditionExpression: 'authorId = :authorId',
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
        Item: book,
      })
      .promise()

    return createdBook.Attributes as Book
  }

  async update(id: string, book: BookUpdateInput): Promise<Book> {
    const updateExpresion = Object.keys(book)
      .map((key) => `${key} = :${key}`)
      .join(', ')

    const expressionAttributeValues = Object.keys(book).reduce((acc, key) => {
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
