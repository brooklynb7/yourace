(function($) {
	'use strict';

	var UI = function() {};

	UI.prototype.setDisabled = function(el) {
		$(el).attr('disabled', 'disabled');
	};

	UI.prototype.cancelDisabled = function(el) {
		$(el).removeAttr('disabled');
	};

	window.UI = new UI();
})(jQuery);

(function($) {
	'use strict';

	var _confirmModalHtml = function(options) {
		options = options || {};
		var modalSize = (options.size === 'large' ? 'modal-lg' : '');
		var $modal = $('<div class="modal  fade" tabindex="-1" />');
		if (navigator.userAgent.indexOf('Android 2.3') !== -1) {
			$modal.attr('style', 'position:absolute;overflow: visible;');
		}
		var $modal_dialog = $('<div class="modal-dialog ' + modalSize + '" />');
		var $modal_content = $('<div class="modal-content" />');

		var $modal_header = $('<div class="modal-header" />');
		var $close_btn = $(
			'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
		);
		var $modal_title = $('<h4 class="modal-title">' + (options.title ||
			'Modal title') + '</h4>');
		$modal_header.append($close_btn).append($modal_title);

		var $modal_body = $('<div class="modal-body" />').append(options.html || '');
		if (options.form) {
			$modal_body.addClass('form');
		}
		$modal_content.append($modal_header).append($modal_body);

		var $modal_footer = $('<div class="modal-footer" />');
		var $modal_close = null;
		if (options.modalType === 1) {
			var $modal_msg = $(
				'<span class="text-danger modal-msg" style="margin-right: 10px;"></span>'
			);
			$modal_close = $(
				'<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">取消</button>'
			);
			var $modal_confirm = $(
				'<button type="button" class="btn btn-sm blue confirm-btn">确认</button>');
			if (options.suspendConfirm === true) {
				$modal_confirm = $(
					'<button type="button" class="btn btn-sm blue confirm-btn" disabled>暂不开放</button>'
				);
			}

			$modal_footer.append($modal_msg).append($modal_close).append(
				$modal_confirm);
		} else if (options.modalType === 2) {
			$modal_close = $(
				'<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">关闭</button>'
			);
			$modal_footer.append($modal_close);
		}
		$modal_content.append($modal_footer);

		$modal.append($modal_dialog.append($modal_content));
		$modal.on('hidden.bs.modal', function() {
			$modal.remove();
		});
		$modal.on('shown.bs.modal', function() {
			if ($.isFunction(options.shownEvent)) {
				options.shownEvent();
			}
			if (navigator.userAgent.indexOf('Android 2.3') !== -1) {
				$('body.modal-open').css('overflow', 'auto');
				window.scrollTo(0, 0);
			}
			$modal_body.css({
				'max-height': ($(window).height() - 200) + 'px',
				'overflow-y': 'auto'
			});
		});
		//$modal.find('.plh').placeholder();
		return $modal;
	};

	var creatConfirmModal = function(options) {
		options.modalType = 1;
		var $modal = _confirmModalHtml(options);
		$('body').append($modal);
		$modal.modal('show');
		if (options && options.confirm && $.isFunction(options.confirm)) {
			$modal.find('.confirm-btn').on('click', function() {
				options.confirm($modal);
			});
		}
		return $modal;
	};

	var createDialogModal = function(options) {
		options.modalType = 2;
		var $modal = _confirmModalHtml(options);
		$('body').append($modal);
		$modal.modal('show');

		return $modal;
	};

	window.UI.Modal = {
		confirm: creatConfirmModal,
		dialog: createDialogModal,
		errorDialog: function(title, text) {
			createDialogModal({
				title: title,
				html: '<div class="text-center alert alert-danger">' + text + '</div>'
			});
		},
		msgDialog: function(title, text) {
			createDialogModal({
				title: title,
				html: '<div class=text-center>' + text + '</div>'
			});
		}
	};
})(jQuery);

(function($) {
	'use strict';

	var generateEllipsisLink = function() {
		return $('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
	};

	var publishPaginationEvent = function(page, size, cb) {
		return function() {
			cb(page, size);
		};
	};

	var createFirstLink = function(page, size, cb) {
		return $('<li/>')
			.append($(
					'<a href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>'
				)
				.on('click', publishPaginationEvent(page, size, cb)));
	};

	var createLastLink = function(page, size, cb) {
		return $('<li/>')
			.append($(
					'<a href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>'
				)
				.on('click', publishPaginationEvent(page, size, cb)));
	};

	var createPagination = function(options) {
		var total = options.total;
		var size = options.size;
		var currentPage = options.current;
		var cb = options.cb;

		var $ul = $('<ul class="pagination pull-right" />');
		if (total > 0) {
			var pages = Math.ceil(total / size);
			var page_start = currentPage - 2 > 0 ? currentPage - 2 : 1;
			var page_end = page_start + 4 >= pages ? pages : page_start + 4;

			var $firstLink = createFirstLink(1, size, cb);

			if (currentPage === 1) {
				$firstLink.addClass('disabled');
			}
			$ul.append($firstLink);

			if (page_start > 1) {
				$ul.append(generateEllipsisLink());
			}

			for (var i = page_start; i <= page_end; i++) {
				var $link = $('<li/>')
					.append($('<a href="javascript:void(0);">' + i + '</a>').on('click',
						publishPaginationEvent(i, size, cb)));
				if (i === currentPage) {
					$link.addClass('active disabled');
				}
				$ul.append($link);
			}

			if (page_end < pages) {
				$ul.append(generateEllipsisLink());
			}

			var $lastLink = createLastLink(pages, size, cb);

			if (currentPage === pages) {
				$lastLink.addClass('disabled');
			}
			$ul.append($lastLink);

			return $('<nav />').append($ul);
		}
	};
	window.UI.Pagination = {
		show: createPagination
	};
})(jQuery);

(function($) {
	'use strict';

	let show = function(options) {
		options = $.extend(true, {}, options);
		let html =
			'<div class="loading-message"><img src="/images/loading.gif" align=""></div>';

		if (options.target) { // element blocking
			var el = $(options.target);
			if (el.height() <= ($(window).height())) {
				options.cenrerY = true;
			}
			el.block({
				message: html,
				baseZ: options.zIndex ? options.zIndex : 1000,
				centerY: options.cenrerY !== undefined ? options.cenrerY : false,
				css: {
					top: '10%',
					border: '0',
					padding: '0',
					backgroundColor: 'none'
				},
				overlayCSS: {
					backgroundColor: options.overlayColor ? options.overlayColor : '#000',
					opacity: options.boxed ? 0.05 : 0.1,
					cursor: 'wait'
				}
			});
		} else { // page blocking
			$.blockUI({
				message: html,
				baseZ: options.zIndex ? options.zIndex : 1000,
				css: {
					border: '0',
					padding: '0',
					backgroundColor: 'none'
				},
				overlayCSS: {
					backgroundColor: options.overlayColor ? options.overlayColor : '#000',
					opacity: options.boxed ? 0.05 : 0.1,
					cursor: 'wait'
				}
			});
		}
	};

	let hide = function(target) {
		if (target) {
			$(target).unblock({
				onUnblock: function() {
					$(target).css('position', '');
					$(target).css('zoom', '');
				}
			});
		} else {
			$.unblockUI();
		}
	};

	window.UI.BlockUI = {
		show: show,
		hide: hide
	};
})(jQuery);
