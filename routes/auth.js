const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { hash } = require('bcryptjs');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = "vishal$123";

// creating a user using: POST "/api/auth/createuser". It Doesn't require auth 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5})
],async (req, res)=>{
    // If there are errors, Retuen Bad Requesta and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    // Check if the user is already exists
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: 'User with this email already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword
    })

    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    res.json({authtoken})
    // res.json(user)
    }catch(error){
        console.log(error.message);
        res.status(500).send("Some error occured");
    };
})

module.exports = router