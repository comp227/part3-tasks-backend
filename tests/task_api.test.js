const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Task = require("../models/task");

const initialTasks = [
    {
        content: "Wash the dishes",
        date: new Date(),
        important: false,
    },
    {
        content: "Take out the trash",
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

test("tasks are returned as json", async () => {
    await api
        .get("/api/tasks")
        .expect(200)
        .expect("Content-Type", /application\/json/);
}, 100000);

test("all tasks are returned", async () => {
    const response = await api.get("/api/tasks");
    expect(response.body).toHaveLength(initialTasks.length);
});

test("a specific task is within the returned tasks", async () => {
    const response = await api.get("/api/tasks");
    const contents = response.body.map(r => r.content);
    expect(contents).toContain("Take out the trash");
});

afterAll(async () => {
    await mongoose.connection.close();
});