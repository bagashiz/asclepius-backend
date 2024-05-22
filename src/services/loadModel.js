const tf = require("@tensorflow/tfjs-node");

/**
 * Load model from the given URL
 * @param {string} modelUrl - the URL of the model to be loaded
 * @returns {Promise<tf.GraphModel>} - model
 */
async function loadModel(modelUrl) {
	return tf.loadGraphModel(modelUrl);
}

module.exports = loadModel;
