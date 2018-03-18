var async=require('async');
var userModel=require('../models/usersModel')
var usersController={
    //
    // ──────────────────────────────────────────────────────────── I ──────────
    //   :::::: U S E R   L O G I N : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    login:function(request_data,callback){
        async.waterfall([],function(error,response){
            emailCheck,
            loginCheck
            if(error){
                callback({success:false,message:error})
            }else{
                callback({success:true,data:response})
            }
        })
        function emailCheck(callback){
            userModel.count({email:request_data.email})
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
        }
    },
    //
    // ────────────────────────────────────────────────────────────────── II ──────────
    //   :::::: U S E R   R E G I S T E R : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────────
    //
    register:function(request_data,callback){
        async.waterfall([
            emailCheck,
            register
        ],function(error,response){
            if(error){
                callback({success:false,message:error})
            }else{
                callback({success:true,data:response})
            }
        })
        function emailCheck(callback){
            userModel.count({email:request_data.email})
            .exec(function(err,response){
                console.log(response)
                if(err){
                    callback(err)
                }else{
                    if(response<1){
                        callback(null,response)
                    }else{
                        callback('email exist ')
                    }        
                }
            })
        }
        function register(emailCheck,callback){
            console.log(emailCheck)
            var userModelData=new userModel({
                firstname:request_data.firstname,
                lastname:request_data.lastname,
                location:request_data.location,
                address:request_data.address,
                category:request_data.category,
                phone:request_data.phone,
                email:request_data.email,
                password:request_data.password,
                state:request_data.state,
                city:request_data.city,
                zip:request_data.zip,
                country:request_data.country,
                rating:request_data.rating,
                shopname:request_data.shopname,
                online:request_data.online,
                profile_image:request_data.profile_image,
                type:request_data.type
            })
            userModelData.save(function(err,res){
                console.log(res)
                if(err){
                    callback(err)
                }else{
                    callback(null,res)
                }
            })
        }
    },
    //
    // ────────────────────────────────────────────────────────────────────────────── III ──────────
    //   :::::: U P D A T E   U S E R   D E T A I L S : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────────────────────
    //
    updateUser:function(){
    },
    //
    // ────────────────────────────────────────────────────────────────────── IV ──────────
    //   :::::: G E T   V E N D O R   L I S T : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────────────
    //
    getVendorList:function(request_data,callback){
        async.waterfall([
            getVendor
        ],function(error,success){
            if(error){
                callback({success:false,message:err})
            }else{
                callback({success:true,data:success})
            }
        })
        function getVendor(callback){
            userModel.find({type:'vendor'}).exec(function(err,res){
                console.log(res)
                if(err){
                    callback(err)
                }else{
                    callback(null,res)
                }
            })
        }
    }
}
module.exports=usersController