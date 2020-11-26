const mongoose = require('mongoose');
const Tag = require('../models/tag.js');
const utils = require('../utils.js');

// Define tag schema
// "path" - String
// "locName" - String
// "description" - String
// "dateCreated" - Date - should be set automatically by server to present date
const fields = ["path", "locName", "description"];

module.exports.postTag = async (req, res) => {
	var tag = new Tag();

	utils.setFields(tag, req.body, fields);

	// assume the given coordinates are a valid set of coordinates
	tag.save(async err => {
		if (err) {
			utils.handleResponse(res, 500, req.body, err.message);
		} else {
			delete tag._doc['__v'];
			utils.handleResponse(res, 200, tag._doc, "Tag added successfully");
		}
	})
}

module.exports.getTagGivenId = async (req, res) => {
	let id = req.params.id;
	let tag = await Tag.findById(id).catch(err => {
		return null;
	});
	if (tag) {
		delete tag._doc['__v'];
		utils.handleResponse(res, 200, tag._doc, "Get Tag Successful");
	} else {
		utils.handleResponse(res, 404, id, "Given ID doesn't exist");
	}
}

module.exports.getTag = async (req, res) => {
	utils.handleQuery(res, Tag, req.query);
}

module.exports.deleteTagGivenId = async (req, res) => {
	let id = req.params.id;

	let tag = await Tag.findById(id).catch(err => {
		return null;
	});
	if (tag) {
		let result = await tag.remove();
		delete result['__v'];
		utils.handleResponse(res, 200, result, "Delete Successful");
	} else {
		utils.handleResponse(res, 404, id, "Given Tag ID doesn't exist");
	}
}

module.exports.deleteTag = async (req, res) => {
	Tag.deleteMany( req.query, function(err, result) {
		if (err) {
			utils.handleResponse(res, 400, req.query, err);
		} else {
			utils.handleResponse(res, 200, result, "Succesfully deleted tags");
		}
	});
}

module.exports.updateTagGivenId = async (req, res) => {
	let id = req.params.id;

	let tag = await Tag.findById(id).catch(err => {
		return null;
	});

	if (tag) {
		utils.setFields(tag, req.body, fields);
		console.log(tag);

		tag.save(async err => {
			if (err) {
				utils.handleResponse(res, 500, req.body, err.message);
			} else {
				delete tag._doc['__v'];
				utils.handleResponse(res, 200, tag._doc, "Tag updated successfully");
			}
		});
	} else {
		utils.handleResponse(res, 404, id, "Given Tag ID doesn't exist");
	}
}