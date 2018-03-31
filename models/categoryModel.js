var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ──────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C A T E G O R Y   T A B L E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
//
var CategorySchema= new Schema({
    title:{type:String,required:[true,'Title is required']},
    image:{type:String,default:null}
},{
    timestamps:true,
 });
var category=mongoose.model('Category',CategorySchema);
module.exports=category;