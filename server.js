const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;
const db = require("./models/workout");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workouts", {
	useNewUrlParser: true,
	useFindAndModify: false
});

// routes
app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/exercise", function(req, res) {
	res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", function(req, res) {
	res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.post("/api/workouts", function(req, res) {
	db.create(req.body).then(data => res.json(data));
});

app.get("/api/workouts", function(req, res) {
	db.find().then(results => {
		console.log(results[results.length - 1]);
		res.json(results[results.length - 1]);
	});
});

app.get("/api/workouts/range", function(req, res) {
	db.find().then(data => {
		console.log(data);
		res.json(data);
	});
});

app.put("/api/workouts/:id", function(req, res) {
	console.log(req.body);
	db.update(
		{ _id: req.params.id },
		{ $push: { exercises: req.body } }
	).then(response => res.json(response));
});

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`);
});