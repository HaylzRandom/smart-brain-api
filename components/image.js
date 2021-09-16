import dotenv from 'dotenv';
dotenv.config();

import Clarifai from 'clarifai';

const CLARIFAI_API = process.env.CLARIFAI_API;

const app = new Clarifai.App({
	apiKey: CLARIFAI_API,
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => res.status(400).json('Unable to connect with API'));
};

const handleImage = (req, res, db) => {
	const { id } = req.body;

	return db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			console.log(entries);
			res.json(entries[0]);
		})
		.catch((err) => res.status(400).json('Unable to get entries'));
};

export { handleImage, handleApiCall };
