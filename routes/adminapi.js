var express = require('express');
var router = express.Router();
var adminController=require('../controllers/adminController')
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
  adminController.login(req.body,function(data){
    res.json(data)
  })
});
// register
router.post('/register',function(req,res){
  adminController.register(req.body,function(data){
    res.json(data)
  })
});
// forget password
router.post('/forget-password',function(req,res){
  adminController.forgetPassword(req.body,function(data){
    res.json(data)
  })
});
module.exports = router;
