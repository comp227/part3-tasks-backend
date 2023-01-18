const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

// eslint-disable-next-line no-undef
const password = process.argv[2];

const url = `mongodb+srv://comp227:${password}@cluster0.gb6u3el.mongodb.net/taskApp?retryWrites=true&w=majority`;

const taskSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

const Task = mongoose.model('Task', taskSchema);
mongoose.set('strictQuery', true);

mongoose
    .connect(url)
    .then(() => {
        console.log('connected');

        Task.find({}).then(result => {
            result.forEach(task => {
                console.log(task);
            });
            mongoose.connection.close();
        });
    })
    // .then(() => {
    //     console.log('task saved!')
    //     return mongoose.connection.close()
    // })
    .catch((err) => console.log(err));