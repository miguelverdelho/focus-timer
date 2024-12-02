const express = require("express");
const cors = require('cors');

const timesRoute =require( './routes/timesRoute.js');

const app = express();

app.use(cors());
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:4200', // Allow your Angular app's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Accept'], // Allow these headers
  }));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Replace with your Angular app's URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.sendStatus(204); // No Content
  });


const timesController = require('./controller/timesController.js');
app.get('/api/times/', timesController.getTimes);
app.post('/api/times/new', timesController.createTimes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
