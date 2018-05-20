//
// ────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C A T E G O R Y   C O N T R O L L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//
var categoryModel = require('../models/categoryModel');
var tagModel = require('../models/tagModel');
var postimgesModel = require('../models/postimgesModel');
var postModel = require('../models/postModel');
var postimgesModel = require('../models/postimgesModel');
var config = require('../config')
var async = require('async');
var postController = {
  addPost: function(request_data, callback) {
    var postModelData = new postModel({
      title: request_data.title,
      category: request_data.category,
      description: request_data.description,
      userid: request_data.userid,
    })
    console.log(postModelData)
    postModelData.save(function(err, response) {
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        callback({
          success: true,
          message: 'succesfully added',
          data: response
        })
      }
    })
  },
  //
  // ─── GET CATEGORY ───────────────────────────────────────────────────────────────
  //
  getPost: function(request_data, callback) {
    postModel.find({})
    .populate({
      path: 'category userid'
    })
    .exec(function(err, response) {
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        var cat = [];
        async.each(response, function(item, cb) {
          console.log("crash", item);
          postimgesModel.find({
            postid: item._id
          })
          .select('image -_id')
          .exec(function(err, response) {
            console.log('postimgesModel', response)
            var res = {}
            res['title'] = item.title,
            res['description'] = item.description,
            res['category'] = item.category,
            res['userid'] = item.userid,
            res['tags'] = item.tags,
            res['viewed'] = item.viewed
            res['_id'] = item._id
            if (response.length > 0) {
              res['images'] = config.SITE_BASE_URL + "image/postimage/" + response[0].image
            } else {
              res['images'] = response
            }
            cat.push(res)
            cb()
          })
        }, function() {
          callback({
            success: true,
            message: 'succesfully fetch',
            data: cat
          })
        })
      }
    })
  },
  updatePost: function(request_data, callback) {
    var postModelData = {
      title: request_data.title,
      category: request_data.category,
      description: request_data.description,
    }
    var cond = {
      _id: request_data._id
    },
    options = {
      multi: true
    };
    postModel.update(cond, postModelData, options, function(err, response) {
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        callback({
          success: true,
          message: 'succesfully updated',
          data: response
        })
      }
    });
  },
  updatePostimage: function(request_data, request_files, callback) {
    var item = request_files.uploads;
    var filename = new Date().getTime() + item.name
    console.log(filename);
    item.mv('public/image/postimage/' + filename, function(err, success) {
      var postimgesModelData = new postimgesModel({
        postid: request_data.id,
        image: filename
      })
      postimgesModelData.save(function(err, success) {
        if (err) {
          callback({
            success: false,
            message: success
          })
        } else {
          callback({
            success: true,
            message: 'success'
          })
        }
      })
    });
  },
  updatePostTag: function(request_data, callback) {
    async.waterfall([
      updateTagdata
    ], function(err, success) {
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        callback({
          success: true,
          data: success
        })
      }
    })
    function updateTagdata(callback) {
      var cond = {
        _id: request_data.id
      }
      postModel.findByIdAndUpdate(cond, {
        "$addToSet": {
          "tags": request_data.tagname
        }
      }).exec(function(err, res) {
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
  },
  deletePostTag: function(request_data, callback) {
    console.log('request_data', request_data)
    postModel.update({
      _id: request_data.id
    }, {
      $pull: {
        tags: request_data.tagname
      }
    }).exec(function(err, res) {
      console.log(err, res)
    })
  },
  getPostDetails: function(request_data, callback) {
    async.waterfall([getPost,
      getpostwithimage
    ], function(err, success) {
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        callback({
          success: true,
          data: success
        })
      }
    })
    function getPost(callback) {
      postModel.findOne({
        _id: request_data.id
      })
      .populate({
        path: 'category userid',
      })
      .exec(function(err, res) {
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
    function getpostwithimage(response, callback) {
      var obj = {}
      postimgesModel.find({
        postid: response._id
      })
      //  .select('image -_id')
      .exec(function(err, res) {
        obj['post'] = response
        obj['image'] = res
        obj['tags'] = response.tags
        obj['user'] = response.userid
        obj['category'] = response.category
        callback(null, obj)
      })
    }
  },
  //
  // ─── SEARCH POST BASED ON CATEGORY AND TAG ──────────────────────────────────────
  //
  search: function(request_data, callback) {
    async.waterfall([
      getpost, getpostwithimage
    ], function(err, success) {
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        callback({
          success: true,
          data: success
        })
      }
    })
    function getpost(callback) {
      console.log('request_data', request_data)
      if (request_data.type == 'category') {
        var query = {
          category: request_data.catid
        }
      }
      if (request_data.type == 'tags') {
        var query = {
          $or: [{
            tags: {
              $regex: '^' + request_data.q + '$',
              $options: 'i'
            }
          },
          {
            title: {
              $regex: request_data.q,
              $options: 'i'
            }
          }
        ]
      }
    }
    console.log(query);
    postModel.find(query).exec(function(err, res) {
      if (err) {
        callback(err)
      } else {
        callback(null, res)
      }
    })
  }
  function getpostwithimage(response, callback) {
    console.log('postimgesModel', response)
    var cat = [];
    async.each(response, function(item, cb) {
      console.log("crash", item);
      postimgesModel.find({
        postid: item._id
      })
      .select('image -_id')
      .exec(function(err, response) {
        var res = {}
        res['title'] = item.title,
        res['description'] = item.description,
        res['category'] = item.category,
        res['tags'] = item.tags,
        res['viewed'] = item.viewed
        res['_id'] = item._id
        if (response.length > 0) {
          res['images'] = config.SITE_BASE_URL + "image/postimage/" + response[0].image
        } else {
          res['images'] = response
        }
        cat.push(res)
        cb()
      })
    }, function() {
      callback(null, cat)
    })
  }
},
addPostGoogleapi:function(request_data,callback){
  async.waterfall([
    checkpostvalidation,
    addpost,
    addimage
  ],function(err,success){
    if (err) {
      callback({
        success: false,
        message: err
      })
    } else {
      callback({
        success: true,
        data: success
      })
    }
  })
  function checkpostvalidation(callback){
    postModel.count({title:request_data.title,category:request_data.category})
    .exec(function(err,count){
      if(err){
        callback(err)
      }else{
        if(count>0){
          callback('already exist')
        }else{
          callback(null,count)
        }
      }
    })
  }
  function addpost(count,callback){
    
    var postModelData = new postModel({
      title: request_data.title,
      category: request_data.category,
      description: request_data.description,
      userid: request_data.userid,
      phone: request_data.phone,
      address: request_data.address,
      timing: request_data.timing,
      rating: request_data.rating,
      location:request_data.location,
      website:request_data.website
    })

    postModelData.save(function(err, response) {
      if (err) {
        callback(err)
        
      } else {
        callback(null,response)
        
      }
    })
  }
  function addimage(postdata,callback){
    
    async.each(request_data.photo,function(item,cb){
       
      var filename = new Date().getTime()+'.jpg'
      
      var dest= 'public/image/postimage/'+filename        
         
      var fs      = require('fs');
      var request = require('request');
      request.get({url: item, encoding: 'binary'}, function (err, response, body) {
        fs.writeFile(dest, body, 'binary', function(err) {
          
          var postimgesModelData = new postimgesModel({
            postid: postdata._id,
            image: filename
          })
          console.log(postdata._id);

          
          postimgesModelData.save(function(err, success) {

            
            cb(null,success)
          })
          
        }); 
      });
      
      
    },function(){
      callback(null,'done')
    })
    
    
  }
  
  
}
}
module.exports = postController