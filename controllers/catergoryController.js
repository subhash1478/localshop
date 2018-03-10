var categoryModel=require('../models/categoryModel');
var categoryController={
    addCategory:function(request_data,callback){
        var categoryData=new categoryModel({
            title:request_data.title,
            image:request_data.image
        })
        categoryData.save(function(err,response){
            if(err){
                callback({success:false,message:err})
            }else{
                callback({success:true,message:'succesfully added',data:response})
            }
        })
    }
}

module.exports=categoryController