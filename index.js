const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('build'));
app.use(express.json());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(requestLogger);

app.use(cors());
const Task = require('./models/task');

app.get('/', (request, response) => {
    response.send('<h1>Hello COMP227!</h1>');
});

app.get('/api/tasks', (request, response) => {
    Task.find({}).then(tasks => {
        response.json(tasks);
    });
});

app.get('/api/tasks/:id', (request, response, next) => {
    Task.findById(request.params.id)
        .then(task => {
            if (task) {
                response.json(task);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.post('/api/tasks', (request, response, next) => {
    const body = request.body;

    const task = new Task({
        content: body.content,
        important: Boolean(body.important) || false,
        date: new Date(),
    });

    task.save()
        .then(savedTask => {
            response.json(savedTask);
        })
        .catch(error => next(error));
});

app.put('/api/tasks/:id', (request, response, next) => {
    const { content, important } = request.body;

    Task.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedTask => {
            response.json(updatedTask);
        })
        .catch(error => next(error));
});

app.delete('/api/tasks/:id', (request, response, next) => {
    Task.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'unknown endpoint' });
    next();
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});