const bcrypt = require("bcryptjs");
const { response } = require("express");
const db = require("../database/dbConfig");

const router = require('express').Router();

router.get("/users", (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json({ users: users });
    })
    .catch(err => {
      res.status(500).json({ message: "User couldn't be added" });
    });
})

router.post('/register', (req, res) => {
  // implement registration
  if(req.body.username && req.body.password){
    let user = req.body;
    const rounds = process.env.BCRYPT_ROUNDS || 4;
    
    user.password = bcrypt.hashSync(user.password, rounds);
    
    db("users")
    .insert(user)
    .then(response => {
      res.status(201).json({ message: "User registered" });
    })
    .catch(err => {
      res.status(500).json({ message: "User couldn't be added" });
    });
  } else {
    res.status(500).json({ message: "Please supply both a username & password" });
  }
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;
  if(username && password) {  
    db("users")
      .where("username", "=", username)
      .first()
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
          req.session.user = user;
          res.status(200).json({ Message: `Welcome ${user.username}!` });
        }
      })
      .catch(err => {
        res.status(401).json({ message: "Invalid credentials" });
      });
  } else {
      res.status(500).json({ message: "Please supply both a username & password" });
    }
});

module.exports = router;
