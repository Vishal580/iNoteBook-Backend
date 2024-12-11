const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// ROUTE: 1 Get all the Notes using : GET "/api/auth/fetchallnotes". It requires auth
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    // If there are errors, Retuen Bad Requesta and the errors
    try {
        const notes = await Note.find({user: req.user.id})
        res.json(notes)      
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE: 2 Add new Notes using : POST "/api/auth/addnote". It requires auth
router.post('/addnote', fetchuser,[
    body('title', 'Title must be atleast 3 characters').isLength({min: 3}),
    body('description', 'Description must be atleast 5 characters').isLength({min: 5})
], async (req, res)=>{
    const {title, description, tag} = req.body;
    // If there are errors, Retuen Bad Requesta and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router