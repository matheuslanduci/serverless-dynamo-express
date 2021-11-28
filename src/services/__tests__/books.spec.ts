import { BooksService } from '../books'
import { authors } from './utils/authors'
import { books, booksWithAuthor } from './utils/books'
import dynamoDbClientMock from './utils/dynamoDbClientMock'

describe('BooksService', () => {
  const dynamoDbClient: typeof dynamoDbClientMock = dynamoDbClientMock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all books', async () => {
    dynamoDbClient.scan = jest.fn().mockImplementation((params) => {
      return {
        promise: () => Promise.resolve({ Items: books }),
      }
    })

    dynamoDbClient.get = jest.fn().mockImplementation((params) => {
      return {
        promise: () =>
          Promise.resolve({
            Item: authors.find((author) => author.id === params.Key.id),
          }),
      }
    })

    const booksService = new BooksService(dynamoDbClient)

    const booksList = await booksService.findAll()

    expect(booksList).toEqual(booksWithAuthor)
  })

  it('should return a book', async () => {
    dynamoDbClient.get = jest.fn().mockImplementation((params) => {
      if (params.TableName === process.env.AUTHORS_TABLE) {
        return {
          promise: () =>
            Promise.resolve({
              Item: authors.find((author) => author.id === params.Key.id),
            }),
        }
      }

      if (params.TableName === process.env.BOOKS_TABLE) {
        return {
          promise: () =>
            Promise.resolve({
              Item: books.find((book) => book.id === params.Key.id),
            }),
        }
      }
    })

    const booksService = new BooksService(dynamoDbClient)

    const book = await booksService.findOne('1')

    expect(book).toEqual(booksWithAuthor[0])
  })

  it('should return the books by author', async () => {
    dynamoDbClient.scan = jest.fn().mockImplementation((params) => {
      return {
        promise: () =>
          Promise.resolve({
            Items: books.filter(
              (book) =>
                book.authorId === params.ExpressionAttributeValues[':authorId']
            ),
          }),
      }
    })

    const booksService = new BooksService(dynamoDbClient)

    const booksList = await booksService.findAllByAuthorId('1')

    expect(booksList).toEqual(books.filter((book) => book.authorId === '1'))
  })

  it('should create a book', async () => {
    const bookToCreate = {
      authorId: '1',
      fullName: 'Book 1',
      releaseDate: '2020',
    }

    dynamoDbClient.put = jest.fn().mockImplementation((params) => {
      return {
        promise: () =>
          Promise.resolve({
            Attributes: {
              id: '1',
              ...bookToCreate,
            },
          }),
      }
    })

    const booksService = new BooksService(dynamoDbClient)

    const book = await booksService.create(bookToCreate)

    expect(book).toEqual({
      id: '1',
      ...bookToCreate,
    })

    expect(dynamoDbClient.put).toHaveBeenCalledTimes(1)
    expect(dynamoDbClient.put).toHaveBeenCalledWith({
      TableName: process.env.BOOKS_TABLE,
      Item: {
        id: expect.any(String),
        ...bookToCreate,
      },
      ReturnValues: 'ALL_OLD',
    })
  })

  it('should delete a book', async () => {
    dynamoDbClient.delete = jest.fn().mockImplementation((params) => {
      return {
        promise: () => Promise.resolve({}),
      }
    })

    const booksService = new BooksService(dynamoDbClient)

    await booksService.delete('1')

    expect(dynamoDbClient.delete).toHaveBeenCalledTimes(1)
    expect(dynamoDbClient.delete).toHaveBeenCalledWith({
      TableName: process.env.BOOKS_TABLE,
      Key: {
        id: '1',
      },
    })
  })
})
