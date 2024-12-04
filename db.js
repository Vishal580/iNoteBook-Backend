const mongoose = require('mongoose')

const mongooseURI = "mongodb://localhost:27017/"

// const connectToMongo = () => {
//     mongoose.connect(mongooseURI, () =>{
//         console.log('Connected to Mongo Successfully');
//     })
// }

const connectToMongo = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongooseURI, {
            useNewUrlParser: true, // Optional, defaults to true in Mongoose 6+
            useUnifiedTopology: true, // Optional, defaults to true in Mongoose 6+
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        // Log and handle connection errors
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the application on failure
    }
};

module.exports = connectToMongo;