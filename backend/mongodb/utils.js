
// {
//     "message": "OK",
//     "data": {
//         "_id": "55099652e5993a350458b7b7",
//         "email": "khandek2@illinois.edu",
//         "name": "Sujay Khandekar"
//     }
// }
var handleResponse = exports.handleResponse = (res, status, data, msg) => {
	let response = {
		"message" : msg,
		"data" : data
	};
	res.status(status).json(response);
}

exports.setFields = (model, body, fields) => {
	for (i in fields) {
		if (fields[i] in body) {
			model[fields[i]] = body[fields[i]];
		}
	}
	return model;
}

// where
// filter results based on JSON query
// sort
// specify the order in which to sort each specified field  (1- ascending; -1 - descending)
// select
// specify the set of fields to include or exclude in each document  (1 - include; 0 - exclude)
// skip
// specify the number of results to skip in the result set; useful for pagination
// limit
// specify the number of results to return (default should be 100 for tasks and unlimited for users)
// count
// if set to true, return the count of documents that match the query (instead of the documents themselves)
exports.handleQuery = (res, Model, queries) => {
	var query = Model.find();
	if ("where" in queries) {
		query = query.find(JSON.parse(queries.where));
	}
	if ("sort" in queries) {
		query = query.sort(JSON.parse(queries.sort));
	}
	if ("select" in queries) {
		query = query.select(JSON.parse(queries.select));
	}
	if ("skip" in queries) {
		query = query.skip(parseInt(queries.skip));
	}
	if ("limit" in queries) {
		query = query.limit(parseInt(queries.limit));
	}

	try {
		query.exec((err, docs) => {
		if (err) {
			handleResponse(res, 500, [], err.message);
		} else {

			if ("count" in queries && queries.count) {
				handleResponse(res, 200, docs.length, "Query Successful");
			} else {
				handleResponse(res, 200, docs, "Query Successful");
			}
		}
	});
	} catch(err) {
		handleResponse(res, 500, [], err.message);
	}
}