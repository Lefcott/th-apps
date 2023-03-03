/** @format */

const path = require("path");
const webpack = require("webpack");
const CleanObsoleteChunks = require("webpack-clean-obsolete-chunks");

module.exports = () => {
	return {
		name: "@teamhub/content-creator",

		entry: {
			"teamhub-content-creator": [
				"angular",
				"single-spa-angularjs",
				"angular-sanitize",
				"angular-ui-router",
				"angular-ui-bootstrap",
				"angular-multiple-select",
				"flowtype-js",
				"jquery-ui-dist/jquery-ui",
				"jquery/dist/jquery.min.js",
				"spectrum-colorpicker",
				"./src/teamhub-content-creator.js",
			],
		},

		output: {
			filename: "teamhub-content-creator.js",
			libraryTarget: "system",
			path: path.resolve(__dirname, "dist"),
			jsonpFunction: "webpackJsonp_content-creator",
		},

		resolve: {
			extensions: [".js", ".mjs", ".jsx", ".wasm", ".json"],

			alias: {
				"jquery-ui": "jquery-ui-dist/jquery-ui.min.js",
				cropperjs: "cropperjs/dist/cropper.min.js",
				"jquery-cropper": "jquery-cropper/dist/jquery-cropper.min.js",
				modules: path.join(__dirname, "node_modules"),
			},
		},

		externals: [/^@teamhub\//, "single-spa"],

		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: [/(node_modules|bower_components|parcels)/],
					use: {
						loader: "babel-loader",
						options: {
							presets: ["es2015", "stage-1"],
							plugins: [
								"transform-decorators-legacy",
								"transform-class-properties",
							],
						},
					},
				},
				{
					test: /\.html$/,
					use: [
						{
							loader: "html-loader",
							options: {
								minimize: true,
								attrs: false,
							},
						},
					],
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: "style-loader",
							options: {
								injectType: "singletonStyleTag",
								attributes: { id: "creator-styles" },
							},
						},
						"css-loader",
					],
				},
				{
					test: /\.(png|gif|woff|woff2|eot|ttf)$/,
					loader: "url-loader",
					query: {
						// Inline images smaller than 10kb as data URIs
						limit: 10000,
					},
				},
				{
					test: /\.svg$/,
					loader: "svg-inline-loader",
				},
			],
		},

		plugins: [
			new CleanObsoleteChunks(),
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery",
				flowtype: "flowtype-js",
				_: "lodash",
				Reveal: path.join(__dirname, "src/app/vendor/reveal.min.js"),
			}),
		],
	};
};
