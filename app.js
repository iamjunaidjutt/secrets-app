require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", (err) => {
    if (err) console.log(err.message);
    else {
        console.log("Connected to MongoDB");
    }
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            email: req.body.username,
            password: hash
        });
    
        user.save((err) => {
            if (err) console.log(err.message);
            else {
                console.log("Successfully registered!");
                res.render("secrets");
            }
        });
    });
});

app.post("/login", (req, res) => {
    const enteredEmail = req.body.username;
    const password = req.body.password;

    User.findOne({email: enteredEmail}, (err, user) => {
        if (err) console.log(err.message);
        else {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result === true) {
                        res.render("secrets");
                    } else {
                        res.send("Incorrect Password!");
                    }
                });
            }
        }
    });

});




app.listen(3000, () => {
    console.log("Server running at port 3000");
});
