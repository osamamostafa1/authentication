const mongoose = require('mongoose')

const connectDb = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
        .then(() => { console.log(`MongoDb Connected`.cyan.bold) })
        .catch(() => { console.log(`Can Not MongoDb Connected`.red.bold) })
}
module.exports = connectDb