const dotenv = require("dotenv");
const Hapi = require("@hapi/hapi");
const InputError = require("../exceptions/InputError");
const routes = require("./routes");
const loadModel = require("../services/loadModel");

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const config = {
	port: process.env.HTTP_PORT,
	host: process.env.HTTP_HOST,
	cors: process.env.HTTP_CORS_ORIGIN
		? process.env.HTTP_CORS_ORIGIN.split(",")
		: ["*"],
	model_url: process.env.MODEL_URL,
};

/**
 * Main function
 */
async function main() {
	const server = Hapi.server({
		port: config.port,
		host: config.host,
		routes: {
			cors: {
				origin: config.cors,
			},
		},
	});

	const model = await loadModel(config.model_url);
	// @ts-ignore
	server.app.model = model;

	// @ts-ignore
	server.route(routes);

	server.ext("onPreResponse", function (request, h) {
		const response = request.response;

		if (response instanceof InputError) {
			const newResponse = h.response({
				status: "fail",
				message: "Terjadi kesalahan dalam melakukan prediksi",
			});
			newResponse.code(response.statusCode);
			return newResponse;
		}

		if (response && "isBoom" in response) {
			const newResponse = h.response({
				status: "fail",
				message: response.message,
			});
			newResponse.code(response.output.statusCode);
			return newResponse;
		}

		return h.continue;
	});

	await server.start();
	console.log(`Server start at: ${server.info.uri}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
