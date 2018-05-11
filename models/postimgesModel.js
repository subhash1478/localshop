/*
 * Contact Model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostImageSchema = new Schema({
	postid: {type: String,ref:'Post', required: [true,'postid  not found']},
	image: {type: String, required:  [true,'image  not found']},
	viewed: {type: Number,default: null },
 	 
 	
}, {
        timestamps: true
});
module.exports = mongoose.model('Postimage', PostImageSchema);