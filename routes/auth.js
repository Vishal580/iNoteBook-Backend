const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); //Hashing, salt
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "vishal$123";

//ROUTE: 1 creating a user using: POST "/api/auth/createuser". It Doesn't require auth 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5})
],async (req, res)=>{
    let success = false;
    // If there are errors, Retuen Bad Requesta and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }
    // Check if the user is already exists
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error: 'User with this email already exists'});
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
    success = true;
    res.json({success, authtoken})
    // res.json(user)
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    };
})

//ROUTE: 2 Authenticate a user using: POST "/api/auth/login". It Doesn't require auth 
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password field cannot be empty').exists()
],async (req, res)=>{
    let success = false;
    // If there are errors, Retuen Bad Requesta and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
        
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error: "Please login using vaild credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error: "Please login using vaild credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authtoken})
    } catch (error) {
        console.log(error.message);
        res.status(500).send(success, "Internal Server Error");
    }
})

//ROUTE: 3 Get logged in user details: POST "/api/auth/getuser". It requires auth
router.post('/getuser', fetchuser, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({ _id: userId }).select("-password");
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router