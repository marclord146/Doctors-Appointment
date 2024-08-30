const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected' , ()=> {
    console.log("MongoDB is connected");
})

connection.on('error' , (error)=> {
    console.log("Error in MongoDB connected", error);
})

module.exports = mongoose;