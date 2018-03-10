var express = require('express');
var router = express.Router();
var categoryController=require('../controllers/catergoryController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'localshop' });
});

router.post('/add-category',function(req,res){
categoryController.addCategory(req.body,function(data){

res.json(data)

})
  
})

module.exports = router;
