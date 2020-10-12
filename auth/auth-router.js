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

router.post("/login", (req, res) => {
    const credentials = req.body
    
      Users.findBy({username: credentials.username})
      .then(users => {
        const user = users[0]

        if(user && bcrypt.compareSync(credentials.password, user.password)){
            //username & password are good
            req.session.username = user.username
            res.status(200).json({
                message: 'welcome',
                username: req.username})
        }else{
            res.status(401).json({message: 'invalid credentials'})
        }
      })
      .catch(err => res.json({message: err.message}));
  });

router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(error => {
            if(error){
                res.status(500).json({message: 'logout failed, please try later'})
            }else{
                res.status(204).end()
            }
        })
    }else{
        res.status(204).end()//204 = no content
    }
})

module.exports = router;

// "id": 1,
// "username": "sam",
// "password": "$2b$06$pAvJ2J8Fjz0ua1p0jUpWDuRlqoiBCqQjSH3hRK1qPilmiLVc1yJ8e",
// "role": "1"

// "id": 2,
// "username": "frodo",
// "password": "$2b$06$2wbWCbsJR3yQEL12RH6fJ.sP/Qs7F6jJlV7GkUzM2CUlsnoUkj88y",
// "role": 2