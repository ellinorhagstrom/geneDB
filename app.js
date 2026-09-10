//All imports/requires
require("dotenv").config();
const connectDB = require("./database/db");
const geneRoutes = require("./forms/geneRoute");
const displayRoutes = require('./forms/displayGenesRoutes')
const path = require('path');
const express = require('express');

const PORT = process.env.PORT;
const app = express();

//Connect to database
connectDB();

//Built in parser so express can read incomming requests in JSON format (ex. from POST request)
//The payloades will automatically parse into req.body inside route handler
app.use(express.json());

//Used to parse URL-encoded form data - so that it can read req.body
app.use(express.urlencoded({ extended: true }));

//Ensures users can access the html and CSS directly via browser navigation - ensures the visuals
app.use(express.static(path.join(__dirname, `public`)));

app.set('view engine', 'ejs'); //Starts visual engine?
app.set('views', './views'); // Points to the view folder

app.use('/addGene', geneRoutes); // chooses addGene file from the views foulder
app.use('/displayGenes', displayRoutes)


//Launches the server
app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log(`Server listening on Port: ${PORT}`);
})
