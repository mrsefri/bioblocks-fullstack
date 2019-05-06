const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
//const cookieParser = require('cookie-parser');
const PORT = 3000;
//const cors = require('cors');
const mysql = require('mysql');
const config = require('./db.js');
//const session = require('express-session');
const passport = require('passport');
const getRoute = require('./getRoute.js');
const putRoute = require('./putRoute.js');
const postRoute = require('./postRoute.js');
const deleteRoute = require('./deleteRoute.js');

//var db = mysql.createConnection(config);

/*const corsOptions = {
  origin: true,
  methods: ['GET, POST, OPTIONS, PUT, DELETE'],
  Credentials: true,
  maxAge: 24 * 60 * 60 * 1000
}
app.use(cors(corsOptions));*/

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(cookieSession({
  name: 'mysession',
  httpOnly: false,
  keys: ['vueauthrandomkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}));
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());

/*app.use(session({
  secret: 'secret', //Poner algo mas complejo 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: false, domain: 'localhost:8080',  }
}));*/
app.use(passport.initialize());
app.use(passport.session());
require("./passport.js")(passport);

app.use('/gets', getRoute);
app.use('/puts', putRoute);
app.use('/posts', postRoute);
app.use('/deletes', deleteRoute);

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});