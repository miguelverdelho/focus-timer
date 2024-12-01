const express = require("express");
const admin = require("firebase-admin");
const cors = require('cors');

// Initialize Express
const app = express();
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
  
// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://focus-timer-8b93b-default-rtdb.europe-west1.firebasedatabase.app" // Replace with your Firebase Database URL
});

const db = admin.database(); // Reference to the Realtime Database

// Endpoint to get "times"
app.get("/api/times", async (req, res) => {
    try {
        console.log(res);
        const ref = db.ref("times"); // Path in your Firebase Realtime Database
        const snapshot = await ref.once("value"); // Fetch the data
        if (snapshot.exists()) {
            res.json(snapshot.val()); // Return the data as JSON
        } else {
            res.status(404).json({ message: "No times found!" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
