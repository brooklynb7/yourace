/**
 * Stock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		symbol: {
			type: 'String'
		},
		code: {
			type: 'String',
			unique: true
		},
		name: {
			type: 'String'
		}
	}
};
