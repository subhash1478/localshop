var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: A D M I N   T A B L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
var AdminSchema= new Schema({
    username:{type:String,default:null,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,select:false}
},{
    timestamps:true,
    typecast:true
});
var Admin=mongoose.model('Admin',AdminSchema);
module.exports=Admin;