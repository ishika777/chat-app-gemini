const dotenv = require("dotenv")
dotenv.config({path : "../.env"})

const express = require("express")
const app = require("./app.js")
const http = require("http")
const server = http.createServer(app)
const path = require("path")

const connect = require("./db/db.js")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const projectModel = require("./models/project.model.js")
const {generateResult} = require("./services/ai.service.js")
const actions = require("./actions/actions.js")
const port = process.env.PORT || 8080;

const DIRNAME = path.resolve()

 

const io = require("socket.io")(server, {
    cors : {
        origin : process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

io.use(async (socket, next) => {
    try {    
        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookies.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] : null;
        const projectId = socket.handshake.query.projectId;
        if(!mongoose.Types.ObjectId.isValid(projectId)){
            console.log("invalid project id")
            return next(new Error("Invalid Project"))
        }
        if(!token){
            console.log("token missing")
            return next(new Error("Authentication error"))
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return next(new Error("Authentication error"))
        }
        socket.project = await projectModel.findById(projectId);
        socket.user = decoded;
        next();

    } catch (error) {
        next(error)
    }
})



io.on("connection", (socket) => {
    console.log("user connected")
    socket.roomId = socket.project._id.toString();

    socket.join(socket.roomId)

    socket.on(actions.PROJECT_MESSAGE, async(data) => {

        socket.broadcast.to(socket.roomId).emit(actions.PROJECT_MESSAGE, data)
        
        const message = data.message;
       
        const isAiMessage = message.includes("@ai");

        if(isAiMessage){
            const prompt = message.replace("@ai", "");
            const result = await generateResult(prompt)
            io.to(socket.roomId).emit(actions.PROJECT_MESSAGE, {
                message : result,
                sender : {
                    _id : "ai",
                    email : "AI"
                }
            })
            return;
        }
    })

    socket.on("disconnect", () => {
        socket.leave(socket.roomId)
    })

})


app.use(express.static(path.join(DIRNAME, "client/dist")))
app.get("*", (_, res) => {
    res.sendFile(path.join(DIRNAME, "client","dist", "index.html"))
})


server.listen(port, ()=>{
    connect()
    console.log(`Server is listening on port ${port}`)
})