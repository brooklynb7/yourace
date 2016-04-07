'use strict';

var async = require('async');
var _ = require('lodash');
var sinaAdapter = require('./adapters/SinaService');

module.exports = {
	getSinaStockList: function(callback) {
		sinaAdapter.getStockList(callback);
	},

	updateStockListBySina: function(callback) {
		async.waterfall([
			sinaAdapter.getStockList,
			function(stock, cb) {
				sinaAdapter.checkAndCreateStocks(stock, function(err) {
					cb(err, stock);
				});
			},
			function(stock, cb) {
				sinaAdapter.checkAndUpdateStocks(stock, cb);
			}
		], callback);
	},

	getStocks: function(condition, callback) {
		let page = parseInt(condition.page) - 1;
		if (_.isNaN(page)) {
			page = 0;
		}
		let pageSize = parseInt(condition.size);
		if (_.isNaN(pageSize)) {
			pageSize = 100;
		}
		let sort = 'code';
		if (condition.sort) {
			sort = condition.sort;
		}
		let query = {};
		if (condition.name) {
			query.name = new RegExp(condition.name, 'i');
		}
		async.parallel([
			function(callback) {
				Stock.count(query).exec(callback);
			},
			function(callback) {
				Stock
					.find(query).sort(sort)
					.skip(page * pageSize).limit(pageSize)
					.exec(callback);
			}
		], function(err, results) {
			callback(err, {
				stocks: results[1],
				count: results[0],
				page: page + 1,
				size: pageSize
			});
		});

	}
};
