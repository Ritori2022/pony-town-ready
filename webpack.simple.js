const webpack = require('webpack');
const path = require('path');

// Very simple webpack config to bundle pre-compiled JS files
module.exports = {
	mode: 'development',
	context: path.join(__dirname, 'src'),
	entry: {
		'bootstrap': './scripts/bootstrap.js',
	},
	output: {
		path: path.resolve(__dirname, 'build', 'assets', 'scripts'),
		filename: '[name].js',
		publicPath: '/assets/scripts/',
	},
	devtool: 'cheap-eval-source-map',
	stats: 'minimal',
	resolve: {
		extensions: ['.js', '.pug', '.scss', '.css'],
		modules: ['node_modules', 'src/ts'],
	},
	module: {
		rules: [
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
			{
				test: /\.css$/,
				use: 'raw-loader',
			},
			{
				test: /\.html$/,
				use: 'raw-loader',
			},
			// Skip template processing for pre-compiled JS files
		]
	},
	plugins: [
		new webpack.DefinePlugin({ 
			DEVELOPMENT: true, 
			TOOLS: false, 
			SERVER: false, 
			BETA: true, 
			TIMING: true, 
			TESTS: false 
		}),
		// Ignore missing template and style modules
		new webpack.IgnorePlugin({
			checkResource(resource, context) {
				// Ignore all .pug and .scss imports
				if (/\.(pug|scss)$/.test(resource)) {
					return true;
				}
				// Ignore relative imports of templates and styles from components
				if (context && context.includes('/components/') && 
				    (resource.includes('.pug') || resource.includes('.scss'))) {
					return true;
				}
				return false;
			}
		}),
	],
};