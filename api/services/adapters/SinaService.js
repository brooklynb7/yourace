'use strict';

var request = require('request');
var async = require('async');
var _ = require('lodash');

/*
    SINA股票列表分页API, __s参数最后2位:
    * 倒数第二位: 当前页数,目前最多页数为6
    * 倒数第一位: 每页显示数量,目前最多显示500
*/
const API_SINA = 'http://money.finance.sina.com.cn/d/api/openapi_proxy.php';
const API_SINA_HQ_HS_A_MAX_SIZE = 500;
const API_SINA_HQ_HS_A_MAX_PAGE = 6;
const API_SINA_HQ_HS_A =
	`${API_SINA}/?__s=[[%22hq%22,%22hs_a%22,%22%22,1,$$page,${API_SINA_HQ_HS_A_MAX_SIZE}]]`;

let getStockListApiByPage = function(page) {
	return API_SINA_HQ_HS_A.replace('$$page', page);
};

let getStockCodeObjectArray = function(stocks, fields) {
	return _.map(stocks, function(item) {
		return {
			code: item[_.indexOf(fields, 'code')]
		};
	});
};

let getStockObjectArray = function(stocks, fields) {
	return _.map(stocks, function(item) {
		let rst = {};
		_.each(['symbol', 'code', 'name'], function(field) {
			rst[field] = item[_.indexOf(fields, field)];
		});
		return rst;
	});
};

let callStockListApiByPage = function(page, callback) {
	return function(callback) {
		request.get({
			uri: getStockListApiByPage(page),
			method: 'GET'
		}, function(error, response, body) {
			if (error) {
				callback(error, null);
			} else {
				let rst = JSON.parse(body)[0];
				callback(null, rst);
			}
		});
	};
};

module.exports = {
	getStockList: function(callback) {
		let fnArray = [];
		for (let i = 1; i <= API_SINA_HQ_HS_A_MAX_PAGE; i++) {
			fnArray.push(callStockListApiByPage(i));
		}
		async.parallel(fnArray, function(err, results) {
			if (err) {
				callback(err, null);
			} else {
				let json = {
					day: results[0].day,
					fields: results[0].fields,
					items: _.flatten(_.map(results, 'items'))
				};
				callback(null, json);
			}
		});
	},

	checkAndCreateStocks: function(stock, callback) {
		var stockCodes = getStockCodeObjectArray(stock.items, stock.fields);
		var stocks = getStockObjectArray(stock.items, stock.fields);
		Stock.findOrCreate(stockCodes, stocks).exec(callback);
	},

	checkAndUpdateStocks: function(stock, callback) {
		var stocks = getStockObjectArray(stock.items, stock.fields);

		var fnArray = [];

		_.forEach(stocks, function(item) {
			fnArray.push(function(cb) {
				Stock.update({
					code: item.code
				}, item).exec(cb);
			});
		});

		async.parallel(fnArray, function(err, results) {
			if (err) {
				callback(err, null);
			} else {
				callback(null, _.flatten(results));
			}
		});
	}
};

/*
[
    "symbol",        //股票编号
    "code",          //股票代码
    "name",          //股票名称
    "trade",         //现价
    "pricechange",   //涨跌
    "changepercent", //涨幅
    "buy",
    "sell",
    "settlement",    //昨收
    "open",          //金开
    "high",          //最高
    "low",           //最低
    "volume",        //成交量
    "amount",        //成交额
    "ticktime",      //时间
    "per",			 //市盈率 ?
    "per_d",         //动态市盈率TTM ?
    "nta",           //每股净资产 元
    "pb",            //市净率
    "mktcap",        //总市值 元
    "nmc",           //流通市值 元
    "turnoverratio", //换手率 ％
]
*/
