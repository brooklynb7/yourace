'use strict';

var request = require('request');
var async = require('async');
var _ = require('lodash');

const XUEQIU_API_STOCK =
	'http://xueqiu.com/v4/stock/quote.json?code=$${symbol}';

const XUEQIU_API_STOCK_DAILY =
	'https://xueqiu.com/stock/forchartk/stocklist.json?symbol=$${symbol}&period=1day&type=normal&begin=$${begin}&end=$${end}';

let getStockApiBySymbol = function(symbol) {
	return XUEQIU_API_STOCK.replace('$${symbol}', symbol);
};

let getStockDailyListApi = function(symbol, begin, end) {
	return XUEQIU_API_STOCK_DAILY.replace('$${symbol}', symbol)
		.replace('$${begin}', begin).replace('$${end}', end);
};

module.exports = {
	getDailyList: function(symbol, begin, end, callback) {
		let url = getStockDailyListApi(symbol, begin, end);
		request.get({
			uri: url,
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
				Cookie: 's=1sij11xgh6; xq_a_token=588524a901979c6f99aeb95c1cc51c827f95a631; xqat=588524a901979c6f99aeb95c1cc51c827f95a631; xq_r_token=ca493944d8186909a99b5e62ecf08bd520f6e76a; xq_token_expire=Wed%20Apr%2013%202016%2021%3A36%3A46%20GMT%2B0800%20(CST); xq_is_login=1; u=4393495035; bid=8f9282c77c1905b45e05778f139ac93b_ilz6hsrk; webp=1; __utma=1.796521772.1458394590.1460043777.1460266440.50; __utmb=1.3.10.1460266440; __utmc=1; __utmz=1.1459955776.43.3.utmcsr=localhost:1337|utmccn=(referral)|utmcmd=referral|utmcct=/; Hm_lvt_1db88642e346389874251b5a1eded6e3=1460044534,1460266439,1460266581,1460266584; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1460266584'
					//Host: 'xueqiu.com',
			}
		}, function(error, response, body) {
			if (error || response.statusCode !== 200) {
				console.log(error);
				callback((error || response.statusCode), null);
			} else {
				let rst = JSON.parse(body).chartlist;
				callback(null, rst);
			}
		});
	}
};

//new Date('2016-04-07 00:00:00').getTime()
