(function($) {
	'use strict';

	const XUEQIU_PAGE_STOCK = 'http://xueqiu.com/S/$${symbol}';

	let Constant = function() {};

	Constant.prototype.getXueqiuStockPageBySymbol = function(symbol) {
		return XUEQIU_PAGE_STOCK.replace('$${symbol}', symbol);
	};

	window.Constant = new Constant();
})(jQuery);
