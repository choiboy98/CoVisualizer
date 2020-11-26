// Load required packages
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Define task schema
// "path" - String
// "locName" - String
// "description" - String
// "dateCreated" - Date - should be set automatically by server to present date

var TagsSchema = new mongoose.Schema({
	"path" : {type: String, required: true},
	"locName" : {type : String, default: ""},
	"description" : {type: String, required: true},
	"dateCreated" : {type: Date, default: Date.now}
});
TagsSchema.plugin(uniqueValidator);


// Export the Mongoose model
module.exports = mongoose.model('Tags', TagsSchema);