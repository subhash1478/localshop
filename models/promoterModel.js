var Mongoose=require('mongoose')
var Schema=Mongoose.Schema
var PromoterSchema =new Schema({
    image:{type:String,required:[true,'image required']},
    title:{type:String,required:[true,'title required']},
    vendorid:{type:Schema.Types.ObjectId,default:null,ref:'Users'},
},{
    timestamp:true
})
var Promoter=Mongoose.model('Promoter',PromoterSchema)
module.exports=Promoter