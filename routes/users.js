const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {TOKEN_SECRET} = require('../config');
const db = require('../pgdb');
const {registerValidation, loginValidation} = require('../utils/validation');


// Register
router.post('/register', async (req, res) => {
    // Validation
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Check if user exist PostgreSQL
    const {rows} = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
    if(rows.length > 0) return res.status(400).send('Username already exist');
    // Check if user exist MongoDB
    const usernameExist = await User.findOne({username: req.body.username});
    if(usernameExist) return res.status(400).send('Username already exist');
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create new User
    const user = new User({
        username: req.body.username,
        password: hashedPassword
    });
    // Save user to DB
    try {
        const {rows} = await db.query("INSERT INTO users VALUES(DEFAULT ,$1, $2) RETURNING user_id", [user.username, user.password]);
        const savedUser = await user.save();
        // res.send({user: user._id});
        if(rows.length > 0) res.send(rows[0]);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});


// Login
router.post('/login', async (req, res) => {
    // Validation
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Check if user exist PostgreSQL
    const {rows} = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
    if(rows.length === 0) return res.status(400).send('Username does not exists');
    // Check if user exist MongoDB
    const usernameExist = await User.findOne({username: req.body.username});
    if(!usernameExist) return res.status(400).send('Username does not exists');
    // Password Check
    const validPass = await bcrypt.compare(req.body.password, rows[0].password);
    if(!validPass) return res.status(400).send('Password is wrong'); 
    // Create and assign a login token
    const token = jwt.sign({username: req.body.username, password: req.body.password}, TOKEN_SECRET);
    res.send({
        token
    });
});

module.exports = router;
