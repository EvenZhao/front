var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var _dispatcher = new Dispatcher();
_dispatcher.lastPayload = null;
_dispatcher.olddispatch = _dispatcher.dispatch;
_dispatcher.dispatch = function(payload) {
	this.lastPayload = payload;
	this.olddispatch(payload);
}.bind(_dispatcher); 

module.exports = _dispatcher;
