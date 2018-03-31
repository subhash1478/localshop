var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   T A B L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
var randomPassword=new Date().getTime()
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
var phrx=/^[\d]{2,4}[- ]?[\d]{3}[- ]?[\d]{3,5}|([0])?(\+\d{1,2}[- ]?)?[789]{1}\d{9}$/;

var UserSchema= new Schema({
    firstname:{type:String,required:[true,'Firstname is required'],minlength:3},
    lastname:{type:String,required:[true,'Lastname name is required'],minlength:3},
    location:{type:String,default:null},
    address:{type:String,default:null},
    category:{type:String,default:null},
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return phrx.test(v);
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
country:{type:String,default:null,required:[true,'country is required']},
rating:{type:Number,default:0},
shopname:{type:String,required:[true,'Shop name is required']},
online:{type:String,default:null},
profile_image:{type:String,default:null},
type:{type:String,default:null,required:[true,'user type is required']},
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