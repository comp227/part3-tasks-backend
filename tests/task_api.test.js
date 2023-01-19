const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper'); // highlight-line
const app = require('../app');
const api = supertest(app);

const Task = require('../models/task');

beforeEach(async () => {
    await Task.deleteMany({});

    let taskObject = new Task(helper.initialTasks[0]); // highlight-line
    await taskObject.save();

    taskObject = new Task(helper.initialTasks[1]); // highlight-line
    await taskObject.save();
});

test('tasks are returned as json', async () => {
    await api
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('all tasks are returned', async () => {
    const response = await api.get('/api/tasks');

    expect(response.body).toHaveLength(helper.initialTasks.length); // highlight-line
});

test('a specific task is within the returned tasks', async () => {
    const response = await api.get('/api/tasks');

    const contents = response.body.map(r => r.content);

    expect(contents).toContain(
        'Take out the trash'
    );
});

test('a valid task can be added ', async () => {
    const newTask = {
        content: 'async/await simplifies making async calls',
        important: true,
    };

    await api
        .post('/api/tasks')
        .send(newTask)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const tasksAtEnd = await helper.tasksInDb(); // highlight-line
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length + 1); // highlight-line

    const contents = tasksAtEnd.map(t => t.content); // highlight-line
    expect(contents).toContain(
        'async/await simplifies making async calls'
    );
});

test('task without content is not added', async () => {
    const newTask = {
        important: true
    };

    await api
        .post('/api/tasks')
        .send(newTask)
        .expect(400);

    const tasksAtEnd = await helper.tasksInDb(); // highlight-line

    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length); // highlight-line
});

afterAll(() => {
    mongoose.connection.close();
});