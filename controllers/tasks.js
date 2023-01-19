const tasksRouter = require('express').Router();
const Task = require('../models/task');

tasksRouter.get('/', async (request, response) => {
    const tasks = await Task.find({});
    response.json(tasks);
});

tasksRouter.get('/:id', (request, response, next) => {
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

tasksRouter.post('/', (request, response, next) => {
    const body = request.body;

    const task = new Task({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    task.save()
        .then(savedTask => {
            response.json(savedTask);
        })
        .catch(error => next(error));
});

tasksRouter.delete('/:id', (request, response, next) => {
    Task.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

tasksRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const task = {
        content: body.content,
        important: body.important,
    };

    Task.findByIdAndUpdate(request.params.id, task, { new: true })
        .then(updatedTask => {
            response.json(updatedTask);
        })
        .catch(error => next(error));
});

module.exports = tasksRouter;