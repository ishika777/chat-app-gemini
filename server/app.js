const dotenv = require("dotenv")
dotenv.config({path : "../.env"})
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")

const userRouter = require("./routes/user.route")
const projectRouter = require("./routes/project.route")
const aiRouter = require("./routes/ai.route")


app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.use("/users", userRouter)
app.use("/projects", projectRouter)
// app.use("/ai", aiRouter)


module.exports = app;