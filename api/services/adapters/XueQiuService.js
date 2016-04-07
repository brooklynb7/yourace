'use strict';

const XUEQIU_API_STOCK =
	'http://xueqiu.com/v4/stock/quote.json?code=$${symbol}';

const XUEQIU_API_STOCK_DAILY =
	'http://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ000017&period=1day&type=normal&begin=1458956974987';

let getStockApiBySymbol = function(symbol) {
	return XUEQIU_API_STOCK.replace('$${symbol}', symbol);
};

module.exports = {
	getDailyList: function() {

	}
};
