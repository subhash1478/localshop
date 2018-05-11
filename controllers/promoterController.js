//
// ────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C A T E G O R Y   C O N T R O L L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//
var promoterModel=require('../models/promoterModel');
var config=require('../config');


var promoterController={
    addPromoter:function(request_data,request_files,callback){
        var promoterimage = request_files.promoterimage;
        var req=JSON.parse(request_data.param)
        console.log(req.title)
        var filename=req.title+'.png'
        promoterimage.mv('public/image/Promoter/'+filename, function(err,success) {
            if (err){
                callback({success:false,message:err})
            }else{
                var promoterModelData=new promoterModel({
                    title:req.title,
                    image:filename
                })
                console.log(promoterModelData)
                promoterModelData.save(function(err,response){
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
    getPromoter:function(request_data,callback){
        promoterModel.find({}).exec(function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                var cat=[]
                for (var i = 0; i < response.length; i++) {
                    var res={}
                    res['title']=response[i].title,
                    res['image']=config.SITE_BASE_URL+"image/Promoter/"+response[i].image,
                    res['_id']=response[i]._id
                    cat.push(res)
                }
                callback({success:true,message:'succesfully fetch',data:cat})
            }
        })
    },
    updatepromoter:function(request_data,request_files,callback){
        var promoterimage = request_files.promoterimage;
        var req=JSON.parse(request_data.param)
        console.log(req.title)
        var filename=req.title+'.png'
        promoterimage.mv('public/image/Promoter/'+filename, function(err,success) {
            if (err){
                callback({success:false,message:err})
            }else{
                var promoterModelData={
                    title:req.title,
                    image:filename
                }
                var cond={_id:req._id}
                , options = { multi: true };
                promoterModel.update(cond,promoterModelData,options,function(err,response){
                    if(err){
                        callback({success:false,message:err})
                    }else{
                        callback({success:true,message:'succesfully updated',data:response})
                    }
                });
            }
        });
    }
}
module.exports=promoterController