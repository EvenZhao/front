/**
 * server.js
 * Created by Crane Leeon
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

var express = require('express');
var app = express();
var stringifyObject = require('stringify-object');
var compression = require('compression');
var ejs = require('ejs');
const path = require('path');

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}
// app.engine('jade', require('html').__express);

app.use(compression({ filter: shouldCompress }));
//允许跨域
global.useCORS = (allowedOrigins) => {
    app.all('*', function (req, res, next) {
        var origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
            res.setHeader('Access-Control-Allow-Origin', `notallowed:${origin}`);
        }
        //res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, MyAuth ,bolueClient,station,city,wailian,devToken,UUIDIMEI,bolueVer");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        var method = req.method && req.method.toUpperCase && req.method.toUpperCase();
        if (method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    });
}
const allowedOrigins = ['http://localhost:8080', 'http://10.10.30.166:8080', 'http://mb.linked-f.com', 'https://mb.linked-f.com', 'http://mb.bolue.cn', 'https://mb.bolue.cn']
useCORS(allowedOrigins);
// view engine setup


//2019年8月27日11:06，开发使用public/index.html；测试和正式服 统一使用dist/public/index.html
var _path = 'dist/public/';
if (process.env.NODE_ENV == 'dev') {
    _path = 'public/'
}

app.set('views', path.join(__dirname, _path));
/* switch (process.env.NODE_ENV) {
    case 'dev':
        app.set('views', path.join(__dirname, 'public'));
        break;
    default:
        app.set('views', path.join(__dirname, 'dist/public'));
} */
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
//---CustomConfig
var configENV = function () {
    //----static resource
    var options4static = {
        dotfiles: 'ignore',
        //  etag: false,
        // extensions: ['htm', 'html'],
        index: ['index.html'],
        //  maxAge: '1d',
        redirect: false,
        setHeaders: function (res, path, stat) {
            res.set('x-timestamp', Date.now());
        }
    };
    // app.set('views', path.join(__dirname, 'public'));
    app.get('/apple-app-site-association', function (req, res) {
        res.set('Content-Type', 'application/json');
        res.sendFile('apple-app-site-association', { root: 'dist/public/' })
    })
    app.get('/activity/*', function (req, res) {
        res.sendFile('activityIndex.html', { root: _path })
    })
    app.get('/', function (req, res) {
        res.render('index', {
            data: 0
        })
    })
    //2019年8月27日11:06，开发使用public/index.html；测试和正式服 统一使用dist/public/index.html
    app.use(express.static(_path, options4static));
    // app.use('/livePlay', require('./polyv'));
    require('./staticRoute')(app);
    // 2019年8月15日15:32:18 新增：学习官报名页面需要给IOS和微信共用，故做此改造
    // IOS会将登录信息放在header中带过来，故用headersDatas接收，然后存在localStorage
    app.get('*', function (req, res) {
        // res.sendFile('index.html', { root: 'dist/public/' })
        var o = req.headers;
        if (o && o.bolueclient) {
            res.render('index', {
                data: JSON.stringify({
                    bolueclient: o.bolueclient
                    , boluever: o.boluever
                    , 'openid': o.openid
                    , 'code': o.code
                    , 'params': o.params 
                })
            })
        } else {
            res.render('index', {
                data: 0
            })
        }
    })
    //---404
    var NOTFOUND = "Not found";
    app.get(function (req, res) {
        res.status(404);
        res.format({
            // html: function() {
            //   res.sendFile('404.html',{root:'public/'});
            // },
            json: function () {
                res.send({ message: NOTFOUND });
            },
            'default': function () {
                res.send({ message: NOTFOUND });
            }
        });
    });
};

// require("./backend/routes")(app);
require('./route')(app);
configENV();
/**
 * 不同环境，调用不同的文件配置
 * author markwang
 * version 2019-08-27T11:03:19+0800
 * email wangji5850@sina.com
 * example no example
 * modification list 2015-5-8 新增 
                       2019-08-27 开发使用public/index.html；测试和正式服 统一使用dist/public/index.html
 * @param {[type]} process.env.NODE_ENV [description]
 * @return {[type]}
 */
/*switch (process.env.NODE_ENV) {
    case 'dev':
        configDev();

        break;
    default:
        require('./conf/cfg_' + process.env.NODE_ENV + '.js')(app); //init config from conf/cfg_xxx.js , xxx = NODE_ENV
}*/


//---Error Handler
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send({ message: 'Something broke!' });
});
console.info({ 'process.env': process.env });
var port = process.env.PORT || (process.env.NODE_APP_INSTANCE ? 8080 + Number.parseInt(process.env.NODE_APP_INSTANCE) : 8080);
app.listen(port);
console.log('Express server started on:' + port);