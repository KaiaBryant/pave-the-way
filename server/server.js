import express from 'express';
import cors from 'cors';
import generateRoute from './perplexity.js';
import path from 'path';
import dotenv from 'dotenv';
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
    origin: ['http://localhost:5173', 'http://localhost:5174'], // allow both
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
        const { originZipcode, destinationZipcode, transportationMethod, time, day } = req.body;

        try {
            const generatedRes = await generateRoute(
                Number(originZipcode),
                Number(destinationZipcode),
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

// ================== CONTACT FORM ==================

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

app.post('/contact', async (req, res) => {
    try {
        console.log('Incoming form data:', req.body);

        const { first_name, last_name, gender, ethnicity, email, phone_number, zipcode } = req.body;

        if (!first_name || !last_name || !gender || !ethnicity || !email || !phone_number || !zipcode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check email exists
        const [existingEmail] = await db.query('SELECT id FROM contact WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).json({ error: 'Email already registered, please sign in!' });
        }

        const [result] = await db.query(
            'INSERT INTO contact (first_name, last_name, gender, ethnicity, email, phone_number, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, gender, ethnicity, email, phone_number, zipcode]
        );

        res.status(201).json({
            message: `Welcome ${first_name}!`,
            userId: result.insertId,
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// ================== REGISTER ==================

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

app.post('/register', async (req, res) => {
    try {
        console.log('Incoming form data:', req.body);

        const { first_name, last_name, gender, ethnicity, email, password, phone_number, zipcode } = req.body;

        if (!first_name || !last_name || !gender || !ethnicity || !email || !password || !phone_number || !zipcode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [existingEmail] = await db.query('SELECT id FROM account WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).json({ error: 'Email already registered, please sign in!' });
        }

        const [result] = await db.query(
            'INSERT INTO account (first_name, last_name, gender, ethnicity, email, password, phone_number, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, gender, ethnicity, email, password, phone_number, zipcode]
        );

        res.status(201).json({
            message: `Welcome ${first_name}!`,
            userId: result.insertId,
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// ================== LOGIN ==================

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [users] = await db.query('SELECT * FROM account WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: `Welcome back, ${user.first_name}!`,
            userId: user.id,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// ================== START SERVER ==================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
