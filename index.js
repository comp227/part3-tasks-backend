const http = require('http')

let tasks = [
    {
        id: 1,
        content: "Wash the dishes",
        date: "2023-01-10T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Take out the trash",
        date: "2023-01-10T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "Buy salty snacks",
        date: "2023-01-10T19:20:14.298Z",
        important: true
    }
]

const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(tasks))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)