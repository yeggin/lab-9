const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const puppiesRoutes = require('./routes/puppiesRoutes');
const port = process.env.PORT || 8080;
const app = express();
const mysql = require('mysql2');
require('dotenv').config();



app.use(express.json());
app.use(cors());
app.use('/api/puppies', puppiesRoutes);

app.use((req, res, next) => {
    // Content Security Policy without 'unsafe-eval'
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self';"
    );
  
    // CORS middleware to handle preflight requests (OPTIONS)
    app.options('*', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.sendStatus(200); // Respond OK to preflight requests
    });
  
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200); // Respond OK to preflight requests
    }
  
    next();
  });

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

