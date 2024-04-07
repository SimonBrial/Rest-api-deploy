import http from "node:http" // Http protocol
import fs from "node:fs"

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  if (req.url === "/") {
    res.statusCode = 200 // OK
    res.end("Welcome to my home page!")
  } else if (req.url === "/img-gallery.jpg") {
    res.setHeader("Content-Type", "image/jpg")
    /* fs.readFile("./img/img-test.jpg", (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end("<h1>500 Internal Server Error</h1>")
      } else {
        res.setHeader("Content-Type", "image/jpg")
        res.end(data)
      }
    }) */
  } else if (req.url === "/contacto") {
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server listening on PORT http://localhost:${desiredPort}`)
})

// The browser makes two request, that is the reason of the two response.
