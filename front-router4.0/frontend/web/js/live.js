$.ajaxSetup({
    header: {
        'Content-type': 'application/json'
    }
    , cache: false
});

//倒计时
(function(W, D) {
    var timeCount = W["timeCount"] = function(o) {
            return new _timeCount(o);
        }
        , _timeCount = function(o) {
            this.leftTime = o.leftTime;
            this.dom = o.dom;
            this.format = o.format;
            this.callback = o.callback;
            this.time = 0; //用于给callback提供当前时间参数
            this.i = 0;
            this.flag = o.flag; // 是否为正计时 true 正计时 false 倒计时
            this.lastTime = 0 || o.lastTime * 60; //超过lastTime分钟开始倒计时
            this.period = o.period || 1000 //计时器间隔(format为5，period为100，联动使用)
            /* var aa=this.check();
             this.diff_time=aa[0];
             if(aa[1]==0)
             {
                 this.init();
                 
             }*/
            var _this = this;
            this.interval = setInterval(function() {
                _this.init();
                _this.callback && _this.callback(_this.dom, _this.time);
            }, this.period);
            // this.init();
        };

    _timeCount.prototype = {
        auto: function() {
            var _this = this;
            setTimeout(function() {
                _this.init();
                _this.callback && _this.callback(_this.dom, _this.time);
            }, 1000);

        }
        , ten: function(t) {
            if (t < 10) {
                t = '0' + t;
            };
            return t;
        }
        , init: function() {
            var _this = this
                , time = 0;
            if (_this.flag) {
                var l = 1;
            } else {
                var l = -1;
            }
            _this.i++;
            // 2019年7月23日16:12:29 由于倒计时的JS运行需要时间，毫秒级不可忽略，故round一下，补齐时差
            console.log('======', (_this.leftTime) / 1000)
            _this.time = time = Math.round((_this.leftTime) / 1000);
            _this.mtime = (_this.leftTime) / 100;

            var str, str1; //for format
            if (_this.lastTime != 0 && time >= _this.lastTime) {

            } else if (time > 0) {
                var day = _this.ten(Math.floor(time / (60 * 60 * 24)))
                    , hour = _this.ten(Math.floor(time / (60 * 60)) - day * 24)
                    , minute = _this.ten(Math.floor(time / 60) - (day * 60 * 24) - (hour * 60))
                    , second = _this.ten(Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60))
                    , msecond = parseInt(_this.mtime % 10);


                switch (_this.format) {
                    case 2: //ss
                        str = second;
                        str1 = "00";
                        break;
                    case 4: //mm:ss
                        str = minute + ":" + second;
                        str1 = "00:00";
                        break;
                    case 5: //mm:ss:ms
                        str = minute + ":" + second + ":" + msecond;
                        str1 = "00:00:0";
                        break;
                    default: //hh:mm:ss
                        str = _this.ten(24 * day + parseInt(hour)) + ":" + minute + ":" + second;
                        str1 = "00:00:00";
                        break;
                }
                var tArr = str.split(':')
                    , _html = '';
                tArr.map(function(item) {
                    _html += '<span>' + item + '</span>:'
                })
                _this.dom.show(200).find('.countDown').html(_html.substring(0, _html.length - 1));
                // _this.auto();
                _this.leftTime -= 1000;
            } else {
                switch (_this.format) {
                    case 2: //ss
                        str1 = "00";
                        break;
                    case 4: //mm:ss
                        str1 = "00:00";
                        break;
                    case 5: //mm:ss
                        str1 = "00:00:0";
                        break;
                    default: //hh:mm:ss
                        str1 = "00:00:00";
                        break;
                }
                // _this.dom.html(str1);
                var tArr = str1.split(':')
                    , _html = '';
                $.each(tArr, function(index, item) {
                    _html += '<span>' + item + '</span>:'
                })
                _this.dom.show().find('.countDown').html(_html.substring(0, _html.length - 1));
                window.clearInterval(this.interval);
            }
        }
    }
})(window, document);

var G = {
    opt: {
        basePath: (window.location.pathname.indexOf('/test') > -1 || window.location.host.indexOf('localhost:8080') > -1 || window.location.host.indexOf('10.10.30.166:8080') > -1) ? '/test' : ''
        , post_url: 'https://apim.bolue.cn'
        , static_url: 'https://mb.bolue.cn'
        , live_decode_arr : [['a', 'd', 'g', 'j', 'm', 'p', 's', 'v', 'y', 'b'], ['b', 'e', 'h', 'k', 'n', 'q', 't', 'w', 'z', 'c'], ['c', 'f', 'i', 'l', 'o', 'r', 'u', 'x', 'a', 'd']]
    },
    /**
     * [txt_num_evt 0/30 字符数限制效果事件]
     * @author: markwang
     * @version: 2017-01-02T11:16:53+0800
     * @modification list: 2017-01-02 新增 
                           2017-01-02 修改
                           2017-02-21 修改2为按字符数计算
                           2017-05-24 大改，面目全非
                           2017-05-25 加入登录提醒功能
                           2017-05-26 优化了blur触发逻辑：不需要登录提醒或者已登录的情况下触发
     * @return {[type]} [description]
     */
    txt_num_evt: function() {
        var _that = this;
        $('.txt_num_evt').not('[data-max]').each(function(index, el) {
            var _p = $(el)
                , obj = _p.find('input[type="text"],input[type="password"]')
                , error = _p.find('.error')
                , limit = ($(el).data('limit') + '').split(',');
            // data-limit为min,max,flag,'姓名' 格式：
            // 第一位为可输入最小字符数
            // 第二位为可输入最大字符数
            // 第三位为必填项flag：1必填
            // 第四位为msg数据框名字，用于msg为1时的拼接字符,
            // 第五位为msg内容，如果为
            // 1：请输入有效的xx
            // ''/undefined：不少于n个字符
            // 其他：直接用msg，支持字符串和G.msg.xxx调用
            // 第六位为登录提醒flag：只要传入任意字符，都要提醒
            // 如果只有一位，则为可输入最大字符数;
            !limit[1] && (limit = [0, limit]);
            obj.length == 0 && (obj = $(el).find('textarea'));
            _p.attr('data-max', limit[1]);
            // checkbrowser()[1] && checkbrowser()[1] <= 8 && _p.hasClass('evt_txt_num') && _p.removeClass('evt_txt_num').addClass('evt_txt_num');
            // .css('position',_p.css('position')); //用于显示 0/30效果

            // obj.on('keyup', function(e) {
            //     var length = Math.ceil(obj.val().ByteCount());
            //     // _that.for_txtNum_dis(length, error, limit, obj, _p);
            //     if (length > limit[1]) {
            //         obj.val(obj.val().subCHStr(0, limit[1]));
            //         _p.attr('data-str', limit[1]);
            //     } else {
            //         _p.attr('data-str', length);
            //     }
            //     // _p.addClass('txt_num_evt');
            // });
            obj.on('input', function(e) {
                var length = Math.ceil(obj.val().ByteCount());
                // _that.for_txtNum_dis(length, error, limit, obj, _p);
                if (length > limit[1]) {
                    obj.val(obj.val().subCHStr(0, limit[1]));
                    _p.attr('data-str', limit[1]);
                } else {
                    _p.attr('data-str', length);
                }
                // _p.addClass('txt_num_evt');

            });

        });
    },
    // tab切换效果
    for_tabs: function(callback) {
        $('.tabs').on('click', '.li', function() {
            var _t = $(this);
            _t.addClass('curr').siblings().removeClass('curr');
            _t.parent().parent().find('.page_list').find('.ul').eq(_t.index()).removeClass('hide').show().siblings('.ul').hide();
            "function" === typeof callback && callback(_t);

        });
        // "function" === typeof callback && callback(_t);
    },
    // object空判断 不能用于dom对象的判断
    IsEmpty: function(o) {
        if (o) {
            return (typeof(o) == "string") ? false : ((typeof(o) === "object") ? !this.ObjNotEmpty(o) : o);
        }
        return true;
    }
    , ObjNotEmpty: function(o) {
        if (typeof(o) === "object" && !(o instanceof Array)) {
            var hasP = false;
            for (var p in o) {
                hasP = true;
                break;
            }
            if (hasP) {
                return true;
            } else {
                return false;
            }
        } else if (o instanceof Array) {
            return o.length == 0 ? false : true;
        } else {
            return o;
        }
    },
    /**
     * 显示暂无数据
     * @author markwang
     * @version 2017-05-24T14:09:04+0800
     * @example no example
     * @modification list 2016-00-00 新增 
                           2017-05-24 增加了table的暂无数据处理，
                           支持thead表头，如果有，则在tbody内容区显示暂无数据；
                           调用G.show_noData($('.new_task .task_list'), 'table');
     * @param {obj} o 显示内容的对象
     * @param {int/string} type 显示不同类型的内容，对应G.no_data_msg[type]
     * @return {none}
     */
    show_noData: function(o, type) {
        var cont = '<img src="' + G.opt.static_url + G.opt.basePath + '/img/v2/icons/null@2x.png" alt="暂无相关数据" />';
        cont += '<p>暂无相关数据</p>'
        o.html("<div class='no_data'>" + cont + "</div>").fadeIn(400);
    },
    /**
     * 显示逻辑
     * @author markwang
     * @version 2019-03-07T11:21:06+0800
     * @example no example
     * @modification list 
     * @param data:数据源;tmpl:模板名;obj:对象;cleanObj:隐藏对象;showNoData:是否显示无数据
     * @param {Function} callback [description]
     * @param {[type]} flag 1:append 
     * @return {[type]}
     */
    show_data: function(data, tmpl, obj, cleanObj, showNoData, callback, flag) {
        var _that = this;
        showNoData = showNoData || ('object' !== typeof cleanObj && cleanObj)
        // cleanObj && obj.html('');
        if (!G.IsEmpty(data)) {
            // flag ? obj.append(tmpl.tmpl(data)).fadeIn(400): obj.html(tmpl.tmpl(data)).fadeIn(400);
            // 兼容初始化往隐藏dom写入数据，所以去掉fadeIn
            flag ? (obj.append(tmpl.tmpl(data)), obj.find('.no_data').hide()) : obj.html(tmpl.tmpl(data));
            callback && callback();
            /*var _o = obj.parent();
            _o.show();*/
        } else {
            cleanObj && cleanObj.hide();
            !!showNoData && _that.show_noData(obj, showNoData);
        }
    }
    , getCookie: function(e) {
        var t = new RegExp('(^| )' + e + '(?:=([^;]*))?(;|$)')
            , res = document.cookie.match(t);
        return res ? res[2] : '';
    },
    /**
     * 添加cookie
     * @author markwang
     * @version 2018-01-23T11:49:17+0800
     * @example G.cookie.set('u_token', 'ddddd1212', 0.5, 1)
     * @modification list 2018-01-23 新增
                           2018-01-23 修改
     * @param {string} a cookie名
     * @param {任意值} b cookie值
     * @param {int} c 过期时间，单位：天
     * @param {boolen} d 是否指定当前域名 1 ：所有子域名 0：当前域名
     * @param {boolen} e secure 0:false 1:true
     */
    setCookie: function(a, b, c, d, e) {
        var f = ""
            , g = ""
            , i = "";
        if (d) {
            var j = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i)
                , k = j ? j[0] : "";
            f = k ? "; domain=." + k : ""
        }
        if (c) {
            var l = new Date;
            l.setTime(l.getTime() + 24 * c * 60 * 60 * 1e3)
                , g = "; expires=" + l.toGMTString()
        }
        e && (i = "; secure");
        return (document.cookie = a + "=" + encodeURIComponent(b) + g + "; path=/" + f + i)
    },
    // 页面alert  5秒自动隐藏
    show_alert: function(con) {
        var obj = $('#alert');
        if ($('#liveAsk').is(':visible')) {
            obj.css({ 'top': 'auto', 'bottom': '30%' })
        } else {
            obj.css({ 'top': '50%', 'bottom': 'auto' })
        }
        obj.html(con).show()
        setTimeout(function() {
            obj.hide()
        }, 5000)

    }

};
G.live = {
    // 用户是否可以发言  1：是 0 否
    canSpeak: 1,
    // 用户是否可以提问  <=0：是；用于过快限制，30秒一次
    canSubmitTimes: 0,
    // 过快限制计时器
    InterValObj: null,
    /**
     * 权限校验，获取数据
     * @author markwang
     * @version 2019-03-13T10:34:24+0800
     * @example no example
     * @modification list 2019-03-13 新增 
                           2019-03-13 修改
     * @param {[type]} target {header,callback}
     * @return {[type]}
     */
    getData: function(target) {
        // 获取课程Id
        var pathname = window.location.pathname
            , n = pathname.lastIndexOf('/')
            , id = pathname.substr(n + 1);
        $('#resourceId').val(id);
        // 获取header请求信息
        var o = {};
        if (target.header && target.header.bolueclient) { //ios android
            o = target.header;
        } else { //wechat
            o.bolueclient = G.getCookie('bolueClient');
            o.boluever = G.getCookie('bolueVer');
            o.myauth = '{"openid":"' + G.getCookie('openid') + '", "code":"' + G.getCookie('code') + '"}';
        }
        // 权限校验，获取数据
        $.ajaxSetup({
            beforeSend: function(xhr, ajaxObj) {
                if (ajaxObj.url.indexOf('bolue.cn/') > -1) {
                    xhr.setRequestHeader('bolueClient', o.bolueclient);
                    xhr.setRequestHeader('bolueVer', o.boluever);
                    xhr.setRequestHeader('MyAuth', o.myauth);
                    xhr.setRequestHeader('Content-type', 'application/json');
                }
            }
        });
        $.ajax({
            type: 'POST'
            , url: G.opt.post_url + G.opt.basePath + '/v2/enterLiveRoom/' + id + '?random=' + Math.random()
            , success: function(data) {
                // if (data && data.resourceId && data.userId && data.roomId) {
                if (data && data.err) {
                    // alert(data.err || '当前直播无法播放，请退出并重新进入');
                    G.show_alert(data.err || '当前直播无法播放，请退出并重新进入')
                    TDAPP.onEvent('进入直播间', '出错信息', o);
                } else {
                    // 写入公告开课时间
                    $('#gonggao .cTime').text(data.result.cTime);
                    document.title = data.result.title;
                    $('#navG .tit').text(data.result.title);
                    /* var obj = {
                         'userNick': data.result.userNick,
                         'accountId': data.result.accountId,
                         'userPic': data.result.userPic,
                         'userId': data.result.userId,
                         'roomId': data.result.roomId,
                         'source': o.bolueclient == 'ios' ? 3000000000 : (o.bolueclient == 'android' ? 4000000000 : (o.bolueclient == 'wap' ? 2000000000 : 0)) //'wap' //来源
                     };*/
                    data.result['source'] = o.bolueclient == 'ios' ? 3000000000 : (o.bolueclient == 'android' ? 4000000000 : (o.bolueclient == 'wap' ? 2000000000 : 0));
                    target.callback && target.callback(data.result);
                    TDAPP.onEvent('观看直播', '信息', data.result);
                }
            }
            , error: function(err) {
                // alert('当前直播无法播放，请退出并重新进入');
                G.show_alert('当前直播无法播放，请退出并重新进入')
                TDAPP.onEvent('进入直播间', '出错信息', o);
            }

        })
    },
    /**
     * 保利威直播间
     * @author markwang
     * @version 2019-03-05T11:19:25+0800
     * @example o = {
                userNick:'⛅ഩᥠℜ⛕⚔',
                accountId:'18857',
                userPic:'http://localhost:8080/linkedfv4/resources/account/Icon/20170608/bf22b0bd704b409d84e544c5491bf8e6.jpg',
                userId: 'xxxxxxxx',
                roomId: '288480,
                resourceId:'689'
            }
     * @modification list 2019-03-05 新增 
                           2019-03-05 修改
     * @return {[type]}
     */
    newPlay: function(o) {
        var _that = this;
        // 调整右侧聊天区高度；8秒隐藏课程标题信息；10秒隐藏公告
        var setRH = function() {
            // 移动端直播大厅高度
            $('#chatParts .page_list').height($(window).height() - $('#player').height() - $('#chatParts .tabs').height() - ($('#navG').is(':visible') ? $('#navG').height() : 0));
        };
        setRH();
        $(window).on('resize', setRH);
        _that.showHideGG();
        // 关闭事件
        $(document).on('click', '.close', function(event) {
            $(this).parent().hide('slow');
            $('#mask').hide();
        });
        $('#liveAsk .close').on('touchstart', function() {
            var msgB = document.getElementById("pub_message_textarea");
            $(msgB).blur();
            $(msgB).parents('.live_ask').hide();
            $('#mask').hide();

        });
        if (o && o.userId && o.roomId) {
            var liveplayer = polyvObject('#player').livePlayer({
                'forceH5': true
                , 'banMultirate': true
                , 'width': '100%'
                , 'height': '100%'
                , 'uid': o.userId
                , 'vid': o.roomId
                , 'param1': parseInt(o.accountId) + o.source
            });
            $('#submitPubChat').on('touchstart', function() {
                G.live.submitPubChat(o);
            });
        } else {
            // alert('播放器加载失败，请联系铂略客服');
            G.show_alert('播放器加载失败，请联系铂略客服')
        }
        // 网页全屏事件绑定
        /*window.s2j_onWebFullScreenBtnCLick = function(status) {
            $('body').toggleClass('web-fullscreen');
        };*/
        // 建立通讯
        var supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        var chatHost = 'https://chat.polyv.net';

        try {
            socket = io.connect(chatHost, {
                query: 'token=' + o.accountId
                , transports: [supportsWebSockets ? 'websocket' : 'polling']
            });
            // 登录消息，登录房间的时候服务器会广播这一消息
            socket.emit('message', JSON.stringify({
                EVENT: 'LOGIN',
                // values: [userNick, userPic, userId], //登录用户信息，不可为空
                values: [o.userNick, o.userPic, o.accountId], //登录用户信息，不可为空
                roomId: o.roomId, //当前房间号
                type: 'student', //用户类型，可为空,teacher（教师）、assistant（助教）、manager（管理员）、student
            }));
        } catch (e) {
            // alert('请检查您的网络并重试');
            G.show_alert('请检查您的网络并重试')
        }
        $('#forChat').click(function() {
            $('#liveAsk,#mask').show();
            $('#pub_message_textarea').focus()

        });

        // 加载聊天和我的互动数据
        try {
            $.get('//apichat.polyv.net/front/history', { roomId: o.roomId, start: 0, end: -1, hide: 0 }, function(d) {
                // debugger
                // 用于初次写入聊天内容，最新的在最下面
                _that.showSPEAK(d);
                /*var n = d.length || 0;
                if (d && n > 0) {
                    while (n > 0) {
                        n--;
                    }
                }*/
            });
            $.get('//apichat.polyv.net/front/getQuestionContent', { roomId: o.roomId, start: 0, end: -1 }, function(d) {
                _that.showQA(d);
            });
        } catch (e) {}
        try {
            //监听所有消息
            socket.on("message", function(event) {
                console.dir(event);
                var mData = JSON.parse(event);
                if (mData && mData.EVENT) {
                    switch (mData.EVENT) {
                        case 'BULLETIN':
                            _that.showBULLETIN(mData.content);
                            break; // 显示最新公告
                        case 'LOGIN' || 'LOGOUT':
                            // _that.showLOGIN(mData.onlineUserNumber);
                            break; // 改登录人数
                        case 'SPEAK':
                            _that.showSPEAK([mData], 1); //说明:发言,接收别人的发言消息(不包括自己)
                            mData.user && _that.showTips(0);
                            break;
                        case 'REMOVE_CONTENT':
                            _that.fireREMOVE_CONTENT(mData); //说明:删除某条聊天记录，目前需要通过HTTP接口调用
                            _that.showTips(0);
                            break;
                        case 'S_QUESTION':
                            _that.showQA([mData], 1); //说明：学生提问内容
                            break;
                        case 'T_ANSWER':
                            _that.showQA([mData], 1); //说明：老师/管理员/助教回复提问
                            break;
                        case 'BANIP':
                            _that.canSpeak = 0; //说明：用户被禁言
                            // alert('您已被禁言');
                            G.show_alert('您已被禁言')
                            break;
                        case 'UNSHIELD':
                            _that.canSpeak = 1; //说明：取消禁言
                            // alert('您已被取消禁言，可正常互动');
                            G.show_alert('您已被取消禁言，可正常互动')
                            break;
                        case 'REMOVE_HISTORY': //说明：清空聊天室聊天区
                            $('#publicChat').html('');
                            // alert('讲师刚刚打扫了直播大厅');
                            G.show_alert('讲师刚刚打扫了直播大厅')
                            break;
                        case 'SIGN_IN': //说明：开始签到事件，用于评分功能
                            $('#LiveComment,#mask').show();
                            // alert('请大家对本次课程进行评分');
                            break;
                    }
                }
            });
        } catch (e) {
            // alert('检测到您的通讯不稳定，请联系铂略客服');
            G.show_alert('检测到您的通讯不稳定，请联系铂略客服')
        }
        // 评分
        $('#LiveComment .pingjia').on('click', '.star', function(event) {
            event.preventDefault();
            var _t = $(this)
            _p = _t.parent('.pingjia');
            var str = 'https://mb.bolue.cn/test/img/v2/icons/'
                , starOff = 'Star_full.png'
                , starOn = 'Star_null.png';
            // _t.toggleClass('full');
            var n = _t.index();
            _p.find('.star:lt(' + (n + 1) + ')').addClass('full').removeClass('null');
            _p.find('.star:gt(' + (n) + ')').removeClass('full').addClass('null');
            $('#pingfenC').text(_p.find('.full').length);
        })
    }
    , canSub: 1, //是否可以提交评分
    // 提交评分
    add_mark: function(dom) {
        var _that = this
            , _this = $(dom)
            , _parents = _this.parents('.main_c');
        var resourceId = $('#resourceId').val();
        var star = $("#pingfenC");
        var content = _parents.find(".miaoshu");
        if (_that.canSub) {
            if (star.text() == "0") {
                G.show_alert('请先打分');
                return;
            }
            _that.canSub = 0;
            $.post(G.opt.post_url + G.opt.basePath + '/v2/addComment', JSON.stringify({
                'resourceId': resourceId
                , 'star': star.text()
                , 'resourceType': 1
                , 'content': content.val()
                , 'label': null
            }), function(d) {
                _that.canSub = 1;
                if (d.result) {
                    content.val("");
                    $('#LiveComment,#mask').hide();
                    TDAPP.onEvent('直播间评分数据', '直播课Id：' + resourceId, { 'accountId': $('#accountId').val(), 'star': star.text(), 'content': content.val() });
                    // alert('我们已经收到您的评价，谢谢');
                    G.show_alert('我们已经收到您的评价，谢谢')
                } else {
                    TDAPP.onEvent('直播间评分数据', '评分出错：', { 'resourceId': resourceId, 'accountId': $('#accountId').val(), 'star': star.text(), 'content': d.err });
                    // alert(d.err);
                    G.show_alert(d.err)
                }
            });
        } else {
            // alert('正在提交，请稍候')
            G.show_alert('正在提交，请稍候')
        }
    },
    // 显示我的互动
    showQA: function(d, flag) {
        var _that = this
            , n = d.length || 0
            , me = $('#accountId').val()
            , arr = [];
        // debugger
        // 用于初次写入聊天内容，最新的在最下面
        if (d && n > 0) {
            n = 0;
            while (n < d.length) {
                var dd = d[n]
                    , user = dd.user;
                dd['cls'] = 'right';
                if (!dd.time) {
                    dd['time'] = new Date();
                }
                if (dd.s_userId && dd.s_userId == me) { //一定是回复
                    // 显示讲师回答
                    dd['cls'] = 'left';
                    user.nick = '讲师';
                    arr.push(dd);
                    _that.showTips(1);
                } else if (user.userId == me) {
                    // 显示我提过的问题
                    user.nick = '我';
                    arr.push(dd);
                }
                n++;
            }
        }
        var parent = $('#myQA');
        G.show_data(arr, $('#myQA_tmpl'), parent, null, null, null, flag);
        parent[0].scrollTop = parent[0].scrollHeight;
    },
    // 格式化时间
    fmt_time: function(t) {
        return t ? new Date(t).format('hh:mm:ss') : new Date().format('hh:mm:ss');
    },
    //说明:删除某条聊天记录，目前需要通过HTTP接口调用
    fireREMOVE_CONTENT: function(s) {
        if (s.id) {
            $('#publicChat').find('li[id=' + s.id + ']').html('<div class="rollback">讲师&nbsp;撤回了一条互动</div>');
        }
    },
    // 改登录人数
    showLOGIN: function(s) {
        $('#uCounts').text(s)
        TDAPP.onEvent('直播人数变化', s);
    },
    // 显示最新公告
    showBULLETIN: function(s) {
        var _that = this;
        $('.p_live .gonggao .cont').text(s)
        // setTimeout(function() { $('#gonggao').show('slow') }, 2000);
        _that.showHideGG();
    },
    /**
     * 说明:发言,接收别人的发言消息(不包括自己)
     * @author markwang
     * @version 2019-03-05T16:12:17+0800
     * @example no example
     * @modification list 2019-03-05 新增 
                           2019-03-05 修改
     * @param {[type]} mData 数据
     * @param {[type]} flag 1：prepend 
     * @return {[type]}
     */
    showSPEAK: function(d, flag) {
        var n = d.length || 0
            , me = $('#accountId').val()
            , arr = [];
        // debugger
        // 用于初次写入聊天内容，最新的在最下面
        if (d && n > 0) {
            while (n > 0) {
                n--;
                var dd = d[n]
                    , user = dd.user || {};
                if (user.userType) {
                    dd['flag'] = '1'; // 1:问题 0：回答
                    if (!dd.time) {
                        dd['time'] = new Date();
                    }
                    if (user.userType != 'student') {
                        user.nick = '公开回答';
                        // 老师的公聊==公开回复
                        dd['flag'] = '0';
                        user.nick = '讲师';
                        arr.push(dd);
                    } else {
                        // 学员公聊
                        if (user.userId == me) {
                            user.nick = '【我】';
                        }
                        arr.push(dd);
                    }
                }
            }
        }
        var parent = $('#publicChat');
        G.show_data(arr, $('#publicChat_tmpl'), parent, null, null, null, flag);
        parent[0].scrollTop = parent[0].scrollHeight;
    },
    // 截取用户昵称 分隔符"——"
    clearName: function(str) {
        return str ? str.split('——')[0].subCHStr(0, 16) : '';
    },
    /**
     * 公聊/提问事件
     * @author markwang
     * @version 2019-03-07T15:58:45+0800
     * @example no example
     * @modification list 2019-03-07 新增 
                           2019-03-07 修改 _that.canSpeak
     * @param {[type]} o [description]
     * @return {[type]}
     */
    submitPubChat: function(o) {
        var _that = this;
        if (_that.canSpeak) {
            var msgB = document.getElementById("pub_message_textarea")
                , msg = msgB.value;
            if (G.IsEmpty(msg)) {
                // alert('输入内容不能为空');
                G.show_alert('输入内容不能为空')
                // document.getElementById("pub_message_textarea").focus();
                return;
            }
            try {
                if (_that.canSubmitTimes <= 0) {
                    // 发聊天通道
                    socket.emit('message', JSON.stringify({
                        EVENT: 'SPEAK'
                        , values: [msg], //发言内容
                        roomId: o.roomId //当前房间号
                    }));
                    // 发提问通道 说明：学生提问内容
                    socket.emit('message', JSON.stringify({
                        EVENT: 'S_QUESTION'
                        , roomId: o.roomId
                        , user: {
                            nick: o.userNick
                            , pic: o.userPic
                            , userId: o.accountId
                            , userType: 'student'
                        }
                        , content: msg
                    }), function() {
                        // alert('您的问题已经提交成功，请耐心等待回复');
                        G.show_alert('您的问题已经提交成功，请耐心等待回复')
                        TDAPP.onEvent('直播间互动数据', '直播课Id：' + $('#resourceId').val(), { 'nick': o.userNick, 'accountId': o.accountId, 'content': msg });
                    });
                    // 发完之后清空输入框，置空输入字数，并且写入我的提问（这部分由case 'SPEAK':托管）;
                    // 还要定时30s
                    msgB.value = "";
                    $(msgB).parent('.live_ques').attr('data-str', 0);
                    $(msgB).blur();
                    $('#mask').hide();
                    $(msgB).parents('.live_ask').hide();
                    _that.canSubmitTimes = 30;
                    _that.InterValObj = window.setInterval(function() {
                        if (_that.canSubmitTimes > 0) {
                            _that.canSubmitTimes--;
                        } else {
                            window.clearInterval(_that.InterValObj);
                        }
                    }, 1000); //启动计时器，1秒执行一次 

                } else {
                    // alert('您的发言过快，请稍候重试');
                    G.show_alert('您的发言过快，请稍候重试')
                }
            } catch (e) {}
        } else {
            // alert('您已被禁言');
            G.show_alert('您已被禁言')
        }
    },
    // 控制公告的显示与否
    showHideGG: function() {
        $('#gonggao,#mask').show('fast');
        setTimeout(function() { $('#gonggao').is(':visible') && $('#gonggao,#mask').hide('slow') }, 10000);
    },
    // 有消息显示红点 type 0直播大厅  1我的互动
    showTips: function(type) {
        var obj = $('#chatParts .tabs');
        obj.children('.curr').index() != type && (obj.children('.li').eq(type).addClass('redTips'));
    }
    , phoneValid: function(phone) {
        return typeof('') === typeof(phone) ? /^1[0-9]{10}$/.test(phone) : !!0;
    }
};

//截取字符串（从start字节到end字节）
String.prototype.strToCharsCH = function() {
    for (var a = new Array, b = 0; b < this.length; b++) a[b] = [this.substr(b, 1), this.isCHS(b)];
    return String.prototype.charsArray = a, a
};
String.prototype.isCHS = function(a) {
    return this.charCodeAt(a) > 255 || this.charCodeAt(a) < 0 ? !0 : !1
};
String.prototype.subCHString = function(a, b) {
    var c = 0
        , d = "";
    this.strToCharsCH();
    for (var e = 0; e < this.length; e++) {
        if (this.charsArray[e][1] ? c += 2 : c++, c > b) return d;
        c > a && (d += this.charsArray[e][0])
    }
    return d
};
String.prototype.subCHStr = function(a, b) {
    return this.subCHString(a, a + b)
};
String.prototype.ByteCount = function() {
    var d = 0;
    this.strToCharsCH();
    for (var e = 0; e < this.length; e++) {
        this.charsArray[e][1] ? d += 2 : d++;
    }
    return d;
};
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds()
        //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

G.live_invite = {
    opt: {
        bolueclient: 'wap'
        , boluever: '2.4.50'
        , myauth: '{"openid":"' + G.getCookie('openid') + '", "code":"' + G.getCookie('code') + '"}'
    , }
    , checkValid: function() {}
    , init: function(header) {
        var _that = this;
        G.setCookie('bolueClient',_that.opt.bolueclient);
        G.setCookie('bolueVer',_that.opt.boluever);
        _that.getData(header);
        // 多账号登录绑定事件
        $('#accountList').on('click', '.li', function(event) {
            var _t = $(this);
            _t.addClass('curr').siblings('.li').removeClass('curr');
        }).on('click', '.sure button', function(event) {
            _that.liveLogin($(this).parents('.account_list').find('.li.curr').attr('data-uuid'))
        })
        // 输入框focus事件
        $('.input_li .ipt_box input[type="text"]').on('focus', function() {
            var _t = $(this)
            if (_t.parents('.live_login').hasClass('can_submit')) {
                _t.parents('.input_li').addClass('focus');
            }
        }).on('blur', function() {
            var _t = $(this)
            if (_t.parents('.live_login').hasClass('can_submit')) {
                _t.parents('.input_li').removeClass('focus');
            }
        })
        // 发送验证码
        $('.input_li .ipt_box .get_phone_code').on('click', '', function() {
            var _t = $(this);
            if (_t.parents('.live_login').hasClass('can_submit')) {
                if (!_t.hasClass('disabled')) {
                    sendSmsCode(0)
                }
            }
        })
        // 进入直播间
        $('.live_login .operate').on('click', function() {
            var _t = $(this)
            if (_t.parents('.live_login').hasClass('can_submit')) {
                G.live_invite.liveLogin();
            } else {
                G.show_alert('请输入正确的信息')
            }
        })
    }
    , getData: function(header) {
        // 获取课程Id
        var pathname = window.location.pathname
            , n = pathname.lastIndexOf('/')
            , idstr = pathname.substr(n + 1)
            , id = G.live_invite.decryptoGraph(idstr);
        $('#resourceId').val(id);
        // 获取header请求信息
        var o = {};
        if (header && header.bolueclient) { //ios android
            o = target.header;
        } else { //wechat
            // o.bolueclient = G.getCookie('bolueClient');
            o.bolueclient = this.opt.bolueclient;
            o.boluever = this.opt.boluever;
            o.myauth = this.opt.myauth;
        }
        // 权限校验，获取数据
        $.ajaxSetup({
            beforeSend: function(xhr, ajaxObj) {
                if (ajaxObj.url.indexOf('bolue.cn/') > -1) {
                    xhr.setRequestHeader('bolueClient', o.bolueclient);
                    xhr.setRequestHeader('bolueVer', o.boluever);
                    xhr.setRequestHeader('MyAuth', o.myauth);
                    xhr.setRequestHeader('Content-type', 'application/json');
                }
            }
        });
        $.ajax({
            type: 'GET'
            , url: G.opt.post_url + G.opt.basePath + '/v2/inviteLiveDetail/' + id + '?random=' + Math.random()
            , success: function(data, status, xhr) {
                if (data && data.err) {
                    // alert(data.err || '当前直播无法播放，请退出并重新进入');
                    G.show_alert(data.err || '当前直播课已下架')
                } else {
                    var _result = data.result;
                    // title
                    $('.live_tit').text(_result.title);
                    document.title = '铂略直播体验-' + _result.title;
                    // time
                    var _liveDate = new Date(_result.start_time).format("yyyy-MM-dd")
                    var _time = new Date(_result.start_time).format("hh:mm") + '-' + new Date(_result.end_time).format("hh:mm")
                    $('#live_time').text(_liveDate + ' ' + _time)
                    // status
                    if (_result.status == 1) { //进入直播
                        $('.live_login').addClass('can_submit');
                    } else {
                        $('.live_login').removeClass('can_submit');
                        if (_result.status == 2) {
                            $('.live_login .operate span').text('本次直播已结束')
                        } else {
                            if (_result.leftTime) {
                                if (_result.leftTime > 30 * 60 * 1000) {
                                    $('.login_tips .open_time').show()
                                    $('.countDownBox').hide()
                                } else {
                                    timeCount({
                                        dom: $('.countDownBox')
                                        , leftTime: _result.leftTime - 15 * 60 * 1000
                                        , flag: 0
                                        , lastTime: 15
                                        , period: 1000
                                        , format: 4
                                        , callback: function(dom, cur_time) {
                                            cur_time <= 1 && cur_time >= 0 && window.location.reload();
                                        }
                                    })
                                }

                            }
                        }
                    }

                    window.share_config = {
                        title: _result.title,
                        desc: _result.brief,
                        link: document.location.href + '',
                        imgUrl: _result.brief_image,
                        type: 'link',
                        success: function () {
                            
                        },
                    };
                }
            }
            , error: function(err) {
                // alert('当前直播无法播放，请退出并重新进入');
                G.show_alert('当前直播无法播放，请退出并重新进入')
            }
        })
    }
    , liveLogin: function(uuid) {
        var _that = this;
        var phone = $('.input_li .ipt_box.phone input').val()
        var verifyCode = $('.input_li .ipt_box.input_short input').val()
        var pathname = window.location.pathname
            , n = pathname.lastIndexOf('/')
            , idstr = pathname.substr(n + 1)
            , id = G.live_invite.decryptoGraph(idstr);
        if (G.live.phoneValid(phone)) {
            $.ajax({
                url: G.opt.post_url + G.opt.basePath + '/v2/inviteLiveLogin/?random=' + Math.random()
                , type: 'POST'
                , headers: {
                    'Accept': 'application/json'
                    , 'Content-Type': 'application/json'
                }
                , data: JSON.stringify({
                    userName: phone
                    , verifyCode: verifyCode
                    , uuid: uuid
                    , liveId: id
                })
                , success: function(data) {
                    // 相关接口说明详见 http://10.10.1.181/zentaopms/www/index.php?m=task&f=view&task=1085
                    console.log(data)
                    if (data && data.err) {
                        G.show_alert(data.err)
                        return false
                    }
                    var res = data.result;
                    $('#accountList').hide();
                    if (res.needBind) {
                        // 无账号的情况:
                        // result.needBind -- 固定为true，表示暂无账号
                        var _tar = $('#alertTips');
                        _tar.find('.operate .btn').attr('href', window.location.origin + '/lesson/live/' + id);
                        _tar.show();
                        var i = 5;
                        setInterval(function() {
                            i--;
                            if (i == 0) {
                                window.location.href = window.location.origin + '/lesson/live/' + id;
                            }
                            _tar.find('.time').text(i);
                        }, 1000)
                        $('#mask').show();
                    } else if (res.length > 0) {
                        // 正常(多账号) 
                        G.show_data(res, $('#accountList_tmpl'), $('#accountList .list'), null, null, null);
                        $('#accountList').show();
                    } else if (data.user.isLogined) {
                        localStorage.setItem("credentials.code", res.code);
                        localStorage.setItem("credentials.openid", res.openid);
                        localStorage.setItem("bolueClient", _that.opt.bolueclient);
                        localStorage.setItem("boluever", _that.opt.boluever);
                        G.setCookie('openid',res.openid)
                        G.setCookie('code',res.code);
                        var _url = window.location.pathname.indexOf('/test/') == 0 ? '/test' : '';
                        // 正常(登录完成)
                        if (res.authority) {
                            //  是否有直播课权限
                            window.location.href = window.location.origin + _url + '/livePlay/' + id;
                        }else {
                            window.location.href = window.location.origin + _url + '/lesson/live/' + id;
                        }

                    } else {
                        // 异常 -- {"err":"课程已结束","user":null,"result":null}
                        G.show_alert('本次直播已结束');
                    }
                }
                , error: function(err) {
                    G.show_alert('网络实在不给力，请再来一次')
                }

            })
        } else {
            G.show_alert('请输入正确的手机格式')
        }
    }
    , decryptoGraph: function(str) {
        var decodeArr = G.opt.live_decode_arr[0],
            resultArr = [];
        if(str.length < 2) return 0;
        for(i=0;i<str.length;i++){
            if(i == 0) {
                if(!/[0-2]/.test(str.charAt(i))) {
                    resultArr.push(0);
                    return 0;
                }
                decodeArr = G.opt.live_decode_arr[str.charAt(i)]
            }else {
                if(decodeArr.indexOf(str.charAt(i)) > -1) {
                    resultArr.push(decodeArr.indexOf(str.charAt(i)))
                }else {
                    return 0;
                }
            }
        }
        if(resultArr.length == str.length-1) {
            return parseInt(resultArr.join(''))

        }else {
            return 0;
        }
    }
}