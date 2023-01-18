const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('tasks are returned as json', async () => {
    await api
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /application\/json/);
}, 100000);

test('there are two tasks', async () => {
    const response = await api.get('/api/tasks');

    expect(response.body).toHaveLength(2);
});

test('the first task is about HTTP methods', async () => {
    const response = await api.get('/api/tasks');

    expect(response.body[0].content).toBe('Wash the dishes');
});

afterAll(() => {
    mongoose.connection.close();
});