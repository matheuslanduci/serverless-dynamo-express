import express from 'express'
import authorsRoutes from './routes/authors'
import booksRoutes from './routes/books'

const app = express()

app.use(express.json())

app.use('/authors', authorsRoutes)
app.use('/books', booksRoutes)

export default app
