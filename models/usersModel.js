var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   T A B L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
var randomPassword=new Date().getTime()
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
var UserSchema= new Schema({
    firstname:{type:String,required:[true,'first name is required'],minlength:3},
    lastname:{type:String,required:[true,'first name is required'],minlength:3},
    location:{type:String,default:null},
    address:{type:String,default:null},
    category:{type:String,default:null},
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'User phone number required']
    },
    email:{type:String,  validate: {
        validator: function(v) {
            return emailRegex.test(v);
        },
        message: '{VALUE} is not a valid email!'
    },
    required: [true, 'Email required']
    
},
password:{type:String,default:randomPassword,select:false},
state:{type:String,default:null},
city:{type:String,default:null},
zip:{type:String,default:null},
country:{type:String,default:null,required:true},
rating:{type:Number,default:0},
shopname:{type:String,default:null},
online:{type:String,default:null},
profile_image:{type:String,default:null,required:true},
type:{type:String,default:null,required:true},
facebook_id:{type:String,default:null},
about:{type:String,default:null},
birthday:{type:String,default:null},
category:{type:Schema.Types.ObjectId,ref:'Category',default:null}
},{
    timestamps:true,
    typecast:true
});
var users=mongoose.model('Users',UserSchema);
module.exports=users;