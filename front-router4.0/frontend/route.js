module.exports = function(app) {
 app.get( '/dlapp', function( req, res, next ) {
  res.redirect( 'http://a.app.qq.com/o/simple.jsp?pkgname=com.bolue');
  // var userAgent = req.headers['user-agent'].toLowerCase();
  // if ( userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 ) {
  //   if (userAgent.indexOf('micromessenger') > -1) {
  //     // var options = {
  //     //   root: `${__dirname}/template/`
  //     // }
  //     // res.sendFile('wechat2dliosapp.html', options);
  //     res.redirect( 'http://a.app.qq.com/o/simple.jsp?pkgname=com.bolue');
  //     return;
  //   }
  //   res.redirect( 'https://itunes.apple.com/cn/app/id1103218349' );
  // } else if (userAgent.indexOf('android') > -1) {
  //   res.redirect( 'http://a.app.qq.com/o/simple.jsp?pkgname=com.bolue');
  // } else {
  //   res.redirect( 'https://mb.linked-f.com' );
  // }
  return;
 });

 app.get( '/scanLogin/*', function( req, res, next ) {
     res.redirect( 'http://a.app.qq.com/o/simple.jsp?pkgname=com.bolue');
     return;
 })
}
