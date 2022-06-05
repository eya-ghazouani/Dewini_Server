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
const StatsRoutes=require('./Routes/stats')

const server = express()

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


// mongoose.connect("mongodb+srv://admin:admin@dewinibd.bcxln.mongodb.net/dewinibd?retryWrites=true&w=majority")
// // mongoose.connect("mongodb+srv://fsUser:fstodo123@fstodo.bmea3.mongodb.net/fstodo?retryWrites=true&w=majority")
// .then(result => {
//     server.listen(port, () => {
//         console.log(`server is running on port ${port}`);
//     });
// }).catch(error => {
//     console.log(`server Error while trying to connect to DB ${error}`);
// })

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(result => {
         server.listen(port, () => {
             console.log(`server is running on port ${port}`);
         });
}).catch(error => {
        console.log(`server Error while trying to connect to DB ${error}`);
        })

