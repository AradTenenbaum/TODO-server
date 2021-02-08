const express = require('express');
const mongoose = require('mongoose');

const {DB_CONNECT} = require('./config');
const db = require('./pgdb');

// const getAll = async () => {
//     try {
//         const { rows } = await db.query('SELECT * FROM users WHERE test = $1', ['test']);
//         console.table(rows);
//     } catch (error) {
//         console.error(error['name']);
//     }
// };

// getAll();

const app = express();
app.use(express.json());

// Connect DB
mongoose.connect(DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => {
        console.log("DB CONNECTED");
        app.listen(process.env.PORT || 5000, () =>{
            console.log("Server is running");
        });
    });