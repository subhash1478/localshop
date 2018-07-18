//
// ────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C A T E G O R Y   C O N T R O L L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//
var categoryModel=require('../models/categoryModel');
var tagModel=require('../models/tagModel');
var config=require('../config')
var async = require('async');

var categoryController={
    addCategory:function(request_data,request_files,callback){
        var categoryImage = request_files.category_image;
        var req=JSON.parse(request_data.param)
        console.log(req.title)
        var filename=req.title+'.png'
        categoryImage.mv('public/image/categoryimage/'+filename, function(err,success) {
            if (err){
                callback({success:false,message:err})
            }else{
                var categoryData=new categoryModel({
                    title:req.title,
                    image:filename
                })
                console.log(categoryData)
                categoryData.save(function(err,response){
                    if(err){
                        callback({success:false,message:err})
                    }else{
                        callback({success:true,message:'succesfully added',data:response})
                    }
                })
            }
        });
    },
    //
    // ─── GET CATEGORY ───────────────────────────────────────────────────────────────
    //
    getCategory:function(request_data,callback){
        categoryModel.find({}).exec(function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                var cat=[]
                for (var i = 0; i < response.length; i++) {
                    var res={}
                    res['title']=response[i].title,
                    res['image']=config.SITE_BASE_URL+"image/categoryimage/"+response[i].image,
                    res['_id']=response[i]._id
                    cat.push(res)
                }
                callback({success:true,message:'succesfully fetch',data:cat})
            }
        })
    },
    updateCategory:function(request_data,request_files,callback){
        var categoryImage = request_files.category_image;
        var req=JSON.parse(request_data.param)
        var filename=req.title+'.png'
        console.log(req._id)
        categoryImage.mv('public/image/categoryimage/'+filename, function(err,success) {
            if (err){
                callback({success:false,message:err})
            }else{
                var categoryData={
                    title:req.title,
                    image:filename
                }
                var cond={_id:req._id}
                , options = { multi: true };
                categoryModel.update(cond,categoryData,options,function(err,response){
                    if(err){
                        callback({success:false,message:err})
                    }else{
                        callback({success:true,message:'succesfully updated',data:response})
                    }
                });
            }
        });
    },
    updateCategoryData:function(request_data,callback){
        var categoryData={
            title:request_data.title,
         }
        var cond={_id:request_data._id}
        , options = { multi: true };
        categoryModel.update(cond,categoryData,options,function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                callback({success:true,message:'succesfully updated',data:response})
            }
        });
    },




    updateTag:function(request_data,callback){
        async.waterfall([
            checkTag,
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
        function checkTag(callback){
            tagModel.count({tagname:request_data.tagname}).exec(function(err,res){
                if(err){
                    callback(err)
                }else{
                    callback(null,res)
                }
            })
        }
        function updateTagdata(checkTag,callback){
            if(checkTag<1){
                var tagdata=new tagModel({
                    tagname:request_data.tagname,
                    category:request_data.id
                });
                tagdata.save(function(err,res){
                    if(err){
                        callback(err)
                    }else{
                        callback(null,res)
                    }
                })
            }else{
                var cond={ tagname:request_data.tagname},
                options={multi:true},
                tagdata={tagname:request_data.tagname,category:request_data.id}
                tagModel.update(cond,tagdata,options).exec(function(err,res){
                    if(err){
                        callback(err)
                    }else{
                        callback(null,res)
                    }
                })
            }
        }
    },
    getTag:function(request_data,callback){
        async.waterfall([
            findTag,
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
        function findTag(callback){
            tagModel.find({}).exec(function(err,res){

                if(err){
                    callback(err)
                }else{
                    callback(null,res)
                }


            })
        }
    }
}
module.exports=categoryController