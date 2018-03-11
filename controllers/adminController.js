var adminModel=require('../models/adminModel');
var async=require('async')
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var CONFIG=require('../config')
var bcrypt=require('bcrypt')
 
 
function createToken(user){
    var tokenData = {
        id: user._id,
        email: user.email,
        name: user.username
    };
    var token = jwt.sign(tokenData, CONFIG.SECRET, {
        expiresIn: "30 days"
    });
    return token;
}
var adminController={
    //
    // ─── LOGIN ──────────────────────────────────────────────────────────────────────
    //
    login:function(request_data,callback){
        async.waterfall([
            emailCheck,
            loginCheck
        ],function(error,response){
            if(error)
            {
                callback({sucess:false,message:error})
            }else{
                callback({sucess:true,data:response})
            }
        })
        function emailCheck(callback){
            adminModel.count({email:request_data.email})
            .exec(function(err,response){
                if(err){
                    callback(err)
                }else{
                    if(response>0){
                        callback(null,response)
                    }else{
                        callback('invalid email')
                    }        
                }
            })
        }
        function loginCheck(emailCheck,callback){
            adminModel.findOne({email:request_data.email})
            .select('email password')
            .exec(function(err,response){
                console.log(response)
         bcrypt.compare(request_data.password,response.password, function(err, result) {
            if(result==true){
                var Token=createToken(response)
console.log(Token)

                var result={
                    token:Token,
                    user:response
                }
                callback(null,result)
            }else{
                callback('Invalid login')
            }                });
                 
            })
        }
    },
    //
    // ─── REGISTER ───────────────────────────────────────────────────────────────────
    //
    register:function(request_data,callback){
        async.waterfall([
            emailCheck,
            register
        ],function(error,response){
            if(error){
                callback({sucess:false,message:error})
            }else{
                callback({sucess:true,response})
            }
        })
        function emailCheck(callback){
            adminModel.count({email:request_data.email})
            .exec(function(err,response){
                if(err){
                    callback(err)
                }else{
                    if(response>0){
                        callback('email already exist')
                    }else{
                        callback(null,response)
                    }        
                }   
            });
        }
        function register(count,callback){
  var salt=10;
 bcrypt.hash(request_data.password, salt,function(err,hash){
    var AdminData=new adminModel({
        username:'admin',
        email:request_data.email,
        password:hash
    });

  
     AdminData.save(function(err,res){
        if(err){
            callback(err)
        }
        else{
            callback(null,res)
        }
    });
});
            
        }
    },
    //
    // ─── FORGET PASSWORD ────────────────────────────────────────────────────────────
    //
    forgetPassword:function(request_data,callback){
    }
}
module.exports=adminController;