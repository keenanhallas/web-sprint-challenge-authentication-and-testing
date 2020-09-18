const bcrypt = require("bcryptjs");
const { response } = require("express");
const db = require("../database/dbConfig");

const router = require('express').Router();

router.get("/users", (req, res) => {
  console.log("getting");
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
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
