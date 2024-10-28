import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
})

const httpServer = http.Server(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const users = [];

io.on('connection', (socket) => {
    console.log(`userID ${socket.id} is connecting`);
    
    //用户断开连接
    socket.on("disconnect",()=>{
        const user = users.find((x) => x.socketId === socket.id);
        if(user){
            user.online = false;
            console.log(`user ${user.username} is offline`);
            const admin = users.find((x) => x.username === "Admin" && x.online);
            if(admin){
                io.to(admin.socketId).emit("updateUser", user);
            }
        }
    })

    //用户登录上线
    socket.on("onLogin", (user)=>{
        const updatedUser = {
            ...user,
            online: true,
            socketId: socket.id,
            messages: [],
        }
        const existUser = users.find((x) => x.username === updatedUser.username);
        if (existUser) {
            existUser.socketId = socket.id;
            existUser.online = true;
            console.log(`user ${updatedUser.username} is online`);
        }else {
            users.push(updatedUser);
            console.log(`new user ${updatedUser.username} is online`);
        }
        const admin = users.find((x) => x.username === "Admin" && x.online);
        if(admin){
            io.to(admin.socketId).emit("updateUser", updatedUser);
        }
        if(updatedUser.username == "Admin"){
            io.to(updatedUser.socketId).emit("listUsers", users);
        }
    })

    socket.on("onUserSelected",(user)=>{
        const admin = users.find((x) => x.username === "Admin" && x.online);
        if(admin){
            const existUser = users.find((x) => x.username === user.username);
            io.to(admin.socketId).emit("selectUser", existUser);
        }
    })

    socket.on("onMessage", (message) => {
        if(message.from === "Admin"){
            const user = users.find((x) => x.username === message.to && x.online);
            if(user){
                io.to(user.socketId).emit("message", message);
                user.messages.push(message);
            }else{
                io.to(socket.id).emit("message", {
                    from: "System",
                    to: "Admin",
                    body: "User is offline",
                });
            }
        }else{
            const admin = users.find((x) => x.username === "Admin" && x.online);
            if(admin){
                io.to(admin.socketId).emit("message", message);
                const user = users.find((x) => x.username === message.from && x.online);
                if(user){
                    user.messages.push(message);
                }
            }else{
                io.to(socket.id).emit("message", {
                    from: "System",
                    to: message.from,
                    body: "Sorry, Admin is offline",
                })
            }
        }
    })
    
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});