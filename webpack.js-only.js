const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Configuration to use pre-compiled JS files instead of TypeScript
module.exports = merge(common, {
	mode: 'development',
	entry: {
		'bootstrap': './scripts/bootstrap.js',
		'bootstrap-admin': './scripts/bootstrap-admin.js',
		'bootstrap-tools': './scripts/bootstrap-tools.js',
	},
	devtool: 'cheap-eval-source-map',
	stats: 'minimal',
	output: {
		pathinfo: false
	},
	resolve: {
		extensions: ['.js', '.pug', '.scss', '.css'],
		// Map relative paths to TypeScript source directory
		modules: ['node_modules', 'src/ts'],
	},
	module: {
		rules: [
			// Handle pug templates
			{
				test: /\.pug$/,
				use: [
					'raw-loader',
					{
						loader: 'pug-html-loader',
						query: { doctype: 'html', plugins: require('pug-plugin-ng') },
					},
				],
			},
			// Handle scss styles 
			{
				test: /\.scss$/,
				use: [
					'raw-loader',
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: loader => [
								require('autoprefixer')('last 2 versions'),
								require('cssnano')({ discardComments: { removeAll: true } }),
							],
						},
					},
					{
						loader: 'sass-loader',
						options: { includePaths: ['src/styles'] },
					},
				],
			},
			// Handle JavaScript files
			{
				test: /\.js$/,
				use: ['angular2-template-loader'],
				exclude: [/node_modules/],
			},
		]
	},
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
	},
	plugins: [
		new webpack.DefinePlugin({ 
			DEVELOPMENT: true, 
			TOOLS: true, 
			SERVER: false, 
			BETA: true, 
			TIMING: true, 
			TESTS: false 
		}),
	],
});