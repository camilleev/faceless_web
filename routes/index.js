var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2');

const UserModel = require('../models/users');
const FilterModel = require('../models/filters');
const ConversationsModel = require('../models/conversations');
const MessagesModel = require('../models/messages')
const { get } = require('mongoose');

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
    var tabAge = [15, 18]
    if(userAge >= 18){
      isAdult = true
      tabAge = [18, 100]
    }


    //creation d'un nouvel utilisateur
    var newUser = new UserModel ({
      email: req.body.email,
      password: hash,
      pseudo: req.body.pseudo,
      birthDate: new Date(req.body.birthday), 
      problems_types: JSON.parse(req.body.problemsTypes),
      subscriptionDate: new Date(),
      token: uid2(32),
      is_adult: isAdult
    });
  
    var user = await newUser.save();

    var newFilters = new FilterModel({
      problems_types: JSON.parse(req.body.problemsTypes),
      is_adult: isAdult,
      user : user._id,
      gender: ["other", "female", "male"],
      age: tabAge
    })

    var filters = await newFilters.save();

    result = true
    res.json({ userId: user._id , result, token: user.token});
  }

  res.json({result, emailError, pseudoError});
});

router.post('/update-user', async function(req, res, next) {

  var localisation = "France"
  var coordinates = []
  var gender = req.body.gender
  if(req.body.localisation) {
    localisation = req.body.localisation
    coordinates = req.body.coordinates
  }

  if(req.body.gender === ""){
    gender = "other"
  }

  var user = await UserModel.updateOne(
    {_id: req.body.userId},
    {
      problem_description: req.body.desc,
      localisation: {label: localisation, coordinates: JSON.parse(req.body.coordinates)},
      gender : gender,
      avatar : req.body.avatar,
    }
  )

  var newFilters = await FilterModel.updateOne(
    {user: req.body.userId},
    {localisation: 800}
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

  const searchUser = await UserModel.findOne(
    {_id: req.body.userId}
  )

  var myFilter = await FilterModel.findOne(
    {user: searchUser._id}
  )

  res.json({result: true, token: searchUser.token, myFilter});
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

        if(bcrypt.compareSync(password,searchUser.password)){
          result = true
          token = searchUser.token 
        } else {
          errorPassword = "mot de passe incorrect"
        }

        var myFilter = await FilterModel.findOne(
          {user: searchUser._id}
        )

        // console.log("myFilter", myFilter)
      } else {
        errorMail = "mail invalide"
      }
    }

    res.json({result, token, errorMail, errorPassword, myFilter});
  
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

router.post('/show-card', async function(req, res, next) {
  
  var me = await UserModel.findOne(
    { token: req.body.token }
  )

  var myFilter = await FilterModel.findOne(
    {user: me._id}
  )
  
  //CALCUL DISTANCE
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    // console.log(lat1, lat2, lon1, lon2)
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  var conversations = await ConversationsModel.find({
    participants: me._id,
  })

  // console.log('conversations', conversations)

  var conversationsWithId = []

  if (conversations != undefined) {
    for (var i = 0; i < conversations.length; i++) {
      JSON.stringify(conversations[i].participants[0]) === JSON.stringify(me._id) ? conversationsWithId.push(conversations[i].participants[1]) : conversationsWithId.push(conversations[i].participants[0])
    }
  }

  // console.log("conversationsWithId", conversationsWithId)


  //display User NOT ME + IS_ADULT?
  var userAdult = await UserModel.find({
    token: { $ne: req.body.token },
    _id: { $nin: conversationsWithId },
    is_adult: me.is_adult,
  })

  // console.log("userAdult", userAdult)

  //FILTER BY AGE
  var userFilteredByAge = []
  for (let i=0; i< userAdult.length; i++){
    if(getAge(userAdult[i].birthDate)>myFilter.age[0] && getAge(userAdult[i].birthDate)<myFilter.age[1]){
      userFilteredByAge.push(userAdult[i]);
    }
  }

  //FILTER USER BY GENDER 
  var userFilteredByGender = [];
  for (let i = 0; i < userFilteredByAge.length; i++) {
    if (myFilter.problems_types.some((element) => userFilteredByAge[i].problems_types.includes(element)) == true &&
      // user.blocked_user_id.includes(userAdult[i]._id) == false &&
      // user.blocked_by_id.includes(userAdult[i]._id) == false) {
        myFilter.gender.includes(userFilteredByAge[i].gender) == true ) {
        userFilteredByGender.push(userFilteredByAge[i]);
    }
  }


  let userFilterOnLocation = [];
  if (myFilter.localisation == 800) {
    res.json({result: true, userToDisplay: userFilteredByGender, me, myFilter})
  } else {
    for (var i = 0; i < userFilteredByGender.length; i++) {
      if (userFilteredByGender[i].localisation.coordinates[0]) {
        let distance = getDistanceFromLatLonInKm(me.localisation.coordinates[0], me.localisation.coordinates[1], userFilteredByGender[i].localisation.coordinates[0], userFilteredByGender[i].localisation.coordinates[1])
        if (distance <= myFilter.localisation) {
          userFilterOnLocation.push(userFilteredByGender[i])
        }
      }
    }
    res.json({result: true, userToDisplay: userFilteredByGender, me, myFilter});
  }

});

router.post('/update-filter', async function(req, res, next) {

  var user = await UserModel.findOne(
    { token: req.body.token }
  )

  var filter = await FilterModel.updateOne(
    {user: user._id},
    {
      problems_types: JSON.parse(req.body.allProblemList),
      localisation: req.body.localisation,
      gender : JSON.parse(req.body.allGenderList),
      age : JSON.parse(req.body.age)
    }
  )

  var newFilter = await FilterModel.findOne(
    {user: user._id}
  )

  res.json({result: true, filter: newFilter});
});


router.post('/create-conv', async function (req, res, next) {
  // console.log(" req.body.myContactId", req.body.myContactId)
  // console.log(" req.body.myToken", req.body.myToken)

  var user = await UserModel.findOne(
    { token: req.body.myToken }
  )

  var conv = new ConversationsModel({
    participants: [req.body.myContactId, user._id],
    demand: true
  })

  var newConv = await conv.save()

  console.log("newConv", newConv)

  res.json({
    result: true,
    convId: newConv._id,
  });

});


router.post('/send-msg', async function (req, res, next) {
  
  // const searchConvWithUser = await ConversationsModel.findOne({
  //   participants: { $all: [req.body.myId, req.body.myContactId] }
  // })

  const user = await UserModel.findOne({
    token: req.body.token
  })
  
  var msg = new MessagesModel({
    conversation_id: req.body.convId,
    from_id: user._id,
    to_id: req.body.myContactId,
    content: req.body.msg,
    date: new Date(),
    read: false
  })
  
  var newMsg = await msg.save()
  
  res.json({ result: true });
});

router.post('/show-convers', async function (req, res, next) {

  let friendsData = []
  let conversations = []
  let conversationsData = []
  let askNewConversation = false
  let nbNewConversations = 0

  // if (req.query.demandes && req.query.demandes === 'oui') {
  //   askNewConversation = true
  // }

  // if (req.query && req.query.user_id === '') {
  //   res.json({
  //     conversations
  //   })
  // }

  // console.log("req.body.token", req.body.token)
  
  const user = await UserModel.findOne({
    token: req.body.token
  })
  
  // console.log("user", user)
  // console.log("user", user._id)
  const myConnectedId = user._id

  // console.log("myConnectedId", myConnectedId)


  // const blockedBy = user.blocked_by_id
  // const allBlockedId = blockedBy.concat(user.blocked_user_id)

  // console.log("allBlockedId", allBlockedId)

  // compter le nb de demandes de conversation
  // const allConversations = await ConversationsModel.find({
  //   participants: { $in: [myConnectedId]},
    // participants: { $in: [myConnectedId], $nin: allBlockedId },
  // })
  // console.log("allConversations", allConversations)
  // allConversations.forEach(element => {
  //   nbNewConversations = element.demand === true ? ++nbNewConversations : nbNewConversations
  // });

  // load les conversations avec mes contacts
  const conversationsPerPart = await ConversationsModel.find({
    participants: { $in: [myConnectedId] },
    // participants: { $in: [myConnectedId], $nin: allBlockedId },
    // demand: askNewConversation,
  })

  console.log('conversationsPerPart = ', conversationsPerPart)

  await Promise.all(conversationsPerPart.map(async (element, index) => {
    // compter les messages non lus par l'utilisateur de l'app
    // var allUnreadMsg = await MessagesModel.find({
    //   conversation_id: element._id,
    //   to_id: new ObjectId(myConnectedId),
    //   read: false,
    // })

    // // construit un tableau listant le dernier message de chaque conversation
    var lastMsg = await MessagesModel.find({
      conversation_id: element._id
    })
      .sort({ date: -1 })
      .limit(1)

    // console.log("lastMsg :", index, "//", lastMsg)

    // var allMsg = await MessagesModel.find({
    //   conversation_id: element._id
    // })


    // construit un tableau des infos de mes contacts (avatar, pseudo...)
    const notMe = JSON.stringify(element.participants[0]) === JSON.stringify(myConnectedId) ? element.participants[1] : element.participants[0]


    let myFriend = await UserModel.findById(notMe)

    // le confindent est Online ?? analyse date dernier message
    // const lastMsgFriend = await MessagesModel.findOne({
    //   from_id: notMe,
    // }).sort({ date: -1 })


    // now = new Date()

    // let statusOnLine = 'off'
    // if (lastMsgFriend) {
    //   statusOnLine = now - lastMsgFriend.date < 900000 ? 'on' : 'recent'    // - de 15 min, soit 1000 * 15 * 60 = 900000 ms
    //   statusOnLine = now - lastMsgFriend.date < 1800000 ? 'recent' : 'off'  // - de 30 min, soit 1000 * 30 * 60 = 1800000 ms
    //   if (myFriend) { // si !null (cas utilisateur supprimé DB)
    //     myFriend = { ...myFriend.toObject(), statusOnLine }
    //   }
    // }

    if(lastMsg.length === 0){
      friendsData.push(myFriend)
      conversationsData.push({
        lastMessage: {
          conversation_id: element._id,
          from_id: myConnectedId,
          to_id: myFriend._id,
          date: new Date(),
          content: "nouvelle conversation"
        },
      })
      // console.log("conversationsData", conversationsData)
    } else {
      friendsData.push(myFriend)
      conversationsData.push({
        // nbUnreadMsg: allUnreadMsg.length,
        lastMessage: lastMsg[0],
        // friendsDatas: myFriend,
      })
    }

  }))

  // tri du tableau 
  // conversationsData.sort((a, b) => {
  //   // par date dernier message
  //   if (a.lastMessage && b.lastMessage) {
  //     return a.lastMessage.date > b.lastMessage.date ? -1 : 1
  //   }
  // })
  // conversations.sort((a, b) => a.nbUnreadMsg > b.nbUnreadMsg ? -1 : 1) // messages non lus en 1er

  console.log("conversationsData", conversationsData)
  // res.json({
  //   conversations,
  //   nbNewConversations,
  // })

  res.json({result : true, friendsData, conversationsData})
});

router.post('/show-msg', async function(req, res, next) {

  const me = await UserModel.findOne({
    token: req.body.token
  })

  const friend = await UserModel.findOne({
    _id: req.body.  myContactId
  })

  const allMsgWithUser = await MessagesModel.find(
    {conversation_id: req.body.convId}
  )

  res.json({result: true, allMsgWithUser, avatar: me.avatar, friendData: friend});
});


module.exports = router;
