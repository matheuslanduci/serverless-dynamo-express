import { Book } from './book'

export interface Author {
  id: string
  fullName: string
  country: string
  birthDate: string
}

export interface AuthorInput {
  fullName: string
  country: string
  birthDate: string
}

export interface AuthorUpdateInput {
  fullName?: string
  country?: string
  birthDate?: string
}

export interface AuthorWithBooks extends Author {
  books: Book[]
}
