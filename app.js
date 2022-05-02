/**
 * Module dependencies.
 */

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config({path: './.env'});


//Router (route handlers).

const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'html');
app.set('views', __dirname);
// app.use(session({secret : 'secret', saveUninitialized: true, resave: true}));

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.join(__dirname, '/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, '/dashboard.html'));
})

app.get("/profile.html", (req, res) => {
    res.sendFile(path.join(__dirname, '/profile.html'));
})

app.use('/user', userRoutes);

app.use('/recipes', recipeRoutes);

const listener = app.listen(process.env.PORT || 8080, () => {
    console.log('Your app is listening on port ' + listener.address().port);
}); 
