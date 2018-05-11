//
// ────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C A T E G O R Y   C O N T R O L L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//
var categoryModel=require('../models/categoryModel');
var tagModel=require('../models/tagModel');
var postimgesModel=require('../models/postimgesModel');
var postModel=require('../models/postModel');
var postimgesModel=require('../models/postimgesModel');
var config=require('../config')
var async=require('async');
var postController={
    addPost:function(request_data,callback){
        var postModelData=new postModel({
            title:request_data.title,
            category:request_data.category,
            description:request_data.description,
        })
        console.log(postModelData)
        postModelData.save(function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                callback({success:true,message:'succesfully added',data:response})
            }
        })
    },
    //
    // ─── GET CATEGORY ───────────────────────────────────────────────────────────────
    //
    getPost:function(request_data,callback){
        postModel.find({})
        .populate({path:'category'})
        .exec(function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                var cat=[];
                async.each(response,function(item,cb){
     
     
                    postimgesModel.find({postid:item._id})
                    .select('image -_id')
                    .exec(function(err,response){
                        console.log('postimgesModel',response)

                        var res={}
                        res['title']=item.title,
                        res['description']=item.description,
                        res['category']=item.category,
                        res['viewed']=item.viewed
                        res['_id']=item._id
                        if(response.length>0){
                            res['images']=config.SITE_BASE_URL+"image/postimage/"+response[0].image

                        }else{
                            res['images']=response
                        }
                        cat.push(res)
                        cb()
                    })

                
                },function(){
                    callback({success:true,message:'succesfully fetch',data:cat})
                })
            }
        })
    },
    updatePost:function(request_data,callback){
        var postModelData={
            title:request_data.title,
            category:request_data.category,
            description:request_data.description,
        }
        var cond={_id:request_data._id}
        , options = { multi: true };
        postModel.update(cond,postModelData,options,function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                callback({success:true,message:'succesfully updated',data:response})
            }
        });
    },
    updatePostimage:function(request_data,request_files,callback){
        async.each(request_files.uploads,function(item,cb){
            console.log(request_data.id,item)
            console.log(item)
            var filename=new Date().getTime()+item.name
            item.mv('public/image/postimage/'+filename, function(err,success) {
                console.log(err,success)
                var postimgesModelData=new postimgesModel({
                    postid:request_data.id,
                    image:filename
                })
                console.log(postimgesModelData)
                postimgesModelData.save(function(err,success){
                    if(err){
                        console.log(err)
                    }else{
                        console.log(success)
                        cb(item)
                    }
                })
            });
        },function(){
            console.log('done')
            callback({success:true,message:'fileupload'})
        })
        //  element = result[index];
        //  var filename=result[index].name
        //  element.mv('public/image/postimage/'+filename, function(err,success) {
        //      var postimgesModelData=new postimgesModel({
        //          postid:request_data.postid,
        //          image:filename
        //      })
        //      postimgesModelData.save(function(err,success){
        //      })
        //  });
    },
    updatePostTag:function(request_data,callback){
        
        async.waterfall([
            updateTagdata
        ],function(err,success){
            if(err){
                callback({
                    success:false,message:err
                })
            }else{
                callback({
                    success:true,data:success
                })
            }
        })
        
        function updateTagdata(callback){
            var cond={ _id:request_data.id}


            postModel.findByIdAndUpdate(cond,
                { "$addToSet": { "tags":request_data.tagname } }).exec(function(err,res){
                if(err){
                    callback(err)
                }else{
                    callback(null,res)
                }
            })
        }
    }
}
module.exports=postController