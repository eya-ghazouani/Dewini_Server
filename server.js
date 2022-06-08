const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');

const port = 4000;

const UserRoutes = require('./Routes/user')
const PrduitRoutes = require('./Routes/produit')
const CategorieRoutes=require('./Routes/categorie')
const ReservationRoutes=require('./Routes/reservation')
const StatsRoutes=require('./Routes/stats');
const DonRoutes=require('./Routes/donnation');

const server = express()
const http = require('http').Server(server);
const io = require('socket.io')(http, {
    // telling cors that  our client is * or "http://localhost:3000"
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

server.use(bodyparser.json());
server.use(cors());

//img
server.use("/uploads/images", express.static(path.join("uploads", "images")));

server.get('/', (req, res)=>{
    res.send("Hello World!");
})

server.use('/user', UserRoutes);
server.use('/produit', PrduitRoutes);
server.use('/categorie', CategorieRoutes)
server.use('/reservation', ReservationRoutes)
server.use('/stats', StatsRoutes)
server.use('/don', DonRoutes)

let users = [];

// socket handeling events
io.on('connection', (socket) =>{

    console.log('a user connected  ' + socket.id);

    socket.emit('me', socket.id);
    
    socket.on('log_in', (id ) =>{
        users.push({s_id: socket.id, m_id: id});
        // console.log('user ' + id + ' loged in ');
        console.log(users);
    });

        
    socket.on('notif', ({id , notif}) =>{
        // console.log(notif)
        let user = users.find(({s_id, m_id}) => m_id === id );
        if (user){
            socket.to(user.s_id).emit('receive-notification', {notif, sender: socket.id, time: new Date()});
        }
    });

    socket.on('disconnect', ( ) =>{
        socket.disconnect();    
        console.log('User Disconnected');
    });

});

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(result => {
    http.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}).catch(error => {
    console.log(`server Error while trying to connect to DB ${error}`);
})

