(function($) {
	'use strict';

	var Service = function() {
		this.url_prefix = '/api';
	};

	Service.prototype.getApiUrl = function(serviceUrl) {
		if (serviceUrl.indexOf('/') !== 0) {
			serviceUrl = '/' + serviceUrl;
		}
		return this.url_prefix + serviceUrl;
	};

	/*
	 *	Stock Api
	 */
	Service.prototype.getStockList = function(condition, page, size) {
		condition.page = page;
		condition.size = size;
		return $.ajax({
			url: this.getApiUrl('/stock'),
			data: condition,
			method: 'GET'
		});
	};

	Service.prototype.updateStockList = function() {
		return $.ajax({
			url: this.getApiUrl('/stock/update'),
			method: 'POST'
		});
	}

	window.Service = new Service();
})(jQuery);
