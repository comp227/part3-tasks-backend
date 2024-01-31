const mongoose = require('mongoose').set('strictQuery', true)

if (process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://comp227:${password}@cluster0.gb6u3el.mongodb.net/taskApp?retryWrites=true&w=majority`

const taskSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Task = mongoose.model('Task', taskSchema)

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        Task.find({}).then(result => {
            result.forEach(task => {
                console.log(task)
            })
            mongoose.connection.close()
        })
    })
    // .then(() => {
    //     console.log('task saved!')
    //     return mongoose.connection.close()
    // })
    .catch((err) => console.log(err))