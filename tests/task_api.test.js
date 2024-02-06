const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Task = require("../models/task");

beforeEach(async () => {
    await Task.deleteMany({});
    console.log("cleared");

    for (const task of helper.initialTasks) {
        let taskObject = new Task(task);
        await taskObject.save();
        console.log("saved");
    }
    console.log("done");
});

test("tasks are returned as json", async () => {
    await api
        .get("/api/tasks")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("all tasks are returned", async () => {
    const response = await api.get("/api/tasks");

    expect(response.body).toHaveLength(helper.initialTasks.length);
});

test("a specific task is within the returned tasks", async () => {
    const response = await api.get("/api/tasks");

    const contents = response.body.map(r => r.content);

    expect(contents).toContain(
        "Take out the trash"
    );
});

test("a valid task can be added ", async () => {
    const newTask = {
        content: "async/await simplifies making async calls",
        important: true,
    };

    await api
        .post("/api/tasks")
        .send(newTask)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const tasksAtEnd = await helper.tasksInDb();
    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length + 1);

    const contents = tasksAtEnd.map(t => t.content);
    expect(contents).toContain(
        "async/await simplifies making async calls"
    );
});

test("task without content is not added", async () => {
    const newTask = {
        important: true
    };

    await api
        .post("/api/tasks")
        .send(newTask)
        .expect(400);

    const tasksAtEnd = await helper.tasksInDb();

    expect(tasksAtEnd).toHaveLength(helper.initialTasks.length);
});

test("a specific task can be viewed", async () => {
    const tasksAtStart = await helper.tasksInDb();
    const taskToView = tasksAtStart[0];

    const resultTask = await api
        .get(`/api/tasks/${taskToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(resultTask.body).toEqual(taskToView);
});

test("a task can be deleted", async () => {
    const tasksAtStart = await helper.tasksInDb();
    const taskToDelete = tasksAtStart[0];

    await api
        .delete(`/api/tasks/${taskToDelete.id}`)
        .expect(204);

    const tasksAtEnd = await helper.tasksInDb();
    expect(tasksAtEnd).toHaveLength(
        helper.initialTasks.length - 1
    );

    const contents = tasksAtEnd.map(r => r.content);
    expect(contents).not.toContain(taskToDelete.content);
});

afterAll(async () => {
    await mongoose.connection.close();
});