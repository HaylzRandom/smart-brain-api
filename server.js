import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();

const saltRounds = 10;
const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'football',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '456',
			name: 'Hayley',
			email: 'hayley@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date(),
		},
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com',
		},
	],
};

// Instead of Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
});

// Sign In
app.post('/signin', (req, res) => {
	// Load hash from your password DB.
	bcrypt.compare(
		'apples',
		'$2b$10$KGpzGKCJv2u3CeyRlaEVn.bEiPksQM3cm6td4SP4CFkxz5bk73NXO',
		function (err, result) {
			console.log('first guess', result);
		}
	);

	bcrypt.compare(
		'veggies',
		'$2b$10$KGpzGKCJv2u3CeyRlaEVn.bEiPksQM3cm6td4SP4CFkxz5bk73NXO',
		function (err, result) {
			console.log('second guess', result);
		}
	);

	if (
		req.body.email === database.users[1].email &&
		req.body.password === database.users[1].password
	) {
		res.json(database.users[1]);
	} else {
		res.status(400).json('Error logging in');
	}
});

// Register User
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;

	bcrypt.hash(password, saltRounds, function (err, hash) {
		// Store hash in your password DB.
		console.log(hash);
	});

	database.users.push({
		id: '124',
		name: name,
		email: email,
		entries: 0,
		joined: new Date(),
	});

	res.json(database.users[database.users.length - 1]);
});

// User Profile by ID
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(404).json('User not found');
	}
});

// Update rank
app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(404).json('User not found');
	}
});

/* // Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
}); */

app.listen(3000, () => {
	console.log('App running on port 3000');
});
