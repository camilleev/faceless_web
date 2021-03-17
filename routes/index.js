var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2');

const UserModel = require('../models/users');

//fonction pour récupérer l'age
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  var d = today.getDate() - birthDate.getDate();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
     age--; 
  }
  return age;
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render();
});

router.post('/new-user', async function(req, res, next) {

  var result = false
  var check = true
  var cost = 10
  var emailError
  var pseudoError

  var checkMail = await UserModel.findOne(
    {email: req.body.email}
  )

  var checkPseudo = await UserModel.findOne(
    {pseudo: req.body.pseudo}
  )

  if(checkPseudo){
    pseudoError = "Ce pseudo est déjà utilisé"
    check = false
  }
  if(checkMail){
    emailError = "Cet email est déjà utilisé"
    check = false
  }

  if(check){

    const hash = bcrypt.hashSync(req.body.password, cost);

    var isAdult = false
    var userAge = getAge(req.body.birthday)
    if(userAge >= 18){
      isAdult = true
    }

    console.log("userAge", userAge)

    //creation d'un nouvel utilisateur
    var newUser = new UserModel ({
      email: req.body.email,
      password: hash,
      pseudo: req.body.pseudo,
      birthDate: new Date(req.body.birthday), 
      problems_types: JSON.parse(`${req.body.problemsTypes}`),
      subscriptionDate: new Date(),
      token: uid2(32),
      is_adult: isAdult
    });
  
    var user = await newUser.save();

    result = true
    res.json({ userId: user._id , result, token: user.token});
  }

  res.json({result, emailError, pseudoError});
});

router.post('/update-user', async function(req, res, next) {

  console.log("req.body.gender", req.body.gender)
  var localisation = "France"
  if(req.body.localisation) {
    localisation = req.body.localisation
  }

  var user = await UserModel.updateOne(
    {_id: req.body.userId},
    {
      problem_description: req.body.desc,
      localisation: localisation,
      gender : req.body.gender,
      avatar : req.body.avatar,
    }
  )

  res.json({result: true});
});

router.post('/update-avatar', async function(req, res, next) {

  var user = await UserModel.updateOne(
    {_id: req.body.userId},
    {
      avatar : req.body.avatar,
    }
  )

  res.json({result: true});
});

router.post('/sign-in', async function(req,res,next){
    var result = false
    var errorMail
    var errorPassword
    var token = null

    var password = req.body.passwordFromFront
    var user = req.body.emailFromFront

    if(user === "" || password === "") {
      if(user === ""){
        errorMail = "champ vide"
      }
      if(password === ""){
        errorPassword = "champ vide"
      }
    } else {

      //recherche exist user
      const searchUser = await UserModel.findOne({
        email: req.body.emailFromFront
      })
  
      if(searchUser){

        console.log("hash", password)
        console.log("searchUser.password", searchUser.password)

        if(bcrypt.compareSync(password,searchUser.password)){
          result = true
          token = searchUser.token 
        } else {
          errorPassword = "mot de passe incorrect"
        }
      } else {
        errorMail = "mail invalide"
      }
    }
    console.log("errorPassword", errorPassword)
    console.log("errorMail", errorMail)

    res.json({result, token, errorMail, errorPassword});
  
})

router.post('/find-user', async function(req, res, next) {

  var result = false
  
  var user = await UserModel.findOne(
    { token: req.body.token }
  )

  if(user){
    result = true
  }

  res.json({result, user});
});


module.exports = router;
