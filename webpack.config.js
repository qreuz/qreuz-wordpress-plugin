const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


sharedConfig = {
	...defaultConfig,
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
		],
	},
	plugins: [
		...defaultConfig.plugins,
	]
};

module.exports = [
	{
		...sharedConfig,
		entry: {
			'qreuz.admin': ['./src/compiler/public-path-qreuz-plugin.js', './src/qreuz-wp-plugin/js/qreuz-wp-plugin-admin.js'],
			'qreuz': ['./src/compiler/public-path-qreuz-plugin.js', './src/qreuz-wp-plugin/js/qreuz-tracker.js'],
			//main: ["./src/js/index.js", "./src/css/frontend.scss"]
		},
		output: {
				// `filename` provides a template for naming your bundles (remember to use `[name]`)
				filename: '[name].min.js',
				// `chunkFilename` provides a template for naming code-split bundles (optional)
				chunkFilename: 'chunk/[name].[chunkhash].min.js',
				// `path` is the folder where Webpack will place your bundles
				path: path.resolve(__dirname, 'build/dist'),
				// `publicPath` is where Webpack will load your bundles from (optional)
				//publicPath: '/wp-content/plugins/qreuz/dist/'
		},
		plugins: [
			...sharedConfig.plugins,
			new CleanWebpackPlugin(),
		],
	},
	{
		// needed as CleanWebPackPlugin has a bug in multi-compiling
		...sharedConfig,
		entry: {
			'temp': './temp/index.js',
			//main: ["./src/js/index.js", "./src/css/frontend.scss"]
		},
		output: {
				// `filename` provides a template for naming your bundles (remember to use `[name]`)
				filename: '[name].min.js',
				// `chunkFilename` provides a template for naming code-split bundles (optional)
				chunkFilename: 'chunk/[name].[chunkhash].min.js',
				// `path` is the folder where Webpack will place your bundles
				path: path.resolve(__dirname, 'temp/dist'),
				// `publicPath` is where Webpack will load your bundles from (optional)
		},
		plugins: [
			...sharedConfig.plugins,
			new CleanWebpackPlugin(),
		],
	},
];
