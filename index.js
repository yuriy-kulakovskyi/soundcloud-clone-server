const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require("./Routes/userRoute");
const songRoute = require("./Routes/songRoute");
const path = require('path');
const fs = require('fs');

const app = express();
require("dotenv").config();

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/songs", songRoute);

const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));

const songsDir = path.join(__dirname, 'public', 'uploads', 'songs');
if (!fs.existsSync(songsDir)) {
  fs.mkdirSync(songsDir, { recursive: true });
}

app.use('/uploads/songs', express.static(path.join(__dirname, 'public', 'uploads', 'songs')));

const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port}`);
});

mongoose.connect(uri).then(() => console.log("Mongo connection established")).catch((err) => console.log("Mongo connection failed: ", err.message))