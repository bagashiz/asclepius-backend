import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
	{
		files: ["**/*.js"],
		languageOptions: { sourceType: "commonjs" },
		plugins: { jsdoc },
		rules: {},
	},
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
	jsdoc.configs["flat/recommended-error"],
];
