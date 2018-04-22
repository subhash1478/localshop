var express = require('express');
var router = express.Router();
var categoryController=require('../controllers/catergoryController')
var usersController=require('../controllers/usersController')
var reviewController=require('../controllers/reviewController')
var ChatController=require('../controllers/ChatController')
var jwt = require('jsonwebtoken');
var config=require('../config')
function checkToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token);
  if (token) {


    jwt.verify(token, config.SECRET, function (err, decoded) {
      console.log("req.user : ",decoded, err);

          if (err) {


              res.status(403).json({
                  success: false,
                  message: "failed to authenticate"
              });
          } else {
              req.user = decoded;
              console.log("req.user : ", req.user);
              return next();
          }
      });
  } else {
      res.status(403).json({
          success: false,
          message: "token required"
      });
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'welcome to localshop' });
});
//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A D M I N   R O U T E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
//login
router.post('/login',function(req,res){
  usersController.login(req.body,function(data){
    res.json(data)
  })
});
// register
router.post('/register',function(req,res){
  usersController.register(req.body,function(data){
    res.json(data)
  })
});
// update
router.post('/updateuser',function(req,res){
  usersController.updateUser(req.body,function(data){
    res.json(data)
  })
});

router.post('/fblogin',function(req,res){
  usersController.fblogin(req.body,function(data){
    res.json(data)
  })
});


// forget password
router.post('/forget-password',function(req,res){
  usersController.forgetPassword(req.body,function(data){
    res.json(data)
  })
});
//
// ────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: C A T E G O R Y   R O U T E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//
//  add
router.post('/add-category',function(req,res){
  categoryController.addCategory(req.body,function(data){
    res.json(data)
  })
});

//  add
router.post('/update-category',function(req,res){
  categoryController.updateCategory(req.body,function(data){
    res.json(data)
  })
});

//  get
router.get('/get-category',function(req,res){
  categoryController.getCategory(req.query,function(data){
    res.json(data)
  })
});

router.get('/get-vendor',function(req,res){
  usersController.getVendorList(req.query,function(data){
    res.json(data)
  })
})


router.post('/add-review',function(req,res){
  reviewController.addReview(req.body,function(data){
    res.json(data)
  })
})


router.get('/get-review',function(req,res){
  reviewController.getReview(req.query,function(data){
    res.json(data)
  })
})

router.get('/chatHistory',checkToken, function (req, res) {
  ChatController.chatHistory(req.query, req.user, function (data) {
      res.json(data);
  });
});

router.post('/newtextChat',checkToken, function (req, res) {
//console.log(req.body)
   ChatController.newtextChat(req.body, req.user, function (data) {
      res.json(data);
 })
});
//
// ─── CHAT USER LIST ─────────────────────────────────────────────────────────────
//

  
 router.get('/chat-user-list',checkToken, function (req, res) {
  usersController.chatUserList(req.body, req.user, function (data) {
      res.json(data);
  })
});


module.exports = router;
