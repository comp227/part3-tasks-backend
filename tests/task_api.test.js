const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Task = require('../models/task');

const initialTasks = [
    {
        content: 'Wash the dishes',
        date: new Date(),
        important: false,
    },
    {
        content: 'Take out the trash',
        date: new Date(),
        important: true,
    },
];

beforeEach(async () => {
    await Task.deleteMany({});

    let taskObject = new Task(initialTasks[0]);
    await taskObject.save();

    taskObject = new Task(initialTasks[1]);
    await taskObject.save();
});

test('tasks are returned as json', async () => {
    await api
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /application\/json/);
}, 100000);

test('all tasks are returned', async () => {
    const response = await api.get('/api/tasks');

    expect(response.body).toHaveLength(initialTasks.length); // highlight-line
});

test('a specific task is within the returned tasks', async () => {
    const response = await api.get('/api/tasks');

    // highlight-start
    const contents = response.body.map(r => r.content);

    expect(contents).toContain(
        'Take out the trash'
    );
    // highlight-end
});
afterAll(() => {
    mongoose.connection.close();
});