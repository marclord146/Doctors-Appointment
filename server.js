const express = require("express");
const app = express();
const dbConfig = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorsRoute = require("./routes/doctorsRoute");
app.use(express.json());
const port = process.env.PORT || 5001;
require('dotenv').config();
app.use(express.json({ limit: '64kb' }));

app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
app.use('/api/doctor',doctorsRoute);



app.listen(port, () => console.log('Working on port ', port));