const mongoose = require('mongoose');
const {UNDONE} = require('../constants/todoStatus');

const taskSchema = new mongoose.Schema({
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
        required: true,  
        default: UNDONE
    }
});

module.exports = mongoose.model('Task', taskSchema);