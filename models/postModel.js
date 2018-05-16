/*
* Contact Model
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title  not found']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category  not found']
  },
  description: {
    type: String,
    default: null
  },
  viewed: {
    type: Number,
    default: null
  },
  tags: {
    type: [String],
    default: null
  },
  userid: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Users'
  }
  
  
}, {
  timestamps: true
});
module.exports = mongoose.model('Post', PostSchema);