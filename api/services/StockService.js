'use strict';

var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var sinaAdapter = require('./adapters/SinaService');
var xueqiuAdapter = require('./adapters/XueQiuService');

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

	getDailyList: function(callback) {
		let datetime = new Date(moment().format('YYYY-MM-DD 00:00:00')).getTime();
		async.waterfall([
			function(cb) {
				Stock.find().exec(cb);
			},
			function(stocks, cb) {
				let fns = [];
				_.each(stocks, function(stock) {
					fns.push(function(callback) {
						xueqiuAdapter.getDailyList(stock.symbol, datetime, datetime,
							function(err, rst) {
								if (err || !_.isArray(rst)) {
									rst = {};
								} else {
									rst = rst[0];
									rst.code = stock.code;
									rst.time = new Date(rst.time).getTime();
								}
								callback(null, rst);
							});
					});
				});
				async.parallel(_.slice(fns, 0, 1000), cb);
			}
		], function(err, result) {
			callback(err, result);
		});
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
					.paginate({
						page: page,
						limit: pageSize
					})
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
