// var notify;
var nf = {
	showWarning: function(txt, delay) {
		var notify = $.notify({
			// options
			icon: 'fa fa-exclamation-triangle',
			message: txt
		},{
			// settings
			offset: 150,
			position: 'absolute',
			delay: delay || 1500,
			type: 'danger',
			animate: {
				enter: 'animated bounceInRight',
				exit: 'animated bounceOutLeft'
			},
			element: 'body',
			placement: {
				from: "top",
				align: "center"
			},
		});
		return notify;
	}
};
module.exports = nf;