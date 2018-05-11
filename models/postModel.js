/*
 * Contact Model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: {type: String, required: [true,'title  not found']},
	category: {type: String,ref:'Category', required:  [true,'Category  not found']},
	description: {type: String,default: null },
	viewed: {type: Number,default: null },
	tags:{type:[String],default:null}
 	 
 	
}, {
        timestamps: true
});
module.exports = mongoose.model('Post', PostSchema);