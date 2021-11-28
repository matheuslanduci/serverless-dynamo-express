import { Author } from './author'

export interface Book {
  id: string
  fullName: string
  releaseDate: string
  authorId: string
}

export interface BookInput {
  fullName: string
  releaseDate: string
  authorId: string
}

export interface BookUpdateInput {
  fullName?: string
  releaseDate?: string
}

export interface BookWithAuthor extends Book {
  author: Author
}
