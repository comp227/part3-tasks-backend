const tasksRouter = require('express').Router();
const Task = require('../models/task');
const User = require('../models/user');

tasksRouter.get('/', async (request, response) => {
    const tasks = await Task
        .find({})
        .populate('user', { username: 1, name: 1 });
    response.json(tasks);
});

tasksRouter.get('/:id', async (request, response) => {
    const task = await Task.findById(request.params.id);
    if (task) {
        response.json(task);
    } else {
        response.status(404).end();
    }
});

tasksRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findById(body.userId);

    const task = new Task({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id,
    });

    const savedTask = await task.save();
    user.tasks = user.tasks.concat(savedTask._id);
    await user.save();

    response.status(201).json(savedTask);
});

tasksRouter.delete('/:id', async (request, response) => {
    await Task.findByIdAndRemove(request.params.id);
    response.status(204).end();
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