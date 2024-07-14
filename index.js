const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require("./Routes/userRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port}`);
});

mongoose.connect(uri).then(() => console.log("Mongo connection established")).catch((err) => console.log("Mongo connection failed: ", err.message))