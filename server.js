import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './components/register.js';
import { handleSignIn } from './components/signin.js';
import { handleProfileGet } from './components/profile.js';
import { handleApiCall, handleImage } from './components/image.js';

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
});

const app = express();

// Instead of Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Secrets!');
});

// Sign In
app.post('/signin', handleSignIn(db, bcrypt));

// Register User
app.post('/register', (req, res) => {
	handleRegister(req, res, db, bcrypt);
});

// User Profile by ID
app.get('/profile/:id', (req, res) => {
	handleProfileGet(req, res, db);
});

// Update rank
app.put('/image', (req, res) => {
	handleImage(req, res, db);
});

// API Call
app.post('/imageurl', (req, res) => {
	handleApiCall(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});
