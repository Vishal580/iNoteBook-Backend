const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// ROUTE: 1 Get all the Notes using : GET "/api/notes/fetchallnotes". It requires auth
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

// ROUTE: 2 Add new Notes using : POST "/api/notes/addnote". It requires auth
router.post('/addnote', fetchuser,[
    body('title', 'Title must be atleast 3 characters').isLength({min: 3}),
    body('description', 'Description must be atleast 5 characters').isLength({min: 5})
], async (req, res)=>{
    const {title, description, tag} = req.body; // Destructuring
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

// ROUTE: 3 Update an existing Notes using : PUT "/api/notes/updatenote". It requires auth
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    const {title, description, tag} = req.body; //Destructuring

    try {
    //Create a new Object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find a note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    //Check weather the owner of the note is accessing the note
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true}) //Updates the note
    res.json({note});   
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE: 4 Delete an existing Notes using : DELETE "/api/notes/deletenote". It requires auth
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try {
    //Find a note to be deleteed and delete it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    //Check weather the owner of the note is accessing the note
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id) //Delete the note
    res.json({"success": "Note has been deleted successfylly", note: note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router