const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const passport = require("passport")
const app = express();

//引入users.js
const users = require('./routes/api/users')

//DB config
const db = require("./config/keys").mongoURI
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//connect to mongodb
mongoose.connect(db)
        .then(() => console.log("mongoDB Connect"))
        .catch(err => console.log(err))
app.use(passport.initialize())
app.get("/", (req, res) => {
    res.send("hello world!");
})

app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log( `Server running on port ${port}` )
})