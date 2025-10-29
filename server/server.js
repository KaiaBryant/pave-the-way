import express from 'express';
import cors from 'cors';
import generateRoute from './perplexity.js';
import path from 'path';
import dotenv from 'dotenv';
import dbPool from './db.js';
import { fileURLToPath } from 'url';


// Environment variables
dotenv.config();

// Express setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS setup
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // React frontend
    credentials: true,
};
app.use(cors(corsOptions));

// ====== Routes =========

// Test route
app.get('/', (req, res) => {
    res.send('Server is running and ready to accept connections.');
});

app.post('/api/input', async (req, res) => {
  try {
    // console.log(req.body);
    let originZipcode = 28205;
    let destinationZipcode = 28208;
    let transportationMethod = 'bike';
    let time = '8:00 AM';
    let day = 'Tuesday';

    try {
      const generatedRes = await generateRoute(
        originZipcode,
        destinationZipcode,
        transportationMethod,
        time,
        day
      );
      console.log('Generated route response:', generatedRes);
      res.json(generatedRes);
    } catch (err) {
      console.log('Error fetching generated route from Perplexity:' + err);
      res.json({ error: 'Error fetching generated route from Perplexity' });
    }
  } catch (err) {
    console.log(`Error fetching AI-generated response: ${err}`);
  }
});

// Render contact
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

// Handle form submissions
app.post('/contact', async (req, res) => {
    try {
        console.log('Incoming form data:', req.body);

        const { first_name, last_name, gender, ethnicity, email, phone_number, zipcode } = req.body;

        if (!first_name || !last_name || !gender || !ethnicity || !email || !phone_number || !zipcode) {
            return res.status(400).json({ error: 'All fields are required' });
        }


        // Check email
        const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).json({ error: 'Email already registered, please sign in!' });
        }

        // Insert new user into the database
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, gender, ethnicity, email, phone_number, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, gender, ethnicity, email, phone_number, zipcode]
        );

        // Send success response
        res.status(201).json({
            message: `Welcome ${first_name}!`,
            userId: result.insertId,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});




// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
