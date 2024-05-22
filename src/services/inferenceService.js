const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

/**
 * Predict image classification
 * @param {tf.GraphModel} model - model to be used for prediction
 * @param {Buffer} image - image to be predicted
 * @returns {Promise<{ label: string, suggestion: string }>} - prediction result
 */
async function predictClassification(model, image) {
	try {
		const tensor = tf.node
			.decodeJpeg(image)
			.resizeNearestNeighbor([224, 224])
			.expandDims()
			.toFloat();

		const prediction = model.predict(tensor);
		// @ts-ignore
		const score = await prediction.data();
		const confidenceScore = Math.max(...score) * 100;

		const classes = ["Cancer", "Non-cancer"];
		const classResult = confidenceScore > 50 ? 0 : 1;
		const label = classes[classResult];

		let suggestion;

		if (label === "Cancer") {
			suggestion = "Segera periksa ke dokter!";
		}

		if (label === "Non-cancer") {
			suggestion = "Tidak perlu khawatir, namun tetap periksa ke dokter.";
		}

		return { label, suggestion };
	} catch (error) {
		throw new InputError(error.message);
	}
}

module.exports = predictClassification;
