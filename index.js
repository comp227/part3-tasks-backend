require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Task = require('./models/task')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

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

app.get('/api/tasks/:id', (request, response, next) => {
    Task.findById(request.params.id)
        .then(task => {
            if (task) {
                response.json(task)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/tasks', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const task = new Task({
        content: body.content,
        important: Boolean(body.important) || false,
        date: new Date().toISOString(),
    })

    task.save().then(savedTask => {
        response.json(savedTask)
    })
})

app.delete('/api/tasks/:id', (request, response, next) => {
    Task.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/tasks/:id', (request, response, next) => {
    const body = request.body

    const task = {
        content: body.content,
        important: body.important,
    }

    Task.findByIdAndUpdate(request.params.id, task, { new: true })
        .then(updatedTask => {
            response.json(updatedTask)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})