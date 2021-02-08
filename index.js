const express = require('express');
const mongoose = require('mongoose');

const {DB_CONNECT} = require('./config');
const userRoute = require('./routes/users');


const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Routes
app.use('/user', userRoute);


// Connect DB
mongoose.connect(DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => {
        console.log("DB CONNECTED");
        app.listen(process.env.PORT || 5000, () =>{
            console.log("Server is running");
        });
    });