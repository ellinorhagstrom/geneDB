//Database module to keep connection logic isolated from server routing logic

require("dotenv").config();
const mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URL;

//connects to database and waits until connection is establiched before handeling HTTP requests (using async/await)
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

//Exports module so that it can be imported in app.js
module.exports = connectDB