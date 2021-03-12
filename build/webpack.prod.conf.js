'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssTextPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const webpackConfig = merge(baseWebpackConfig, {
	mode: 'production',
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
			usePostCSS: true
		})
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
	},
	optimization: {
		splitChunks: {
			chunks: 'async',
			name: true,
			cacheGroups: {
				common: {
					name: 'common',
					chunks: 'initial',
					minChunks: 2
				},
				vendor: {
					name: 'vendor',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all'
				}
			}
		},
		// minimize: false
	},
	plugins: [
		new HappyPack({
			id: 'happyBabel', // 对于loaders id
			loaders: ['cache-loader', 'babel-loader?cacheDirectory=true'], // 是用babel-loader解析
			threadPool: happyThreadPool,
			verboseWhenProfiling: true // 显示信息
		}),
		// extract css into its own file
		new MiniCssTextPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css'),
			allChunks: true,
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin({
			cssProcessorOptions: config.build.productionSourceMap
				? { safe: true, map: { inline: false } }
				: { safe: true }
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: process.env.NODE_ENV === 'testing'
				? 'index.html'
				: config.build.index,
			template: 'index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
		// keep module.id stable when vendor modules does not change
		// new webpack.HashedModuleIdsPlugin(),

		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../static'),
				to: config.build.assetsSubDirectory,
				ignore: ['.*']
			}
		]),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env.NODE_ENV)
		})
	]
})

if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin')

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig