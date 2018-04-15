/*
 * Contact Model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
	userId: {type: String, required: [true,'user id not found']},
	remoteUserId: {type: String, required:  [true,'remote User Id  not found']},
	roomId: {type: String,default: null },
	chatText: { type: String,default: null },
	attachment: { type: String,default: null },
	chatFileName: { type: String,default: null },
	size: { type: String,default: null },
	sender_seen: { type: String,default: null },
	receiver_seen: { type: String,default: null },
	chatDate: { type: Date},
	randomid: { type: String,default: null },
	deleted_by: { type: String,default: null },
 	
}, {
        timestamps: true
});
module.exports = mongoose.model('Chat', ChatSchema);