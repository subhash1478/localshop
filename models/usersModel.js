var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   T A B L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
var randomPassword=new Date().getTime()
var UserSchema= new Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    location:{type:String,default:null},
    address:{type:String,required:true},
    category:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,default:randomPassword,select:false},
    state:{type:String,required:true},
    city:{type:String,required:true},
    zip:{type:String,required:true},
    country:{type:String,required:true},
    rating:{type:Number,default:0},
    shopname:{type:String,required:true},
    online:{type:String,default:null},
    profile_image:{type:String,default:null},
    type:{type:String,required:true}
},{
    timestamps:true,
    typecast:true
});
var users=mongoose.model('Users',UserSchema);
module.exports=users;