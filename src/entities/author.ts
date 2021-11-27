import { Book } from './book'

export interface Author {
  id: string
  name: string
  country: string
  birthDate: string
}

export interface AuthorInput {
  name: string
  country: string
  birthDate: string
}

export interface AuthorUpdateInput {
  name?: string
  country?: string
  birthDate?: string
}

export interface AuthorWithBooks extends Author {
  books: Book[]
}
