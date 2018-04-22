/*
*   Chat Manipulation Services for App.
*/
var async = require('async');
var config = require('../config');
var secretKey = config.secret;
var jwt = require('jsonwebtoken');
var UserModel = require('../models/usersModel');
var ChatModel = require('../models/chatModel');
var request = require('request');
var ChatController = {
    newtextChat: function (ChatData, userData, callback) {
        console.log("ChatData : ", ChatData);
        console.log("userData : ", userData);
        UserModel.findOne({
            chatUserId: ChatData.remoteUserId
        })
        .exec(function (err, user) {

            console.log(user)
            if (err) {
                callback({
                    success: false,
                    statusCode: config.status.SERVER_ERROR,
                    message: "SERVER.INTERNAL_ERROR",
                    err: err
                });
            } else {
                if (ChatData.type == "text") {
                    var Chat = new ChatModel({
                        userId: userData.id,
                        remoteUserId: ChatData.remoteUserId,
                        roomId: ChatData.roomId,
                        chatText: ChatData.chatText,
                        chatDate: ChatData.chatDate,
                        sender_seen: ChatData.sender_seen,
                        receiver_seen: ChatData.receiver_seen,
                        randomid: ChatData.randomid
                    });
                    //console.log("My ChatData : ", Chat);
                } else {
                    var Chat = new ChatModel({
                        userId: userData.id,
                        remoteUserId: ChatData.remoteUserId,
                        roomId: ChatData.roomId,
                        attachment: ChatData.chatFile,
                        chatFileName: ChatData.chatFileName,
                        size: ChatData.chatFileSize,
                        chatDate: ChatData.date,
                        sender_seen: ChatData.sender_seen,
                        receiver_seen: ChatData.receiver_seen,
                        randomid: ChatData.randomid
                    });
                }
                Chat.save(function (err, res) {
                    console.log('Chatsubhash',err, res)

                    if (err)
                    callback({
                        success: false,
                        statusCode: config.status.SERVER_ERROR,
                        message: "SERVER.INTERNAL_ERROR",
                        err: err
                    });
                    else
                    callback({
                        success: true,
                        statusCode: config.status.OK,
                        message: "SERVER.SUCCESS"
                    });
                });
        }
    });
},
newGroupChat: function (ChatData, userData, callback) {
    //console.log("ChatData : ", ChatData);
    //console.log("userData : ", userData);
    UserModel.findOne({
        _id: userData.id
    })
    .select('_id')
    .exec(function (err, user) {
        if (err)
        callback({
            success: false,
            statusCode: config.status.SERVER_ERROR,
            message: "SERVER.INTERNAL_ERROR",
            err: err
        });
        else {
            if (!user) {
                callback({
                    success: false,
                    statusCode: config.status.SERVER_ERROR,
                    message: "SERVER.INTERNAL_ERROR",
                    err: err
                });
            } else {
                async.waterfall([
                    function (nextcb) {
                        var customErr = {
                            success: null,
                            status: null,
                            message: null
                        };
                        if (ChatData.type == "text") {
                            var Chat = new GroupchatModel({
                                _group: ChatData.groupId,
                                _user: user._id,
                                userId: userData.chatUserId,
                                chatText: ChatData.chatText,
                                chatDate: ChatData.chatDate
                            });
                        } else {
                            var Chat = new GroupchatModel({
                                _group: ChatData.groupId,
                                _user: user._id,
                                userId: userData.chatUserId,
                                attachment: ChatData.chatFile,
                                chatFileName: ChatData.chatFileName,
                                size: ChatData.chatFileSize,
                                chatDate: ChatData.date
                            });
                        }
                        Chat.save(function (err, res) {
                            if (err)
                            customErr = {
                                success: false,
                                statusCode: config.status.SERVER_ERROR,
                                message: "SERVER.INTERNAL_ERROR",
                                err: err
                            };
                            else
                            customErr = {
                                success: true,
                                statusCode: config.status.OK,
                                message: "SERVER.SUCCESS"
                            };
                            nextcb(null, customErr, Chat);
                        });
                    }
                ], function (err, response) {
                    callback(response);
                });
            }
        }
    });
},
chatHistory: function (ChatData, userData, callback) {
    //console.log("ChatData : ", ChatData);
    //console.log("userData : ", userData);
    var page = ChatData.page,
    limit = 15,
    query = {
        $or: [{
            userId: userData.id,
            remoteUserId: ChatData.remoteUserId
        },
        {
            userId: ChatData.remoteUserId,
            remoteUserId: userData.id
        }
    ],
    deleted_by: { $ne: userData.id },

};
console.log("query : ", query);
if (ChatData.page) {
    page = parseInt(ChatData.page);
}
if (ChatData.limit) {
    limit = parseInt(ChatData.limit);
}
async.waterfall([
    function (nextcb) {
        ChatModel.find(query, function (err, Chats) {
            if (err) {
                nextcb(err);
            } else {
                nextcb(null, Chats);
            }
        });
    }
    /*,
    function (Chats, nextcb) {
        ChatModel.find(query, function (err, chatrecord) {
            if (err)
            nextcb(err);
            else {
                nextcb(null, Chats, chatrecord);
            }
        });
    }
    */
],
function (err, result) {
    if (err) {
        callback({
            success: false,
            err: err
        });
    } else {
        callback({
            success: true,
            Chats: result
        });
    }
});
},
/**/
seenmessage: function (ChatData, userData, cb) {
    async.waterfall([
        function (callback) {
            var errMsg = "";
            data = [];
            var userlist = ChatData
            var ingredient_ids = []
            async.each(userlist, function (useritem, cb) {
                var rescall = {}
                ChatModel.count({
                    userId: useritem.userid,
                    remoteUserId: userData.chatUserId,
                    receiver_seen: 'no',
                    deleted_by:null
                }).exec(function (err, res) {
                    console.log(res)
                    rescall['unseen'] = res
                    rescall['userid'] = useritem.userid
                    ingredient_ids.push(rescall);
                    cb(null, ingredient_ids);
                })
            }, function () {
                data = ingredient_ids
                callback(null, errMsg, data);
            });
        },
        function (errMsg, itemdata, callback) {
            var data = [];
            if (errMsg != "") {
                callback(null, errMsg, data);
            } else {
                var ingredient = []
                async.each(itemdata, function (useritem, cb) {
                    console.log('useritem', useritem)
                    var resc = {}
                    var query = {
                        $or: [{
                            userId: userData.chatUserId,
                            remoteUserId: useritem.userid
                        },
                        {
                            userId: useritem.userid,
                            remoteUserId: userData.chatUserId
                        }
                    ],
                    deleted_by:null
                };
                ChatModel.findOne(query)
                .sort('-createdAt')
                .exec(function (err, records) {
                    console.log(records)
                    useritem['lastmsg'] = records
                    ingredient.push(resc);
                    cb(null, ingredient);
                });
            }, function () {
                data = itemdata
                callback(null, errMsg, data);
            });
        }
    },
], function (err, errMsg, result) {
    // console.log('Main Callback --> ' + result);
    if (err) {
        cb({
            success: false,
            message: "Some internal error has occurred",
            err: err
        });
    } else if (errMsg != "") {
        cb({
            success: false,
            message: errMsg
        });
    } else {
        cb({
            success: true,
            message: "",
            data: result
        });
    }
});
},
updateseen: function (Chatuser, userData, callback) {
    var conditions = {
        $or: [{
            userId: userData.chatUserId,
            remoteUserId: Chatuser.userid
        },
        {
            userId: Chatuser.userid,
            remoteUserId: userData.chatUserId
        }
    ],
    receiver_seen: 'no'
};
fields = {
    receiver_seen: 'yes'
},
options = {
    multi: true
};
console.log('conditions', conditions)
ChatModel.update(conditions, fields, options, function (err, affected) {
    if (err) {
        callback({
            success: true,
            message: err,
        });
    } else {
        callback({
            success: true,
            message: affected
        });
    }
});
},
sendofflinepushmessage: function (request_data, userData, callback) {
    var sendNotification = function () {
        UserModel.findOne({
            chatUserId: request_data.id
        }).exec(function (err, result) {
            var headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "key=AAAAzGX_9RU:APA91bGXPgcdem623SINJFoKmQVO6qgAHAnH5TjLEUY_LqmHvsBv3h2oJ87kUfJ_XHu2xdXd9R6efJfG_ZIXoI2zQCi5OWQ8UiCu5uYCccVl_Hkqem1KYXedHuwiZK44zdXPVc7p8zG8"
            };
            request({
                url: 'https://fcm.googleapis.com/fcm/send',
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    "notification": {
                        "title": request_data.username,
                        "text": request_data.message,
                        "click_action": "OPEN_ACTIVITY_1"
                    },
                    "data": {
                        "keyname": "any value "
                    },
                    "to": result.deviceTokenAndroid
                })
            }, function (error, response, body) {
                if (error) {
                    console.error(error, response, body);
                    callback({
                        success: false,
                        response: error
                    });
                } else if (response.statusCode >= 400) {
                    callback({
                        success: false,
                        response: response
                    });
                } else {
                    callback({
                        success: true,
                        response: response
                    });
                }
            });
        });
    }
    sendNotification();
},
deletechat: function (request_data, userData, callback) {
    var value = request_data;
    ChatModel.count({
        randomid: {
            $in: value
        },
        deleted_by: null
    }).exec(function (err, res) {
        if (res <1) {
            ChatModel.deleteMany({
                randomid: {
                    $in: value
                }
            }).exec(function (err, response) {
                if (err) {
                    callback(err);
                    callback({
                        success: false,
                        message: err
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Successful deleted',
                        response: response
                    });
                }
            });
        } else {
            ChatModel.update({
                randomid: {
                    $in: value
                } // conditions
            }, {
                deleted_by: userData.chatUserId
            }, {
                multi: true // options
            },
            function (err, count) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(count);
                    console.log(count);
                }
            });
        }
    })
},
clearchat:function(request_data,userData,callback){
    var deletevalue=[];
    var updatevalue=[];
    var conditions = {
        $or: [{
            userId: userData.chatUserId,
            remoteUserId: request_data.remoteUserId
        },
        {
            userId: request_data.remoteUserId,
            remoteUserId: userData.chatUserId
        }
    ],
};
ChatModel.find(conditions)
.select('deleted_by').exec(function(err,res){
    if(res){
        for(var i=0;i<res.length;i++){
            if(res[i].deleted_by!=null){
                console.log(res[i]._id);
                deletevalue.push(res[i]._id);
            }else{
                console.log(res[i]._id);
                updatevalue.push(res[i]._id);
            }
        }
        if (deletevalue.length >0) {
            ChatModel.deleteMany({
                _id: {
                    $in: deletevalue
                }
            }).exec(function (err, response) {
                if (err) {
                    callback(err);
                    callback({
                        success: false,
                        message: err
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Successful deleted',
                        response: response
                    });
                }
            });
        } 
        if (updatevalue.length >0) 
        {
            ChatModel.update({
                _id: {
                    $in: updatevalue
                } // conditions
            }, {
                deleted_by: userData.chatUserId
            }, {
                multi: true // options
            },
            function (err, count) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(count);
                    console.log(count);
                }
            });
        }
    }
})
},
getChatforadmin:function(request_data,callback){
    async.waterfall([
        getchat
    ],function(error,response){
        if(error){
            callback({success:false,message:error})
        }else{
            callback({success:true,data:response})
        }
    })
    function getchat(callback){
        var  query = {
            $or: [{
                userId: request_data.firstuser,
                remoteUserId: request_data.seconduser
            },
            {
                userId:request_data.seconduser,
                remoteUserId: request_data.firstuser
            }
        ]}
        console.log(query)
        ChatModel.find(query)
        .exec(function(err,result){
            if(err){
                callback(err)
            }else{
                callback(null,result)
            }
        })
    }
},
showuserlist:function(request_data,callback){
    async.waterfall([getUserList],function(err,res){
        if(err){
            callback({
                success:false,message:err
            })
        }else{
            callback({
                success:false,data:res
            })
        }
    })
    function getUserList(callback){
        UserModel.find({}).exec(function(err,res){
            if(err){
                callback(err)
            }else{
                callback(null,res)
            }
        })
    }
},
getchatfriend:function(request_data,callback){
    async.waterfall([
        getUserList,
        getUserDeatils
    ],function(err,res){
        if(err){
            callback({
                success:false,message:err
            })
        }else{
            callback({
                success:false,data:res
            })
        }
    })
    function getUserList(callback){
        ChatModel.find({userId:request_data.user})
        .select('-_id remoteUserId')
        .exec(function(err,res){
            if(err){
                callback(err)
            }else{
                callback(null,res)
            }
        })
    }
    function getUserDeatils(getUserList,callback){
        var userlist=[]
        for (var index = 0; index < getUserList.length; index++) {
            const element = getUserList[index].remoteUserId;
            if(userlist.indexOf(element)==-1){
                userlist.push(element)
            }
        }
        UserModel.find({chatUserId:{$in:userlist}}).exec(function(err,res){
            if(err){
                callback(err)
            }else{
                callback(null,res)
            }
        })
    }

}
}
module.exports = ChatController;