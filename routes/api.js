var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/catergoryController')
var usersController = require('../controllers/usersController')
var reviewController = require('../controllers/reviewController')
var ChatController = require('../controllers/ChatController')
var promoterController = require('../controllers/promoterController')
var postController = require('../controllers/postController')


var jwt = require('jsonwebtoken');
var config = require('../config')

function checkToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token);
  if (token) {


    jwt.verify(token, config.SECRET, function(err, decoded) {
      console.log("req.user : ", decoded, err);

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
  res.render('index', {
    title: 'welcome to localshop'
  });
});
//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A D M I N   R O U T E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
//login
router.post('/login', function(req, res) {
  usersController.login(req.body, function(data) {
    res.json(data)
  })
});
// register
router.post('/register', function(req, res) {
  usersController.register(req.body, function(data) {
    res.json(data)
  })
});
// update
router.post('/updateuser', function(req, res) {
  usersController.updateUser(req.body, function(data) {
    res.json(data)
  })
});

router.post('/fblogin', function(req, res) {
  usersController.fblogin(req.body, function(data) {
    res.json(data)
  })
});


// forget password
router.post('/forget-password', function(req, res) {
  usersController.forgetPassword(req.body, function(data) {
    res.json(data)
  })
});
//
// ────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: C A T E G O R Y   R O U T E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//
//  add
router.post('/add-category', function(req, res) {
  console.log(req.body)


  categoryController.addCategory(req.body, req.files, function(data) {
    res.json(data)
  })
});

//  add
router.post('/update-category', function(req, res) {
  categoryController.updateCategory(req.body, req.files, function(data) {
    res.json(data)
  })
});

//  get
router.get('/get-category', function(req, res) {


  categoryController.getCategory(req.query, function(data) {
    res.json(data)
  })
});

router.get('/get-vendor', function(req, res) {
  usersController.getVendorList(req.query, function(data) {
    res.json(data)
  })
})


router.post('/add-review', function(req, res) {
  reviewController.addReview(req.body, function(data) {
    res.json(data)
  })
})


router.get('/get-review', function(req, res) {
  reviewController.getReview(req.query, function(data) {
    res.json(data)
  })
})

router.get('/chatHistory', checkToken, function(req, res) {
  ChatController.chatHistory(req.query, req.user, function(data) {
    res.json(data);
  });
});

router.post('/newtextChat', checkToken, function(req, res) {
  //console.log(req.body)
  ChatController.newtextChat(req.body, req.user, function(data) {
    res.json(data);
  })
});
//
// ─── CHAT USER LIST ─────────────────────────────────────────────────────────────
//


router.get('/chat-user-list', checkToken, function(req, res) {
  usersController.chatUserList(req.body, req.user, function(data) {
    res.json(data);
  })
});



router.post('/add-promoter', function(req, res) {
  promoterController.addPromoter(req.body, req.files, function(data) {
    res.json(data);
  })
});


//  get
router.get('/get-promoter', function(req, res) {


  promoterController.getPromoter(req.query, function(data) {
    res.json(data)
  })
});

//  add
router.post('/update-promoter', function(req, res) {
  promoterController.updatepromoter(req.body, req.files, function(data) {
    res.json(data)
  })
});


//post api
router.post('/add-post', function(req, res) {
  postController.addPost(req.body, function(data) {
    res.json(data)
  })
});
router.post('/update-post', function(req, res) {
  postController.updatePost(req.body, function(data) {
    res.json(data)
  })
});
router.get('/get-post', function(req, res) {
  postController.getPost(req.body, function(data) {
    res.json(data)
  })
});
router.get('/get-post-details', function(req, res) {
  postController.getPostDetails(req.query, function(data) {
    res.json(data)
  })
});

router.post('/update-postimage', function(req, res) {
  postController.updatePostimage(req.body, req.files, function(data) {
    res.json(data)
  })
});


router.post('/update-tag', function(req, res) {
  categoryController.updateTag(req.body, function(data) {
    res.json(data)
  })
});

router.get('/get-tag', function(req, res) {
  categoryController.getTag(req.query, function(data) {
    res.json(data)
  })
});

router.post('/update-post-tag', function(req, res) {
  postController.updatePostTag(req.body, function(data) {
    res.json(data)
  })
});
router.post('/delete-post-tag', function(req, res) {
  postController.deletePostTag(req.body, function(data) {
    res.json(data)
  })
});

//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E A R C H   P O S T   B A S E D   O N   T A G   A N D   C A T E G O R Y : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//



router.post('/search', function(req, res) {
  postController.search(req.body, function(data) {
    res.json(data)
  })
});


router.get('/userdetails',checkToken, function(req, res) {
  usersController.userdetails(req.query,req.user, function(data) {
    res.json(data)
  })
});



router.post('/add-post-googleapi', function(req, res) {
  postController.addPostGoogleapi(req.body, function(data) {
    res.json(data)
  })
});


module.exports = router;