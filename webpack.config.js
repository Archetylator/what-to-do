const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');
const SveltePreprocess = require('svelte-preprocess');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.mjs', '.js', '.svelte']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						preprocess: SveltePreprocess()
					}
				}
			},
			{
				test: /\.s?css/,
				use: [prod ? MiniCssExtractPlugin.loader : 'style-loader','css-loader', 'sass-loader']
			},
			{
        test: /\.svg$/,
				loader: 'svg-inline-loader',
				options: {
					removeSVGTagAttrs: true
				}
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		// new WorkboxPlugin.GenerateSW({
		// 	clientsClaim: true,
  //     skipWaiting: true,
		// })
	],
	devtool: prod ? false: 'source-map'
};