import express from 'express'
import authorsRoutes from './routes/authors'
import booksRoutes from './routes/books'

const app = express()

app.use(express.json())

app.use('/authors', authorsRoutes)
app.use('/books', booksRoutes)

app.use((err, _req, res, next) => {
  if (err) {
    console.error(err)
    return res.status(400).json({ error: err.message })
  }

  next()
})

export default app
