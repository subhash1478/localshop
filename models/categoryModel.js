var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CategorySchema= new Schema({
    title:{type:String,required:true},
    image:{type:String,required:true}
});

var category=mongoose.model('Category',CategorySchema);
module.exports=category;