import express from 'express';
import cors from 'cors';
import generateRoute from './perplexity.js';
import path from 'path';
import dotenv from 'dotenv';
import db from './db.js';
import { fileURLToPath } from 'url';
import session from 'express-session';

//Compatiable import
import MySQLSession from 'express-mysql-session';
const MySQLStore = MySQLSession(session);

// Environment variables
dotenv.config();

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection options
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});

app.use(
  session({
    key: 'user_session',
    secret: process.env.SESSION_SECRET || 'supersecretkey123',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  })
);

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
  ], // allow both
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
    const {
      originAddress,
      destinationAddress,
      transportationMethod,
      time,
      day,
    } = req.body;

    try {
      const generatedRes = await generateRoute(
        originAddress,
        destinationAddress,
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

// ================== SURVEY RESULTS ==================
app.post('/api/survey/results', async (req, res) => {
  const { email, hypothetical, existing, improvements, additional_info } =
    req.body;

  if (!email) return res.status(400).json({ error: 'Missing email' });

  await db.query(
    'INSERT INTO survey_results (email, hypothetical, existing, improvements, additional_info) VALUES (?,?,?,?,?)',
    [
      email,
      JSON.stringify(hypothetical),
      JSON.stringify(existing),
      JSON.stringify(improvements),
      additional_info,
    ]
  );

  res.json({ success: true });
});

// ================== CONTACT FORM ==================

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.post('/contact', async (req, res) => {
  try {
    console.log('Incoming form data:', req.body);

    const {
      first_name,
      last_name,
      gender,
      ethnicity,
      email,
      phone_number,
      zipcode,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !gender ||
      !ethnicity ||
      !email ||
      !phone_number ||
      !zipcode
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check email exists
    const [existingEmail] = await db.query(
      'SELECT id FROM contact WHERE email = ?',
      [email]
    );
    if (existingEmail.length > 0) {
      return res
        .status(409)
        .json({ error: 'Email already registered, please sign in!' });
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

    const {
      first_name,
      last_name,
      gender,
      ethnicity,
      email,
      password,
      phone_number,
      zipcode,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !gender ||
      !ethnicity ||
      !email ||
      !password ||
      !phone_number ||
      !zipcode
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [existingEmail] = await db.query(
      'SELECT id FROM account WHERE email = ?',
      [email]
    );
    if (existingEmail.length > 0) {
      return res
        .status(409)
        .json({ error: 'Email already registered, please sign in!' });
    }

    const [result] = await db.query(
      'INSERT INTO account (first_name, last_name, gender, ethnicity, email, password, phone_number, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        first_name,
        last_name,
        gender,
        ethnicity,
        email,
        password,
        phone_number,
        zipcode,
      ]
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

// ================== UPDATE ACCOUNT ==================
app.put('/api/account', async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: 'Not logged in' });

  const { first_name, last_name, email, phone_number, zipcode } = req.body;
  const userId = req.session.user.id;

  try {
    await db.query(
      `UPDATE account
            SET first_name = ?, last_name = ?, email = ?, phone_number = ?, zipcode = ?
            WHERE id = ?`,
      [first_name, last_name, email, phone_number, zipcode, userId]
    );

    // Update session data too
    req.session.user.first_name = first_name;
    req.session.user.email = email;

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update account' });
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

    const [users] = await db.query('SELECT * FROM account WHERE email = ?', [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Store user session
    req.session.user = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
    };

    res.json({
      message: `Welcome back, ${user.first_name}!`,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        zipcode: user.zipcode,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// ================== CHECK SESSION USER ==================
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      user: req.session.user,
    });
  }
  res.json({ loggedIn: false });
});

// ================== GET ACCOUNT DATA ==================
app.get('/api/account', async (req, res) => {
  if (!req.session.user) {
    return res.json({ loggedIn: false });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, phone_number, zipcode FROM account WHERE id = ?',
      [req.session.user.id]
    );

    const user = rows[0];

    const [surveyRows] = await db.query(
      'SELECT hypothetical, existing, improvements, additional_info, created_at FROM survey_results WHERE email = ? ORDER BY created_at DESC',
      [user.email]
    );

    return res.json({
      loggedIn: true,
      user,
      surveys: surveyRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching account' });
  }
});

// ================== LOGOUT ==================
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('user_session');
    res.json({ message: 'Logged out successfully' });
  });
});

// ================== DELETE ACCOUNT ==================
app.delete('/api/account', async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: 'Not logged in' });

  const userId = req.session.user.id;

  try {
    // Optionally delete surveys too
    // await db.query("DELETE FROM survey_inputs WHERE user_id = ?", [userId]);
    await db.query('DELETE FROM account WHERE id = ?', [userId]);

    req.session.destroy(() => {
      res.clearCookie('user_session');
      res.json({ message: 'Account deleted' });
      res.json({ success: true });
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// ================== START SERVER ==================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
