var express = require('express');
var router = express.Router();

var usersRouter = require('./users.js');

/* GET page after logged in. */
router.get('/', function (req, res, next) {
    console.log(req.email);
    res.render('home',
        { title: `You are logged in as ${usersRouter.User.email}` });
});

module.exports = { router };
