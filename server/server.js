import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import db from './db.js';
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
    origin: process.env.FRONTEND_URL,
    credentials: true,
};

// ====== Routes =========

app.post('/api/input', async (req, res) => {
    try {
        console.log(req.body);
    } catch (err) {
        console.log(`Error fetching AI-generated response: ${err}`);
    }
});

// Render register page
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle form submissions
app.post('/register', async (req, res) => {
    try {
        console.log('Incoming form data:', req.body);

        const { first_name, last_name, gender, ethnicity, email, phone_number, zipcode, password } = req.body;

        if (!first_name || !last_name || !gender || !ethnicity || !email || !phone_number || !zipcode || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }


        // Check email
        const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).json({ error: 'Email already registered, please sign in!' });
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, gender, ethnicity, email, phone_number, zipcode, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, gender, ethnicity, email, phone_number, zipcode, password_hash]
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
