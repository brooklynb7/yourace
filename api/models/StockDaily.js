/**
 * StockDaily.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		code: {
			type: 'string'
		},
		date: {
			type: 'integer'
		},
		volume: {
			type: 'integer'
		},
		open: {
			type: 'float'
		},
		high: {
			type: 'float'
		},
		close: {
			type: 'float'
		},
		low: {
			type: 'float'
		},
		chg: {
			type: 'float'
		},
		percent: {
			type: 'float'
		},
		turnrate: {
			type: 'float'
		},
		mac5: {
			type: 'float'
		},
		mac10: {
			type: 'float'
		},
		mac20: {
			type: 'float'
		},
		mac30: {
			type: 'float'
		},
		dif: {
			type: 'float'
		},
		dea: {
			type: 'float'
		},
		macd: {
			type: 'float'
		}
	}
};


// volume: 8853916,
// open: 12.05,
// high: 12.5,
// close: 12.39,
// low: 12,
// chg: 0.49,
// percent: 4.1176,
// turnrate: 2.9222,
// ma5: 12.262,
// ma10: 12.286,
// ma20: 12.112,
// ma30: 12.407,
// dif: 0.05,
// dea: 0.03,
// macd: 0.05,
