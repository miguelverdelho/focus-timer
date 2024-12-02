

// app.put("/api/times/:date/:elapsedTimeType", async (req, res) => {
//     try {
//         const date = req.params.date;
//         const elapsedTimeType = req.params.elapsedTimeType;
//         const newElapsedTime = req.body.elapsedTime;

//         if (typeof newElapsedTime === "undefined") {
//             return res.status(400).json({ error: "Elapsed time is required" });
//         }

//         const ref = db.ref("times");
//         const snapshot = await ref.once("value");
//         const times = Object.values(snapshot.val());
//         const timeEntryToUpdate = times.find((time) => new Date(time.date).toDateString() === new Date(date).toDateString());
//         if (!timeEntryToUpdate) {
//             return res.status(404).json({ message: "Time entry not found" });
//         }

//         const elapsedTimeToUpdate = timeEntryToUpdate.elapsedTimes.find((elapsedTime) => elapsedTime.id === elapsedTimeType);

//         if (!elapsedTimeToUpdate) {
//             return res.status(404).json({ message: "Elapsed time type not found" });
//         }

//         elapsedTimeToUpdate.elapsedTime = newElapsedTime;

//         const updatedTimeEntry = { ...timeEntryToUpdate };
//         console.log(timeEntryToUpdate);
//         ref.once('value', (snapshot) => {
//             snapshot.forEach((childSnapshot) => {
//                 if (childSnapshot.val().date === timeEntryToUpdate.date) {
//                     const key = childSnapshot.key;
//                     ref.child(key).update(updatedTimeEntry);
//                 }
//             });
//           });
//         res.json({ message: "Time entry updated successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = getTimes = ;

// module.exports = createTimes = async (req, res, next) => {

// };

const admin = require("firebase-admin");
// Initialize Firebase Admin
const serviceAccount = require("../firebase/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://focus-timer-8b93b-default-rtdb.europe-west1.firebasedatabase.app" // Replace with your Firebase Database URL
});
const db = admin.database(); // Reference to the Realtime Database

    
module.exports = {
    getTimes : async (req, res, next) => {
        try {
            console.log("getTimes");
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
    },
    
    createTimes : async (req, res, next) => {
        try {
            const currentTime = new Date().toLocaleDateString(); // Set the date property to the current date
            const newTimeEntry = {
            date: currentTime,
            elapsedTimes: [
                { id: "working", elapsedTime: 0 },
                { id: "coding", elapsedTime: 0 },
                { id: "gaming", elapsedTime: 0 },
                { id: "studying", elapsedTime: 0 },
            ],
            };
        
            console.log(newTimeEntry);
        
            const ref = db.ref("times");
            const existingTimeEntryRef = ref.orderByChild("date").equalTo(currentTime).once("value");
        
            existingTimeEntryRef.then((snapshot) => {
            if (snapshot.exists()) {
                res.json({ message: "Time entry for today already exists" });
            } else {
                const newRef = ref.push();
                newRef.set(newTimeEntry);
                res.json({ message: "New time entry created successfully" });
            }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
} 


