const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
const cors = require('cors');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection setup
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;

if (!uri) {
    console.error('MONGO_URL environment variable is missing.');
    process.exit(1);
}

const client = new MongoClient(uri);

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('minor-project');
        const patientCollection = database.collection('patientCollection');
        const doctorCollection = database.collection('doctorCollection');
        const adminCollection = database.collection('adminCollection');
        const predictionHistoryCollection = database.collection('predictionHistoryCollection');
        const appointmentCollection = database.collection('appointmentCollection'); // Appointment collection

        // Import and set up the API routes
        const userapi = require('./Apis/userapi')({ 
            patientCollection, 
            doctorCollection, 
            adminCollection,
            predictionHistoryCollection,
            appointmentCollection // Pass the appointment collection here
        });
        app.use('/userapi', userapi);

        // Start the server
        app.listen(port, () => console.log(`Server is running on port ${port}...`));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

initializeDatabase().catch(console.error);
