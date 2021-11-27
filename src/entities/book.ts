import { Author } from './author'

export interface Book {
  id: string
  name: string
  releaseDate: string
  authorId: string
}

export interface BookInput {
  name: string
  releaseDate: string
  authorId: string
}

export interface BookUpdateInput {
  name?: string
  releaseDate?: string
}

export interface BookWithAuthor extends Book {
  author: Author
}
