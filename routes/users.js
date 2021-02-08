const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register
router.post('/register', async (req, res) => {
    // Validation
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Check if user exist
    const usernameExist = await User.findOne({username: req.body.username});
    if(usernameExist) return res.status(400).send('Username already exist');
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create new User
    const user = new User({
        username: req.body.username,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword
    });
    // Save user to DB
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});