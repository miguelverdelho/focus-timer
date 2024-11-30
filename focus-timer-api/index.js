const express = require("express");
const admin = require("firebase-admin");

// Initialize Express
const app = express();

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
