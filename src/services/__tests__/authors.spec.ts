import { AuthorsService } from '../authors'
import { authors, authorsWithBooks } from './utils/authors'
import { books } from './utils/books'
import dynamoDbClientMock from './utils/dynamoDbClientMock'

describe('AuthorsService', () => {
  const dynamoDbClient: typeof dynamoDbClientMock = dynamoDbClientMock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all authors', async () => {
    dynamoDbClient.scan = jest.fn().mockImplementation((params) => {
      if (params.TableName === process.env.AUTHORS_TABLE) {
        return {
          promise: () => Promise.resolve({ Items: authors }),
        }
      }

      if (params.TableName === process.env.BOOKS_TABLE) {
        return {
          promise: () =>
            Promise.resolve({
              Items: books.filter(
                (book) =>
                  book.authorId ===
                  params.ExpressionAttributeValues[':authorId']
              ),
            }),
        }
      }
    })

    const authorsService = new AuthorsService(dynamoDbClient)

    const authorsList = await authorsService.findAll()

    expect(authorsList).toEqual(authorsWithBooks)
  })

  it('should return an author', async () => {
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
              Items: books.filter((book) => (book.authorId = params.Key.id)),
            }),
        }
      }
    })

    const authorsService = new AuthorsService(dynamoDbClient)

    const author = await authorsService.findOne('1')

    expect(author).toEqual(authorsWithBooks[0])
  })

  it('should create an author', async () => {
    const authorToCreate = {
      fullName: 'John Doe',
      birthDate: '2000-01-01',
      country: 'USA',
    }

    dynamoDbClient.put = jest.fn().mockImplementation((params) => {
      if (params.TableName === process.env.AUTHORS_TABLE) {
        return {
          promise: () =>
            Promise.resolve({
              Attributes: {
                id: '1',
                ...authorToCreate,
              },
            }),
        }
      }
    })

    const authorsService = new AuthorsService(dynamoDbClient)

    const author = await authorsService.create(authorToCreate)

    expect(author).toEqual({
      id: '1',
      fullName: 'John Doe',
      birthDate: '2000-01-01',
      country: 'USA',
    })

    expect(dynamoDbClient.put).toHaveBeenCalledTimes(1)
    expect(dynamoDbClient.put).toHaveBeenCalledWith({
      TableName: process.env.AUTHORS_TABLE,
      Item: {
        id: expect.any(String),
        fullName: 'John Doe',
        birthDate: '2000-01-01',
        country: 'USA',
      },
      ReturnValues: 'ALL_OLD',
    })
  })

  it('should update an author', async () => {
    const authorToUpdate = {
      fullName: 'John Doe',
      birthDate: '2000-01-01',
      country: 'USA',
    }

    dynamoDbClient.update = jest.fn().mockImplementation((params) => {
      if (params.TableName === process.env.AUTHORS_TABLE) {
        return {
          promise: () =>
            Promise.resolve({
              Attributes: {
                id: '1',
                ...authorToUpdate,
              },
            }),
        }
      }
    })

    const authorsService = new AuthorsService(dynamoDbClient)

    const author = await authorsService.update('1', authorToUpdate)

    expect(author).toEqual({
      id: '1',
      fullName: 'John Doe',
      birthDate: '2000-01-01',
      country: 'USA',
    })

    expect(dynamoDbClient.update).toHaveBeenCalledTimes(1)
    expect(dynamoDbClient.update).toHaveBeenCalledWith({
      TableName: process.env.AUTHORS_TABLE,
      Key: {
        id: '1',
      },
      UpdateExpression:
        'SET fullName = :fullName, birthDate = :birthDate, country = :country',
      ExpressionAttributeValues: {
        ':fullName': 'John Doe',
        ':birthDate': '2000-01-01',
        ':country': 'USA',
      },
      ReturnValues: 'ALL_NEW',
    })
  })

  it('should delete an author', async () => {
    dynamoDbClient.delete = jest.fn().mockImplementation((params) => {
      return {
        promise: () => Promise.resolve({}),
      }
    })

    const authorsService = new AuthorsService(dynamoDbClient)

    await authorsService.delete('1')

    expect(dynamoDbClient.delete).toHaveBeenCalledTimes(1)
    expect(dynamoDbClient.delete).toHaveBeenCalledWith({
      TableName: process.env.AUTHORS_TABLE,
      Key: {
        id: '1',
      },
    })
  })
})
