// Importing necessary libraries required for the project
// Express for the server
const express = require("express");

// CORS is to connect the frontend to backend
const cors = require("cors");

const apiRoutes = require('./apiRoutes');
const { db, initializeDatabase } = require('./db');

// App & Database setup
const app = express();

// Middlewares (Might shift to their own middleware/ folder if deemed necessary)
app.use(cors()); // Allows requests from our frontend
app.use(express.json()); // Parses incoming JSON payloads from frontend

app.use('/api', apiRoutes);

module.exports = { app, db, initializeDatabase };
