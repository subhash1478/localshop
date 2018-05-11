var Mongoose=require('mongoose')
var Schema=Mongoose.Schema
var tagSchema =new Schema({
    tagname:{type:String,required:[true,'tagname required']},
    used:{type:Number,default:null},
    category:{type:Schema.Types.ObjectId,required:[true,'Category not found'],ref:'Category'},
 },{
    timestamp:true
})
var Tag=Mongoose.model('Tag',tagSchema)
module.exports=Tag