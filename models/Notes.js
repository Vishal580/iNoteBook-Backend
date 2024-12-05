const mongoose = require('mongoose');

const NotesSchema = new Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true,
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    }
  });

  mongoose.export = mongoose.model('notes', NotesSchema);