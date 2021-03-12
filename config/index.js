'use strict'

const path = require('path')

module.exports = {
	dev: {
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {},
		host: 'localhost',
		port: 8080,
		autoOpenBrowser: false,
		errorOverlay: true,
		notifyOnErrors: false,
		poll: false,
		useEslint: false,
		showEslintErrorsInOverlay: true,
		devtool: 'cheap-module-eval-source-map',
		cacheBusting: true,
		cssSourceMap: true
	},

	build: {
		index: path.resolve(__dirname, '../dx-admin/index.html'),
		assetsRoot: path.resolve(__dirname, '../dx-admin'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '/dx-admin/',
		productionSourceMap: true,
		devtool: '#source-map',
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		bundleAnalyzerReport: process.env.npm_config_report
	}
}