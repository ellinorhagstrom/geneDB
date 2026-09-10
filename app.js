//All imports/requires
require("dotenv").config();
const connectDB = require("./database/db");
const geneRoutes = require("./forms/geneRoute");
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
//Start this if you want to use the HTML to visualize code, otherwise it overwrites the other visuals.
// app.use(express.static(path.join(__dirname, `public`)));

app.set('view engine', 'ejs'); //Starts visual engine?
app.set('addGene', './views'); // Points to the view file that display home screen

app.use('/', geneRoutes);

//Creates a new Gene document in MongoDB using incoming request data
// app.post('/hej', async (req, res) => {
//     try {
//         // req.body contains the JSON sent from frontend
//         const newGene = await Gene.create(req.body);

//         // Respond with a 201 (Created) status code and the saved database object
//         res.status(201).json(newGene);
//     } catch (err) {
//         // Handle validation errors or duplicate key issues
//         res.status(400).json({ error: err.message });
//     }
// });


//Displays the documents in the database as a json in browser
// app.get('/', async (req, res) => {
//     try {
//         const genes = await Gene.find();
//         res.json(genes);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


//Launches the server
app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log(`Server listening on Port: ${PORT}`);
})
