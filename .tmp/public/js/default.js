(function($) {
	'use strict';

	const selector = {
		stockList: '.stockList',
		stockTbody: '#stockTbody',
		updateStockListBtn: '#updateStockListBtn',
		pagination: '.page',
		totalCount: '#totalCount'
	};

	const pageSize = 50;

	function createStockCell(text, symbol) {
		let xueqiuStockPage = Constant.getXueqiuStockPageBySymbol(symbol);
		return $('<a>').text(text).attr({
			href: xueqiuStockPage,
			target: '_blank'
		});
	}

	function createStockRow(stock) {
		let $tr = $('<tr />');
		let $code = $('<td />').append(createStockCell(stock.code, stock.symbol));
		let $name = $('<td />').append(createStockCell(stock.name, stock.symbol));
		let $updatedAt = $('<td />').text(moment(stock.updatedAt)
			.format('YYYY-MM-DD H:mm:ss'));
		return $tr.append($code).append($name).append($updatedAt);
	}

	function loadStockList(query, page, size) {
		Service.getStockList({}, page, size)
			.done(function(rst) {
				$(selector.stockTbody).empty();
				_.each(rst.stocks, function(stock) {
					$(selector.stockTbody).append(createStockRow(stock));
				});
				$(selector.pagination).html(UI.Pagination.show({
					total: rst.count,
					size: rst.size,
					current: rst.page,
					cb: function(page, size) {
						loadStockList(query, page, size);
					}
				}));
			});
	}

	function bindUpdateStockListEvent() {
		$(selector.updateStockListBtn).on('click', function() {
			var that = this;
			UI.BlockUI.show({
				target: this
			});
			UI.setDisabled(this);

			let dialogTitle = '更新股票列表';
			Service.updateStockList()
				.done(function() {
					UI.Modal.msgDialog(dialogTitle, '更新成功');
				})
				.fail(function() {
					UI.Modal.errorDialog(dialogTitle, '更新失败');
				})
				.always(function() {
					UI.cancelDisabled(that);
					UI.BlockUI.hide(that);
				});
		});
	}

	$(document).ready(function() {
		loadStockList({}, 1, pageSize);
		bindUpdateStockListEvent();
	});


})(jQuery);
