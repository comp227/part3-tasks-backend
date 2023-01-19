const Task = require('../models/task');
const User = require('../models/user');

const initialTasks = [
    {
        content: 'Wash the dishes',
        date: new Date(),
        important: false
    },
    {
        content: 'Take out the trash',
        date: new Date(),
        important: true
    }
];

const nonExistingId = async () => {
    const task = new Task({ content: 'willremovethissoon', date: new Date() });
    await task.save();
    await task.remove();

    return task._id.toString();
};

const tasksInDb = async () => {
    const tasks = await Task.find({});
    return tasks.map(task => task.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

module.exports = {
    initialTasks, nonExistingId, tasksInDb, usersInDb
};