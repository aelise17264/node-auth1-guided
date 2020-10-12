const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/auth-router')
const server = express();

const protected = require('../auth/protected-mw')
const session = require('express-session')
const sessionConfiguration = {
  name: 'monster', //defaults to sid for the cookie name if we don't provide one
  secret: process.env.SESSION_SECRET || 'the phantom enters but there is no one',
  cookie:{
    httpOnly: true, //true means JS can't access the cookie data, always set to true
    maxAge: 1000 * 60 * 10, //expires after 10 mins, depends on the requirements of the company
    secure: process.env.SECURE_COOKIES || false, //true means send cookies over https only, set to false during development
  },
  resave: false, //re save the session info even if there are no changes
  saveUninitialized: true, //read about GDPR compliance, if you don't have a session is the user ok receiving cookies?, depends on what the client wants
}


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration))

server.use('/api/auth', authRouter)
server.use("/api/users", protected, usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up",
  session: req.session });
});

module.exports = server;
