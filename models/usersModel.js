var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   T A B L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
var randomPassword=new Date().getTime()
var UserSchema= new Schema({
    firstname:{type:String,default:null},
    lastname:{type:String,default:null},
    location:{type:String,default:null},
    address:{type:String,default:null},
    category:{type:String,default:null},
    phone:{type:String,default:null},
    email:{type:String,default:null},
    password:{type:String,default:randomPassword,select:false},
    state:{type:String,default:null},
    city:{type:String,default:null},
    zip:{type:String,default:null},
    country:{type:String,default:null},
    rating:{type:Number,default:0},
    shopname:{type:String,default:null},
    online:{type:String,default:null},
    profile_image:{type:String,default:null},
    type:{type:String,default:null},
    facebook_id:{type:String,default:null},
    about:{type:String,default:null},
    birthday:{type:String,default:null}
},{
    timestamps:true,
    typecast:true
});
var users=mongoose.model('Users',UserSchema);
module.exports=users;