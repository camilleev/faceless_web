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

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var testEmail = regex.test(String(req.body.email).toLowerCase());

  if(!testEmail){
    emailError = "Cela ne ressemble pas à un email"
    check = false
  }

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

    var conv = new ConversationsModel({
      participants: [user._id, '605bc7d2b47905ffd6040ede'
      ],
      demand: true
    })
  
    var newConv = await conv.save()

    var msg = new MessagesModel({
      conversation_id: newConv._id,
      from_id: '605bc7d2b47905ffd6040ede',
      to_id: user._id,
      content: "Bienvenue sur Faceless, Tu viens de recevoir ton premier message ! Si tu y reponds, tu le verras passer en confident ",
      date: new Date(),
      read: false
    })
    
    var newMsg = await msg.save()

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


  var conversationsWithId = []

  if (conversations != undefined) {
    for (var i = 0; i < conversations.length; i++) {
      JSON.stringify(conversations[i].participants[0]) === JSON.stringify(me._id) ? conversationsWithId.push(conversations[i].participants[1]) : conversationsWithId.push(conversations[i].participants[0])
    }
  }


  //display User NOT ME + IS_ADULT?
  var userAdult = await UserModel.find({
    token: { $ne: req.body.token },
    _id: { $nin: conversationsWithId },
    is_adult: me.is_adult,
  })


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
    res.json({result: true, userToDisplay: userFilterOnLocation, me, myFilter});
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

  var user = await UserModel.findOne(
    { token: req.body.myToken }
  )

  var conv = new ConversationsModel({
    participants: [req.body.myContactId, user._id],
    demand: true
  })

  var newConv = await conv.save()

  res.json({
    result: true,
    convId: newConv._id,
  });

});


router.post('/send-msg', async function (req, res, next) {

  const user = await UserModel.findOne({
    token: req.body.token
  })

  const convWithUser = await ConversationsModel.findOne({
    _id: req.body.convId
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

  if (convWithUser.demand) {
    var allMsg = await MessagesModel.find(
      { conversation_id: convWithUser._id }
    )

    for (var i = 0; i < allMsg.length; i++) {
      if (JSON.stringify(allMsg[i].to_id) == JSON.stringify(user._id)) {
        // condition fonctionnelle mais à améliorer
        var updateStatusConv = await ConversationsModel.updateOne(
          { _id: convWithUser._id },
          { demand: false }
        );
      }
    }
  }
  
  res.json({ result: true });
});

router.post('/show-convers', async function (req, res, next) {

  let conversations = []
  let askNewConversation = false
  let nbNewConversations = 0
  let nbUnreadMsg = 0
  let convWithUnreadMsg = []


  if (req.body.demand == 'true') {
    askNewConversation = true
  } 
  
  const user = await UserModel.findOne({
    token: req.body.token
  })

  const myConnectedId = user._id
  
  const blockedBy = user.blocked_by_id
  const allBlockedId = blockedBy.concat(user.blocked_user_id)

  // compter le nb de demandes de conversation
  const allConversations = await ConversationsModel.find({
    participants: { $in: [user._id], $nin: allBlockedId},
  })

  allConversations.forEach(element => {
    nbNewConversations = element.demand === true ? ++nbNewConversations : nbNewConversations
  });

  // load les conversations avec mes contacts
  const conversationsPerPart = await ConversationsModel.find({
    participants: { $in: [user._id], $nin: allBlockedId },
    demand: askNewConversation,
  })

  var allUnreadMsg = await MessagesModel.find({
    to_id: myConnectedId,
    demand: false,
    read: false,
  })

  nbUnreadMsg = allUnreadMsg.length

  var unique = allUnreadMsg.map((item) => {
    return item.conversation_id.toString()
  })
  
  convWithUnreadMsg = [...new Set(unique)];
  
  if(conversationsPerPart.length == 0){
    res.json({result : false, conversations, nbNewConversations, nbUnreadMsg, convWithUnreadMsg})
  } else {
    await Promise.all(conversationsPerPart.map(async (element, index) => {
  
      // // construit un tableau listant le dernier message de chaque conversation
      var lastMsg = await MessagesModel.find({
        conversation_id: element._id
      })
        .sort({ date: -1 })
        .limit(1)
    
      // construit un tableau des infos de mes contacts (avatar, pseudo...)
      const notMe = JSON.stringify(element.participants[0]) === JSON.stringify(user._id) ? element.participants[1] : element.participants[0]
  
  
      let myFriend = await UserModel.findById(notMe)
    
      if(lastMsg.length === 0){
        conversations.push({
          friendsData: myFriend,
          conversationsData: {
            lastMessage: {
              conversation_id: element._id,
              from_id: user._id,
              to_id: myFriend._id,
              date: new Date(),
              content: "nouvelle conversation"
            }
          }
        }
        )
      } else {
        conversations.push({
          friendsData: myFriend,
          conversationsData: {lastMessage: lastMsg[0]}
        }
        )
      }
  
    }))
  
    // tri du tableau 
    conversations.sort((a, b) => {
      // par date dernier message
      if (a.conversationsData.lastMessage && b.conversationsData.lastMessage) {
        return a.conversationsData.lastMessage.date > b.conversationsData.lastMessage.date ? -1 : 1
      }
    })
  
    res.json({result : true, conversations, lastConvId: conversations[0].conversationsData.lastMessage.conversation_id, lastContactId: conversations[0].friendsData._id, nbNewConversations, askNewConversation, nbUnreadMsg, convWithUnreadMsg})
  
  }
});

router.post('/show-msg', async function(req, res, next) {

  const me = await UserModel.findOne({
    token: req.body.token
  })

  const friend = await UserModel.findOne({
    _id: req.body.myContactId
  })

  const allMsgWithUser = await MessagesModel.find(
    {conversation_id: req.body.convId}
  )

  if (me) {
    await MessagesModel.updateMany({ to_id: me._id, conversation_id: req.body.convId }, { read: true })
  }

  res.json({result: true, allMsgWithUser, avatar: me.avatar, friendData: friend});
});

router.post('/block-user', async function(req, res, next) {

  const me = await UserModel.findOne({
    token: req.body.token
  })
  
  var userUpdate = await UserModel.updateOne(
    { _id: me._id},
    { $push: { blocked_user_id: req.body.userToblock} }
  );

  var confidentUpdate = await UserModel.updateOne(
    { _id: req.body.userToblock},
    { $push: { blocked_by_id: me._id } }
  );

  res.json({result: true});
});

router.post('/update-profil', async function(req, res, next) {

  const me = await UserModel.findOne({
    token: req.body.token
  })

  if(JSON.stringify(req.body.localisation) != JSON.stringify(me.localisation.label)){
    var updateLocalisation = await UserModel.updateOne(
      { _id: me._id},
      {localisation: {label: req.body.localisation, coordinates: JSON.parse(req.body.coordinates)}}
    );
  }

  if(req.body.desc != ''){
    var updateDesc = await UserModel.updateOne(
      { _id: me._id},
      {problem_description: req.body.desc}
    );
  }

  var updateProblemType = await UserModel.updateOne(
    { _id: me._id},
    {problems_types: JSON.parse(req.body.allProblemList)}
  );

  if(req.body.pseudo != ''){
    var updatePseudo = await UserModel.updateOne(
      { _id: me._id},
      {pseudo : req.body.pseudo}
    );
  }

  res.json({result: true});
});


module.exports = router;
