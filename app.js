import express from "express"
import movies from "./src/data/movies.json" assert { type: "json" }
import crypto from "node:crypto"
import cors from "cors"
import { validateMovie, validatePartialMovie } from "./src/scheme/movie.js"

const app = express()
app.disable("x-powered-by")

// res.header("Access-Control-Allow-Origin", "*") // Solving the CORS problem with this configuration, the "*" it's to refer taht the connection it allow it by any origin
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:5500",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:1234",
        "https://movies.com",
        "https://midu.dev",
      ]

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error("Not allowed by CORS"))
    },
  }),
)
const PORT = process.env.PORT ?? 1234
app.use(express.json())

/* const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:5500",
  "http://localhost:3000",
  "http://localhost:3001",
]

app.options("/movies/:id", (req, res) => {
  
  const origin = req.header("origin")
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin)
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATH, DELETE, OPTIONS",
    )
  }
}) */

// Get all movies
app.get("/movies", (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

// Get a movie by ID
app.get("/movies/:id", (req, res) => {
  const { id } = req.params
  const movie = movies.find((m) => m.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: "Movie not found" })
})

// Create a new movie
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  }

  movies.push(newMovie)
  res.status(201).json(movies)
})

// Delete a movie
app.delete("/movies/:id", (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: "Movie deleted" })
})

// Update a movie, just a field of movie's data
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((m) => m.id === id) // I've used the findIndex() method to have the index of the movie and, i'll know if the movie is in the DB.

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
