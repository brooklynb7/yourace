/**
 * StockController
 *
 * @description :: Server-side logic for managing stocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var async = require('async');
var _ = require('lodash');

module.exports = {
	query: function(req, res) {
		var condition = {
			page: req.query.page,
			size: req.query.size,
			name: req.query.name
		};
		StockService.getStocks(condition, function(err, stocks) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(stocks);
			}
		});
	},

	updateAll: function(req, res) {
		StockService.updateStockListBySina(function(err, rst) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(rst);
			}
		});
	},

	getSinaStockList: function(req, res) {
		StockService.getSinaStockList(function(err, stocks) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(stocks);
			}
		});
	},

	getDailyList: function(req, res) {
		StockService.getDailyList(function(err, list) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(list);
			}
		});
	}
};
