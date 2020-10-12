const router = require("express").Router();
const bcrypt = require('bcrypt')
const Users = require("../users/users-model.js");

// /auth/register
router.post("/register", (req, res) => {
  const credentials = req.body
//validate the credentials, if they are valid proceed
  //hash the password before saving the user
  //const rounds = 8; //the higher the number, the more secure the password is
  //good starting point is 12-14, this will go a little slow on our computers but will go faster on the company server
  //to make this number dynamic:
  const rounds = process.env.HASH_ROUNDS || 6

  const hash = bcrypt.hashSync(credentials.password, rounds);
  
  credentials.password = hash; //over writes the password w/ a hash
  
    Users.add(credentials)
    .then(user => {
      res.status(201).json({data: user});
    })
    .catch(err => res.json({message: err.message}));
});

module.exports = router;

// "id": 1,
// "username": "sam",
// "password": "$2b$06$pAvJ2J8Fjz0ua1p0jUpWDuRlqoiBCqQjSH3hRK1qPilmiLVc1yJ8e",