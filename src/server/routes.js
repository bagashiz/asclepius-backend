const {
	postPredictHandler,
	getPredictHistoriesHandler,
} = require("../server/handler");

const routes = [
	{
		path: "/predict",
		method: "POST",
		handler: postPredictHandler,
		options: {
			payload: {
				allow: "multipart/form-data",
				multipart: true,
				maxBytes: 1 * 1000 * 1000, // 1MB
			},
		},
	},
	{
		path: "/predict/histories",
		method: "GET",
		handler: getPredictHistoriesHandler,
	},
];

module.exports = routes;
