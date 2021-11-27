import express from 'express'

const app = express()

app.use(express.json())

app.use('/authors', require('./routes/authors'))
app.use('/books', require('./routes/books'))

app.use((err, _req, res, next) => {
  if (err) {
    console.error(err)
    return res.status(400).json({ error: err.message })
  }

  next()
})

export default app
