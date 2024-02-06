const Task = require("../models/task");

const initialTasks = [
    {
        content: "Wash the dishes",
        date: new Date(),
        important: false
    },
    {
        content: "Take out the trash",
        date: new Date(),
        important: true
    }
];

const nonExistingId = async () => {
    const task = new Task({ content: "willremovethissoon", date: new Date() });
    await task.save();
    await task.deleteOne();

    return task._id.toString();
};

const tasksInDb = async () => {
    const tasks = await Task.find({});
    return tasks.map(task => task.toJSON());
};

module.exports = {
    initialTasks, nonExistingId, tasksInDb
};