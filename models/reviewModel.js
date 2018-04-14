var Mongoose=require('mongoose')
var Schema=Mongoose.Schema
var reviewSchema =new Schema({
    comment:{type:String,required:[true,'comment required']},
    rating:{type:Number,required:[true,'rating required']},
    userid:{type:Schema.Types.ObjectId,required:[true,'userid not found'],ref:'Users'},
    vendorid:{type:Schema.Types.ObjectId,required:[true,'userid not found'],ref:'Users'},
},{
    timestamp:true
})
var Review=Mongoose.model('Review',reviewSchema)
module.exports=Review