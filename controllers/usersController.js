var async = require('async');
var userModel = require('../models/usersModel')
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var CONFIG = require('../config')

function createToken(user) {
  //console.log(user)
  var tokenData = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname
  };
  var token = jwt.sign(tokenData, CONFIG.SECRET, {
    expiresIn: "30 days"
  });
  return token;
}
var usersController = {
  //
  // ──────────────────────────────────────────────────────────── I ──────────
  //   :::::: U S E R   L O G I N : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────
  //
  login: function(request_data, callback) {
    async.waterfall([

      emailCheck,
      loginCheck
    ], function(error, response) {

      if (error) {
        callback({
          success: false,
          message: error
        })
      } else {
        callback({
          success: true,
          data: response
        })
      }
    })

    function emailCheck(callback) {
      userModel.count({
          email: request_data.email,
          password: request_data.password
        })
        .exec(function(err, response) {
          if (err) {
            callback(err)
          } else {
            if (response > 0) {
              callback(null, response)
            } else {
              callback('invalid email')
            }
          }
        })
    }

    function loginCheck(emailCheck, callback) {
      userModel.findOne({
        email: request_data.email,
        password: request_data.password
      }).exec(function(err, res) {
        console.log(res, 'eres')
        if (err) {
          callback(err)
        } else {
          //   //console.log(res)
          var obj = {
            id: res._id,
            email: res.email,
            firstname: res.firstname,
            lastname: res.lastname
          }
          var Token = createToken(obj);
          //console.log(Token)
          var data = {
            token: Token,
            message: 'successfully login',
            userDetails: res
          }
          callback(null, data)

        }

      })

    }

  },

  userdetails:function(request_data,userData,callback){
    console.log('userData',userData)
    userModel.findOne({_id:userData.id}).exec(function(err,res){
      if (err) {
        callback({
          success: false,
          message: err
        })
      } else {
        callback({
          success: true,
          data: res
        })
      }
    })
  },
  //
  // ────────────────────────────────────────────────────────────────── II ──────────
  //   :::::: U S E R   R E G I S T E R : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────
  //
  register: function(request_data, callback) {
    async.waterfall([
      emailCheck,
      register
    ], function(error, response) {
      if (error) {
        callback({
          success: false,
          message: error
        })
      } else {
        callback({
          success: true,
          data: response
        })
      }
    })

    function emailCheck(callback) {
      userModel.count({
          email: request_data.email
        })
        .exec(function(err, response) {
          //console.log(response)
          if (err) {
            callback(err)
          } else {
            if (response < 1) {
              callback(null, response)
            } else {
              callback('email exist ')
            }
          }
        })
    }

    function register(emailCheck, callback) {
      //console.log(emailCheck)
      var userModelData = new userModel({
        firstname: request_data.firstname,
        lastname: request_data.lastname,
        location: request_data.location,
        address: request_data.address,
        category: request_data.category,
        phone: request_data.phone,
        email: request_data.email,
        password: request_data.password,
        state: request_data.state,
        city: request_data.city,
        zip: request_data.zip,
        country: request_data.country,
        rating: request_data.rating,
        shopname: request_data.shopname,
        online: request_data.online,
        profile_image: request_data.profile_image,
        type: request_data.type,
        category: request_data.category
      })
      userModelData.save(function(err, res) {
        //console.log(res)
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
  },

  //
  // ────────────────────────────────────────────────────────────────────  ──────────
  //   :::::: F A C E B O O K   L O G I N : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────
  //
  fblogin: function(request_data, callback) {
    async.waterfall([
      fbidcheck,
      registerFB,

    ], function(error, success) {
      if (error) {
        callback({
          success: false,
          message: error
        })
      } else {
        callback({
          success: true,
          data: success
        })
      }
    })

    function fbidcheck(callback) {
      userModel.count({
        facebook_id: request_data.facebook_id
      }).exec(function(err, res) {
        if (err) {
          callback(err)
        } else {
          //console.log('count',res)
          callback(null, res)
        }
      })
    }

    function registerFB(fbidcheck, callback) {
      //console.log(request_data)
      if (fbidcheck > 0) {

        userModel.findOne({
          facebook_id: request_data.facebook_id
        }).exec(function(err, res) {
          console.log(res, 'eres')
          if (err) {
            callback(err)
          } else {
            //   //console.log(res)
            var obj = {
              id: res._id,
              email: res.email,
              firstname: res.firstname,
              lastname: res.lastname
            }
            var Token = createToken(obj);
            //console.log(Token)
            var data = {
              token: Token,
              message: 'successfully login',
              userDetails: res
            }
            callback(null, data)

          }

        })

      } else {
        var userModelData = new userModel({
          firstname: request_data.firstname,
          lastname: request_data.lastname,
          email: request_data.email,
          about: request_data.about,
          profile_image: request_data.profile_image,
          birthday: request_data.birthday,
          facebook_id: request_data.facebook_id,
          location: request_data.location,
          type: 'customer',
          address: request_data.address.street,
          state: request_data.address.state,
          city: request_data.address.city,
          country: request_data.address.country,




        })
        //console.log(userModelData)
        userModelData.save(function(err, res) {
          //console
          if (err) {
            callback(err)
          } else {
            var obj = {
              id: res._id,
              email: res.email,
              firstname: res.firstname,
              lastname: res.lastname
            }

            var Token = createToken(obj);
            var data = {
              token: Token,
              message: 'successfully login',
              userDetails: res
            }
            callback(null, data)
          }


        })

      }
    }
  },





  //
  // ────────────────────────────────────────────────────────────────────────────── III ──────────
  //   :::::: U P D A T E   U S E R   D E T A I L S : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────
  //
  updateUser: function(request_data, callback) {

    async.waterfall([
      emailCheck,
      register
    ], function(error, response) {
      if (error) {
        callback({
          success: false,
          message: error
        })
      } else {
        callback({
          success: true,
          data: response
        })
      }
    })

    function emailCheck(callback) {
      userModel.count({
          email: request_data.email
        }).where({
          _id: {
            $ne: request_data._id
          }
        })
        .exec(function(err, response) {
          //console.log(response)
          if (err) {
            callback(err)
          } else {
            if (response < 1) {
              callback(null, response)
            } else {
              callback('email exist ')
            }
          }
        })
    }

    function register(emailCheck, callback) {
      //console.log(emailCheck)
      var userModelData = {
        firstname: request_data.firstname,
        lastname: request_data.lastname,
        location: request_data.location,
        address: request_data.address,
        category: request_data.category,
        phone: request_data.phone,
        email: request_data.email,
        password: request_data.password,
        state: request_data.state,
        city: request_data.city,
        zip: request_data.zip,
        country: request_data.country,
        rating: request_data.rating,
        shopname: request_data.shopname,
        online: request_data.online,
        profile_image: request_data.profile_image,
        type: request_data.type,
        category: request_data.category
      }
      var cond = {
          _id: request_data._id
        },
        options = {
          multi: true
        };

      userModel.update(cond, userModelData, options, function(err, res) {
        //console.log(res)
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
  },
  //
  // ────────────────────────────────────────────────────────────────────── IV ──────────
  //   :::::: G E T   V E N D O R   L I S T : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────
  //
  getVendorList: function(request_data, callback) {
    async.waterfall([
      getVendor
    ], function(error, success) {
      if (error) {
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

    function getVendor(callback) {
      userModel.find().exec(function(err, res) {
        //console.log(res)
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
  },


  //
  // ──────────────────────────────────────────────────────────────────────────── IV ──────────
  //   :::::: G E T   C H A T   U S E R   L I S T : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────────────
  //

  chatUserList: function(request_data, userData, callback) {
    async.waterfall([
      userList
    ], function(error, success) {
      if (error) {
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

    function userList(callback) {
      userModel.find({
        _id: {
          $ne: userData.id
        }
      }).exec(function(err, res) {
        //console.log(res)
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
  }
}
module.exports = usersController