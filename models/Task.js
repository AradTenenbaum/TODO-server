const mongoose = require('mongoose');
const {UNDONE} = require('../constants/todoStatus');

const taskSchema = new mongoose.Schema({
    // PostgreSQL id
    ownId : {
        type: Number,
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    text: {
        type: String,
        required: true,
        max: 1024
    },
    status: {
        type: String, 
        default: UNDONE
    }
});

module.exports = mongoose.model('Task', taskSchema);