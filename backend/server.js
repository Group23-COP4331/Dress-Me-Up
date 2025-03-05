const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://dressmeupproject.com', 'https://dressmeupproject.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Native MongoDB Client Connection (if needed elsewhere)
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

async function connectToNativeDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB (Native Client)');
  } catch (error) {
    console.error('MongoDB Native Client Connection Error:', error);
  }
}
connectToNativeDB();

// Establish Mongoose Connection for your models
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Mongoose connected"))
.catch(err => console.error("Mongoose connection error:", err));

// Optional: Listen to connection events for more debugging info
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established');
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Import API Routes (Mongoose will now be available to your models)
const apiRoutes = require('./api');
apiRoutes(app, client); // Pass app and native client if needed

console.log('Working directory:', process.cwd());

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
