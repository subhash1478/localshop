var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   T A B L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
var UserSchema= new Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    location:{type:String,required:true},
    address:{type:String,required:true},
    category:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true,select:false},
    state:{type:String,required:true},
    city:{type:String,required:true},
    zip:{type:String,required:true},
    country:{type:String,required:true},
    rating:{type:String,required:true},
    shopname:{type:String,required:true},
    online:{type:String,required:true},
    profile_image:{type:String,default:null},
    type:{type:String,default:'customer'}
},{
    timestamps:true,
    typecast:true
});
var users=mongoose.model('Users',UserSchema);
module.exports=users;