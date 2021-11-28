export const authors = [
  {
    id: '1',
    fullName: 'John Doe',
    birthDate: '01/01/1990',
    country: 'United States',
  },
  {
    id: '2',
    fullName: 'Jane Doe',
    birthDate: '01/01/1990',
    country: 'United States',
  },
]

export const authorsWithBooks = [
  {
    id: '1',
    fullName: 'John Doe',
    birthDate: '01/01/1990',
    country: 'United States',
    books: [
      {
        id: '1',
        fullName: 'Book 1',
        releaseDate: '01/01/2020',
        authorId: '1',
      },
    ],
  },
  {
    id: '2',
    fullName: 'Jane Doe',
    birthDate: '01/01/1990',
    country: 'United States',
    books: [
      {
        id: '2',
        fullName: 'Book 2',
        releaseDate: '01/01/2020',
        authorId: '2',
      },
    ],
  },
]
