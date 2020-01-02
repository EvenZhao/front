var Dispatcher = require('../dispatcher/AppDispatcher.js');
var AuthStore = require('../stores/AuthStore.js')(Dispatcher);

module.exports = function(React){

	/*
	*#jQuery ajax global setup, should be included in Pg .js files at head. #
	*/
	jQuery.ajaxSetup({
		crossDomain: true,
	    contentType: "application/json;charset=utf-8",
	    dataType: 'json',
	    statusCode: {
			401: function() { //Need bind
				if(isWeiXin) {
					AuthStore.emit(AuthStore.Events.SC401);
				} else {
					Dispatcher.lastErr403Payload = Dispatcher.lastPayload;
					AuthStore.emit(AuthStore.Events.SC403);
				}
			},
			403: function() { //Not login
				Dispatcher.lastErr403Payload = Dispatcher.lastPayload;
				AuthStore.emit(AuthStore.Events.SC403);
			}
		}
	});
};