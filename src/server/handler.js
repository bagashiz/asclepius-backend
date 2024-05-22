/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const { storeData, getAllData } = require("../services/storeData");

/**
 * /predict handler
 * @param {Request} request - request object
 * @param {ResponseToolkit} h - response toolkit
 * @returns {Promise<ResponseObject>} - response object
 */
async function postPredictHandler(request, h) {
	// @ts-ignore
	const { image } = request.payload;
	// @ts-ignore
	const { model } = request.server.app;

	const { label, suggestion } = await predictClassification(model, image);

	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();

	const data = {
		id: id,
		result: label,
		suggestion: suggestion,
		createdAt: createdAt,
	};

	await storeData(id, data);

	const response = h.response({
		status: "success",
		message: "Model is predicted successfully.",
		data,
	});
	response.code(201);
	return response;
}

/**
 *
 * @param {Request} request - request object
 * @param {ResponseToolkit} h - response toolkit
 * @returns {Promise<ResponseObject>} - response object
 */
async function getPredictHistoriesHandler(request, h) {
	const data = await getAllData();

	const filteredData = data.map((item) => {
		return {
			id: item.id,
			history: item,
		};
	});

	const response = h.response({
		status: "success",
		data: filteredData,
	});
	return response;
}

module.exports = { postPredictHandler, getPredictHistoriesHandler };
