const tasksRouter = require("express").Router();
const Task = require("../models/task");

tasksRouter.get("/", async (request, response) => {
    const tasks = await Task.find({});
    response.json(tasks);
});

tasksRouter.get("/:id", async (request, response, next) => {
    try {
        const task = await Task.findById(request.params.id);
        if (task) {
            response.json(task);
        } else {
            response.status(404).end();
        }
    } catch(exception) {
        next(exception);
    }
});

tasksRouter.post("/", async (request, response, next) => {
    const body = request.body;

    const task = new Task({
        content: body.content,
        important: Boolean(body.important) || false,
        date: new Date(),
    });
    try {
        const savedTask = await task.save();
        response.status(201).json(savedTask);
    } catch(exception) {
        next(exception);
    }
});

tasksRouter.delete("/:id", async (request, response, next) => {
    try {
        await Task.findByIdAndDelete(request.params.id);
        response.status(204).end();
    } catch(exception) {
        next(exception);
    }
});

tasksRouter.put("/:id", (request, response, next) => {
    const body = request.body;

    const task = {
        content: body.content,
        important: Boolean(body.important),
    };

    Task.findByIdAndUpdate(request.params.id, task, { new: true })
        .then(updatedTask => {
            response.json(updatedTask);
        })
        .catch(error => next(error));
});

module.exports = tasksRouter;