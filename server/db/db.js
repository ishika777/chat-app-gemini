const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")

function connect(){
    mongoose.connect(process.env.MONGO_URL).then(() => console.log("connected to db")).catch((err) => console.log(err))
}

module.exports = connect;