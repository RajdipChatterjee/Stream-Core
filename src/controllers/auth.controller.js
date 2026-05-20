const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
    const {username, email, password, role='user'} = req.body;
    
    const usernameAlreadyExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    
    // return res.status(200).json({message: "Reached"});

    if(usernameAlreadyExists) {
        return res.status(409).json({message: "User Already Exists"});
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    });


    const token = jwt.sign({
        _id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET_KEY )

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

module.exports = {registerUser}