var express = require('express');
var router = express.Router();
var categoryController=require('../controllers/catergoryController')
var usersController=require('../controllers/usersController')
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
module.exports = router;
