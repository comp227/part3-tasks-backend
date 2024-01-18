const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
const Task = require('./models/task')

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

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello COMP227!</h1>')
})

app.get('/api/tasks', (request, response) => {
    Task.find({}).then(tasks => {
        response.json(tasks)
    })
})

app.get('/api/tasks/:id', (request, response) => {
    Task.findById(request.params.id).then(task => {
        response.json(task)
    })
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

    const task = new Task({
        content: body.content,
        important: Boolean(body.important) || false,
        date: new Date(),
    })

    task.save().then(savedTask => {
        response.json(savedTask)
    })
})

app.delete('/api/tasks/:id', (request, response) => {
    const id = Number(request.params.id)
    tasks = tasks.filter(task => task.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
    next()
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})