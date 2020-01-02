module.exports = function (app) {
    // 直播间
    app.get('/livePlay/:id?', function (req, res, next) {
        var o = req.headers;
        res.render('html/live', {
            data: JSON.stringify({
                bolueclient: o.bolueclient,
                boluever: o.boluever,
                myauth: o.myauth
            })
        })
    });
    // 1085 邀请体验直播课流程优化
    app.get('/liveInvite/:id', function(req, res, next) {
        var o = req.headers;
        res.render('html/live_invite', {
            data: JSON.stringify({
                bolueclient: o.bolueclient,
                boluever: o.boluever,
                myauth: o.myauth
            })
        })
    })
    // 阿里云验证码 2019年8月27日13:26:45
    app.get('/vaptcha-app', function (req, res, next) {
        var o = req.headers;
        if ((o && o.bolueclient) || req.query.fromMApp == 1) {
            if(req.query.fromMApp == 1) { //小程序
                o = req.query;
            }
            res.render('vaptcha-app', {
                data: JSON.stringify({
                    phoneOrEmail: o.phoneoremail,
                    verifyType: o.verifytype,
                    isVoice: parseInt(o.isvoice),
                    bolueClient: o.bolueclient, //miniprogram
                    bolueVer: o.boluever,
                    UUIDIMEI: o.uuidimei,
                    devToken: o.devtoken,
                    myAuth: o.myauth
                })
            })
        } else {
            res.render('vaptcha-app', {
                data: JSON.stringify({})
            })
        }
    })
}