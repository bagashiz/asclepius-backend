const { Firestore, WriteResult } = require("@google-cloud/firestore");

const db = new Firestore({
	projectId: process.env.GCP_PROJECT_ID,
});

/**
 * Store data to Firestore
 * @param {string} id - id of the data
 * @param {object} data - data to be stored
 * @returns {Promise<WriteResult>} - Firestore write result
 */
async function storeData(id, data) {
	const predictCollection = db.collection("predictions");
	return predictCollection.doc(id).set(data);
}

/**
 * Get all data from Firestore
 * @returns {Promise<Array>} - all data from Firestore
 */
async function getAllData() {
	const predictCollection = db.collection("predictions");
	const snapshot = await predictCollection.get();
	const data = snapshot.docs.map((doc) => doc.data());
	return data;
}

module.exports = { storeData, getAllData };
