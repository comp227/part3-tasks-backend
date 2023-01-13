const express = require('express')
const app = express()

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

app.get('/', (request, response) => {
    response.send('<h1>Hello COMP227!</h1>')
})

app.get('/api/tasks', (request, response) => {
    response.json(tasks)
})

app.get('/api/tasks/:id', (request, response) => {
    const id = request.params.id
    console.log('id =', id)
    const task = tasks.find(task => task.id === id)
    console.log('task =', task)
    response.json(task)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})