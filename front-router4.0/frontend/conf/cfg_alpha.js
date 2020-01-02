var express = require('express'); 

function cfg_alpha(app){
	console.log('run on cfg_dist');
	var options4static = {
			dotfiles: 'ignore',
	//  etag: false,
			// extensions: ['htm', 'html'],
      index: ['index_alpha.html'],
	//  maxAge: '1d',
			redirect: false,
			setHeaders: function (res, path, stat) {
				res.set('x-timestamp', Date.now());
			}
	};
  app.get('/apple-app-site-association', function (req, res){
    res.set('Content-Type', 'application/json');
    res.sendFile('apple-app-site-association', {root: 'public/'})
  })
	app.use(express.static('dist/public', options4static));
  app.get('*', function (req, res){
    res.sendFile('index_alpha.html', {root: 'dist/public/'})
  })
	//---404
	var NOTFOUND = "Not found";
	app.get(function(req, res) {
	    res.status(404);
	    res.format({
	          // html: function() {
	          //   res.sendFile('404.html',{root:'dist/public/'});
	          // },
	          json: function(){
	            res.send({ message: NOTFOUND });
	          },
	          'default': function() {
	            res.send({ message: NOTFOUND });
	          }
	    });
	});
}
module.exports = cfg_alpha;
