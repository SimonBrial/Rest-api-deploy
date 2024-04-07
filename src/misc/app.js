import express from "express"
import ditto from "../data/ditto.json" assert { type: "json" }

const app = express()
app.disable("x-powered-by")
app.use(express.json()) // With this middleware, I could the same with the code that I was commented

const PORT = process.env.PORT || 1234

/* app.use((req, res, next) => {
  if (req.method !== "POST") return next()
  if (req.header["Content-Type"] !== "application/json") return next()

  let body = ""
  // Listing the data event
  // chunck === binary
  req.on("data", (chunk) => {
    body += chunk.toString()
  })
  req.on("end", () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    // Update the request and the data is placed the req.body object
    req.body = data
    next()
  })
}) */

app.get("/pokemon/ditto", (req, res) => {
  res.status(200).json(ditto)
})

app.post("/pokemon", (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send("404 Not found")
})

app.listen(PORT, (req, res) => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
