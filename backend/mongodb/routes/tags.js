const mongoose = require('mongoose');
const Tag = require('../models/tag.js');
const utils = require('../utils.js');

// Define tag schema
// "tagID" - String
// "coords" - String
// "locName" - String
// "description" - String
// "dateCreated" - Date - should be set automatically by server to present date
const fields = ["tagID", "coords", "locName", "description", "dateCreated"];

module.exports.postTag = async (req, res) => {
	console.log("post")

	res.end()
}

// module.exports.postTask = async (req, res) => {
// 	// make assignedUser and assignedUserName fields accurate
// 	var task = new Task();

// 	utils.setFields(task, req.body, fields);

// 	var user;
// 	if ("assignedUser" in req.body && req.body.assignedUser != "") {
// 		// check if assigned user exists
// 		let id = req.body.assignedUser;
// 		user = await User.findById(id).catch(err => {
// 			return null;
// 		});
// 		if (user) {
// 			task.assignedUser = id;
// 			task.assignedUserName = user.name;
// 		} else {
// 			utils.handleResponse(res, 500, req.body, "Given User ID doesn't exist");
// 			return;
// 		}
// 	}

// 	task.save(async err => {
// 		if (err) {
// 			utils.handleResponse(res, 500, req.body, err.message);
// 		} else {
// 			if (user) {
// 				user.pendingTasks.push(task._id);
// 				await user.save();
// 			}
// 			utils.handleResponse(res, 200, task._doc, "Task added successfully");
// 		}
// 	});
// }

// module.exports.getTasks = (req, res) => {
// 	utils.handleQuery(res, Task, req.query);
// }

// module.exports.getTaskGivenId = async (req, res) => {
// 	let id = req.params.id;
// 	let task = await Task.findById(id).catch(err => {
// 		return null;
// 	});
// 	if (task) {
// 		utils.handleResponse(res, 200, task._doc, "Get Task Successful");
// 	} else {
// 		utils.handleResponse(res, 404, id, "Given ID doesn't exist");
// 	}
// }

// module.exports.deleteTaskGivenId = async (req, res) => {
// 	let id = req.params.id;

// 	let task = await Task.findById(id).catch(err => {
// 		return null;
// 	});
// 	if (task) {
// 		if (task.assignedUser) {
// 			let user = await User.findById(task.assignedUser).catch(err => null);
// 			if (user) {
// 				user.pendingTasks.pull(id);
// 				await user.save();
// 			}
// 		}
// 		let result = await task.remove();
// 		utils.handleResponse(res, 200, result, "Delete Successful");
// 	} else {
// 		utils.handleResponse(res, 404, id, "Given Task ID doesn't exist");
// 	}
// }

// module.exports.updateTaskGivenId = async (req, res) => {
// 	let id = req.params.id;

// 	let task = await Task.findById(id).catch(err => {
// 		return null;
// 	});

// 	if (task) {
// 		utils.setFields(task, req.body, fields);
// 		var user;
// 		if ("assignedUser" in req.body) {
// 			// check if assigned user exists
// 			let id = req.body.assignedUser;
// 			user = await User.findById(id).catch(err => {
// 				return null;
// 			});
// 			if (user) {
// 				task.assignedUser = id;
// 				task.assignedUserName = user.name;
// 			} else {
// 				utils.handleResponse(res, 500, req.body, "Given User ID doesn't exist");
// 				return;
// 			}
// 		}

// 		task.save(async err => {
// 			if (err) {
// 				utils.handleResponse(res, 500, req.body, err.message);
// 			} else {
// 				if (user) {
// 					user.pendingTasks.push(task._id)
// 					await user.save();
// 				}
// 				utils.handleResponse(res, 200, task._doc, "Task updated successfully");
// 			}
// 		});
// 	} else {
// 		utils.handleResponse(res, 404, id, "Given Task ID doesn't exist");
// 	}
// }