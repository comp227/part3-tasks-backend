const express = require('express')
const app = express()

app.use(express.json())

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
    const id = Number(request.params.id)
    const task = tasks.find(task => task.id === id);
    if (task) {
        response.json(task)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = tasks.length > 0
        ? Math.max(...tasks.map(t => t.id))
        : 0
    return maxId + 1
}

app.post('/api/tasks', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const task = {
        id: generateId(),
        content: body.content,
        important: body.important || false,
        date: new Date().toISOString(),
    }

    tasks = tasks.concat(task)

    response.json(task)
})

app.delete('/api/tasks/:id', (request, response) => {
    const id = Number(request.params.id)
    tasks = tasks.filter(task => task.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})