import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import {
  Link
} from 'react-router-dom';
import Dm from '../util/DmURL';
import funcs from '../util/funcs'

var timer;

class PgRemittance extends React.Component {
  constructor(props) {
    super(props);
    this.wx_config_share_home = {
      title: '决战汇算清缴季',
      desc: '铂略2018汇算清缴专题课程包重磅登录',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/activity/remi_share.jpg'),
      type: 'link'
    }
    this.state = {
      name: '',
      company: '',
      telephone: '',
      isShow: false,
      success: false,
      title: 'PgHome',
      top: 0,
      height: 0,
    }
  }
  componentDidMount() {
    var phoneWidth =  parseInt(window.screen.width);//屏幕宽度
    var phoneHeight = parseInt(window.screen.height);//屏幕高度

    //根据不同机型做适配
    global.scalePage = function(tmpScale){
      var phoneScale = tmpScale;//网页根据手机分辨率缩放的比例系数
      var ua = navigator.userAgent;
      var oMeta = document.getElementsByTagName('meta')[1];//meta标签中第二个
      if (/Android (\d+\.\d+)/.test(ua)){
          var version = parseFloat(RegExp.$1);
          if(version>2.3){
            console.log('111');
            oMeta.content = 'width=750, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi,user-scalable=no';
          }else{
            oMeta.content = 'width=750, target-densitydpi=device-dpi,user-scalable=no';
          }
      } else {
        oMeta.content = 'width=750,minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', user-scalable=no, target-densitydpi=device-dpi,user-scalable=no';
      }
    }
    //初始化时适配页面
    scalePage(phoneWidth/750);
    //手机转屏
    window.addEventListener("orientationchange", function(event) {
     // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
     var tmpScale;
     if(window.orientation==180||window.orientation==0){//竖屏状态
       //竖屏页面缩放比例系数
        tmpScale = phoneWidth/750;
     }
     if(window.orientation==90||window.orientation==-90){//横屏状态
       //横屏页面缩放比例系数
       tmpScale = phoneHeight/750;
     }
     scalePage(tmpScale);
    }, false);

    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
    EventCenter.emit("SET_TITLE", '决战汇算清缴季');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    this._getSpecialDone.remove()
    window.removeEventListener("orientationchange", false)//解除绑定
  }

  //跳转到首页
  _goHomePage() {
    //this.props.history.push({pathname: `${__rootDir}/PgHomeIndex`})
    window.location = "https://mb.bolue.cn";
  }

  //返回顶部
  _goBack() {
    // window.scrollTo(0,0);
    this.currentPage.scrollTop = 0;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0
  }
  //在线咨询
  _goLink() {
    if (isWeiXin) {
      this.props.history.push({
        pathname: `${__rootDir}/freeInvited`
      })
    } else {
      window.location.href = 'https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

  _propAlert(re) {
    window.location = "https://mb.bolue.cn";
  }

  render() {
    var tel_link = 'tel://400-616-3899';
    // var percentage = window.screen.width/750;
    //minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+'
    return (
      <div style = {{ ...styles.container,}}
        ref = {
          (currentPage) => this.currentPage = currentPage
        } >
        <div style = {{width: '100%',height: 416}} >
        <img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_banner.jpg`)
        }
        style = {
          {
            width: '100%',
            height: 416
          }
        }
        />
        </div >
        <div style = {
          {
            width: '100%',
            height: 709,
            backgroundColor: '#fff',
            overflow: 'hidden'
          }
        } >
        <
        div style = {
          {
            paddingTop: 55,
            paddingLeft: 92,
            overflow: 'hidden'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon1.jpg`)
        }
        style = {
          {
            width: 102,
            height: 102,
            float: 'left'
          }
        }
        /> <
        div style = {
          {
            paddingLeft: 36,
            float: 'left',
            fontSize: 32,
            color: '#24427b'
          }
        } >
        <
        div > 智能征管携手“ 双打” 风暴 < /div> <
        div style = {
          {
            fontWeight: 'bold'
          }
        } > 凶猛来袭 < /div> < /
        div > <
        /div> <
        div style = {
          {
            paddingTop: 55,
            paddingLeft: 92,
            overflow: 'hidden'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon2.jpg`)
        }
        style = {
          {
            width: 102,
            height: 102,
            float: 'left'
          }
        }
        /> <
        div style = {
          {
            paddingLeft: 36,
            float: 'left',
            fontSize: 32,
            color: '#24427b'
          }
        } >
        <
        div > 企业申报自主权与风险指数 < /div> <
        div style = {
          {
            fontWeight: 'bold'
          }
        } > 同步上升 < /div> < /
        div > <
        /div> <
        div style = {
          {
            paddingTop: 55,
            paddingLeft: 92,
            overflow: 'hidden'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon3.jpg`)
        }
        style = {
          {
            width: 102,
            height: 102,
            float: 'left'
          }
        }
        /> <
        div style = {
          {
            paddingLeft: 36,
            float: 'left',
            fontSize: 32,
            color: '#24427b'
          }
        } >
        <
        div > “金三” 稽查数额已超500亿 < /div> <
        div style = {
          {
            fontWeight: 'bold'
          }
        } > 无所遁形 < /div> < /
        div > <
        /div> <
        div style = {
          {
            paddingTop: 55,
            paddingLeft: 92,
            overflow: 'hidden'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon4.jpg`)
        }
        style = {
          {
            width: 102,
            height: 102,
            float: 'left'
          }
        }
        /> <
        div style = {
          {
            paddingLeft: 36,
            float: 'left',
            fontSize: 32,
            color: '#24427b'
          }
        } >
        <
        div > 新年度企业财务总结汇算清缴 < /div> <
        div style = {
          {
            fontWeight: 'bold'
          }
        } > 何去何从 < /div> < /
        div > <
        /div> < /
        div > <
        div style = {
          {
            width: '100%',
            height: 224,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/remit_bg1.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }
        } >
        <
        div style = {
          {
            width: '100%',
            fontWeight: 'bold',
            fontSize: 22,
            paddingTop: 124,
            color: '#595857',
            textAlign: 'center'
          }
        } >
        助力平稳渡过2017年度税收总结， 安心迎接2018全新税务工作 <
        /div> < /
        div > <
        div style = {
          {
            width: '100%',
            height: 351,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/remit_bg2.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            position: 'relative'
          }
        } >
        <
        div style = {
          {
            fontSize: 22,
            color: '#fff',
            position: 'absolute',
            zIndex: 2,
            top: 60,
            left: 124
          }
        } > “金税三期” 下这些 < br / > < span style = {
          {
            color: '#f4cf3d'
          }
        } > 税务风险 < /span>不能忽略 < /
        div > <
        div style = {
          {
            fontSize: 22,
            color: '#fff',
            position: 'absolute',
            zIndex: 2,
            top: 60,
            right: 80
          }
        } >
        2017 年企业必须了解的 < br / > < span style = {
          {
            color: '#f4cf3d'
          }
        } > 所得税新政 < /span> < /
        div > <
        div style = {
          {
            fontSize: 22,
            color: '#fff',
            position: 'absolute',
            zIndex: 2,
            bottom: 115,
            left: 58,
          }
        } >
        2017 汇算清缴的 < br / > < span style = {
          {
            color: '#f4cf3d'
          }
        } > 福利和优惠 < /span>不要错过 < /
        div > <
        div style = {
          {
            fontSize: 22,
            color: '#fff',
            position: 'absolute',
            zIndex: 2,
            bottom: 115,
            right: 38,
          }
        } > “双打” 下企业不得不知的 < br / > 那些 < span style = {
          {
            color: '#f4cf3d'
          }
        } > 雷区 < /span> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            height: 300,
            paddingTop: 60,
            backgroundColor: '#fff'
          }
        } >
        <
        div style = {
          {
            width: '100%',
            height: 56,
            lineHeight: '56px',
            fontSize: 30,
            color: '#fff',
            fontWeight: 'bold',
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/titile_bg2.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            textAlign: 'center',
          }
        } >
        汇算清缴专题课程包 <
        /div> <
        div style = {
          {
            padding: '50px 0 0 25px',
            height: 230
          }
        } >
        <
        div style = {
          {
            width: 236,
            height: 129,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg1.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'left'
          }
        } >
        <
        div style = {
          {
            width: 127,
            paddingTop: 26,
            textAlign: 'center',
            fontSize: 20,
            color: '#3a3a39',
            float: 'left'
          }
        } >
        <
        div > 线上视频 < /div> <
        div style = {
          {
            color: '#f4cf3d',
            height: 20,
            lineHeight: '20px'
          }
        } > + < /div> <
        div > 线下课程 < /div> < /
        div > <
        div style = {
          {
            float: 'left',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#24427b',
            paddingTop: 45
          }
        } >
        双管齐下 <
        /div> < /
        div > <
        div style = {
          {
            width: 236,
            height: 129,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg1.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'left'
          }
        } >
        <
        div style = {
          {
            width: 127,
            paddingTop: 26,
            textAlign: 'center',
            fontSize: 20,
            color: '#3a3a39',
            float: 'left'
          }
        } >
        <
        div > 资深名师 < /div> <
        div style = {
          {
            color: '#f4cf3d',
            height: 20,
            lineHeight: '20px'
          }
        } > + < /div> <
        div > 税务专家 < /div> < /
        div > <
        div style = {
          {
            float: 'left',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#24427b',
            paddingTop: 45
          }
        } >
        指点迷津 <
        /div> < /
        div > <
        div style = {
          {
            width: 236,
            height: 129,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg1.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'left'
          }
        } >
        <
        div style = {
          {
            width: 127,
            paddingTop: 26,
            textAlign: 'center',
            fontSize: 20,
            color: '#3a3a39',
            float: 'left'
          }
        } >
        <
        div > 课程学习 < /div> <
        div style = {
          {
            color: '#f4cf3d',
            height: 20,
            lineHeight: '20px'
          }
        } > + < /div> <
        div > 答疑跟踪 < /div> < /
        div > <
        div style = {
          {
            float: 'left',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#24427b',
            paddingTop: 45
          }
        } >
        永不掉线 <
        /div> < /
        div > <
        /div> < /
        div > <
        div style = {
          {
            width: '100%',
            height: 672,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/remit_bg3.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }
        } >
        <
        div style = {
          {
            fontSize: 30,
            color: '#f4cf3d',
            fontWeight: 'bold',
            width: '100%',
            height: 88,
            lineHeight: '88px',
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg.png`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            textAlign: 'center'
          }
        } > 线下课程收益 < /div> <
        div style = {
          {
            padding: '0 25px',
            overflow: 'hidden'
          }
        } >
        <
        div style = {
          {
            width: 342,
            height: 270,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg2.png`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'left',
            textAlign: 'center',
            fontSize: 24,
            color: '#fff'
          }
        } >
        <
        div style = {
          {
            paddingTop: 15
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon5.png`)
        }
        style = {
          {
            width: 80,
            height: 96,
          }
        }
        /> < /
        div > <
        div style = {
          {
            fontWeight: 'bold',
            paddingTop: 10
          }
        } > 【政策拆解】 < /div> <
        div style = {
          {
            paddingTop: 10
          }
        } > 官方解读重要税收政策 < /div> <
        div > 明晰未来税收征管方向 < /div> < /
        div > <
        div style = {
          {
            width: 342,
            height: 270,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg2.png`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'right',
            textAlign: 'center',
            fontSize: 24,
            color: '#fff'
          }
        } >
        <
        div style = {
          {
            paddingTop: 15
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon6.png`)
        }
        style = {
          {
            width: 80,
            height: 96,
          }
        }
        /> < /
        div > <
        div style = {
          {
            fontWeight: 'bold',
            paddingTop: 10
          }
        } > 【规划指导】 < /div> <
        div style = {
          {
            paddingTop: 10
          }
        } > 了解最新税务稽查侧重 < /div> <
        div > 提前调整筹划规避风险 < /div> < /
        div > <
        div style = {
          {
            width: 342,
            height: 270,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg2.png`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'left',
            textAlign: 'center',
            fontSize: 24,
            color: '#fff',
            marginTop: 15
          }
        } >
        <
        div style = {
          {
            paddingTop: 15
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon7.png`)
        }
        style = {
          {
            width: 80,
            height: 96,
          }
        }
        /> < /
        div > <
        div style = {
          {
            fontWeight: 'bold',
            paddingTop: 10
          }
        } > 【实操演练】 < /div> <
        div style = {
          {
            paddingTop: 10
          }
        } > 结合稽查企业实际案例 < /div> <
        div > 现场分析做好应对方案 < /div> < /
        div > <
        div style = {
          {
            width: 342,
            height: 270,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/content_bg2.png`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            float: 'right',
            textAlign: 'center',
            fontSize: 24,
            color: '#fff',
            marginTop: 15
          }
        } >
        <
        div style = {
          {
            paddingTop: 15
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_icon8.png`)
        }
        style = {
          {
            width: 80,
            height: 96,
          }
        }
        /> < /
        div > <
        div style = {
          {
            fontWeight: 'bold',
            paddingTop: 10
          }
        } > 【系统学习】 < /div> <
        div style = {
          {
            paddingTop: 10
          }
        } > 紧扣汇缴全阶段， 由浅至深 < /div> <
        div > 全面掌握知识体系 < /div> < /
        div > <
        /div> < /
        div > <
        div style = {
          {
            width: '100%',
            backgroundColor: '#22427b',
            paddingBottom: 17,
          }
        } >
        <
        div style = {
          {
            width: '100%',
            height: 186,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/remit_bg4.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            textAlign: 'center'
          }
        } >
        <
        div style = {
          {
            fontSize: 30,
            color: '#f4cf3d',
            fontWeight: 'bold',
            width: '100%',
            height: 88,
            lineHeight: '88px',
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg.png`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            textAlign: 'center'
          }
        } > 线上课程收益 < /div> <
        div style = {
          {
            fontSize: 24,
            color: '#fff',
            fontWeight: 'bold'
          }
        } > 37 学时， 按需学习 < /div> <
        div style = {
          {
            fontSize: 24,
            color: '#fff',
            fontWeight: 'bold'
          }
        } > 财务小白也能掌握的汇算清缴技能包 < /div> < /
        div > <
        div style = {
          {
            width: '100%',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            padding: '30px 0'
          }
        } >
        <
        div style = {
          {
            fontSize: 28,
            color: '#f4cf3d'
          }
        } > 线下参会即享 & nbsp; & nbsp; 线上视频课程免费畅学 < /div> <
        div > 五大板块， 全程跟踪 < /div> <
        div > 全阶段为企业保驾护航 < /div> < /
        div > <
        div style = {
          {
            width: '100%',
            height: 725,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/remit_bg5.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }
        } >
        <
        div style = {
          {
            paddingLeft: 15
          }
        } >
        <
        div style = {
          {
            paddingTop: 42,
            height: 40,
            lineHeight: '40px',
            fontSize: 22,
            color: '#24427b',
          }
        } >
        <
        div style = {
          {
            width: 95,
            fontWeight: 'bold',
            textAlign: 'center',
            float: 'left'
          }
        } > 阶段1 < /div> <
        div style = {
          {
            width: 230,
            fontWeight: 'bold',
            paddingLeft: 45,
            float: 'left',
          }
        } > 企业所得税入门 < /div> <
        div style = {
          {
            color: '#383332',
            paddingLeft: 0,
            float: 'left'
          }
        } > 企业所得税基础及实务处理 < /div> < /
        div > <
        div style = {
          {
            paddingTop: 36,
            height: 40,
            lineHeight: '40px',
            fontSize: 22,
            color: '#24427b',
          }
        } >
        <
        div style = {
          {
            width: 95,
            fontWeight: 'bold',
            textAlign: 'center',
            float: 'left'
          }
        } > 阶段2 < /div> <
        div style = {
          {
            width: 230,
            fontWeight: 'bold',
            paddingLeft: 45,
            float: 'left',
          }
        } > 企业所得税基础 < /div> <
        div style = {
          {
            color: '#383332',
            paddingLeft: 0,
            float: 'left'
          }
        } > 企业所得税常见纳税误区精解 < /div> < /
        div > <
        div style = {
          {
            paddingTop: 26,
            lineHeight: '40px',
            fontSize: 22,
            color: '#24427b',
            height: 175
          }
        } >
        <
        div style = {
          {
            width: 95,
            fontWeight: 'bold',
            textAlign: 'center',
            float: 'left',
            paddingTop: 65
          }
        } > 阶段3 < /div> <
        div style = {
          {
            width: 230,
            fontWeight: 'bold',
            paddingLeft: 45,
            float: 'left',
            paddingTop: 65
          }
        } > 企业所得税申报 < /div> <
        div style = {
          {
            color: '#383332',
            paddingLeft: 0,
            float: 'left'
          }
        } >
        <
        div > 汇算清缴答疑会 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 纳税申报表填报指南 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 汇算清缴中的稽查风险 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 总分机构汇总纳税处理技巧 < /div> < /
        div > <
        /div> <
        div style = {
          {
            paddingTop: 25,
            lineHeight: '40px',
            fontSize: 22,
            color: '#24427b',
            height: 222
          }
        } >
        <
        div style = {
          {
            width: 95,
            fontWeight: 'bold',
            textAlign: 'center',
            float: 'left',
            paddingTop: 85
          }
        } > 阶段4 < /div> <
        div style = {
          {
            width: 230,
            fontWeight: 'bold',
            paddingLeft: 45,
            float: 'left',
            paddingTop: 89
          }
        } > 难点解析 < /div> <
        div style = {
          {
            color: '#383332',
            paddingLeft: 0,
            float: 'left'
          }
        } >
        <
        div > 收入确认难题 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 扣除难题 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 捐赠 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 投资 < /div> <
        div style = {
          {
            paddingTop: 5
          }
        } > 案例解读企业所得税新政34号公告 < /div> < /
        div > <
        /div> <
        div style = {
          {
            paddingTop: 44,
            height: 40,
            lineHeight: '40px',
            fontSize: 22,
            color: '#24427b',
          }
        } >
        <
        div style = {
          {
            width: 95,
            fontWeight: 'bold',
            textAlign: 'center',
            float: 'left'
          }
        } > 阶段5 < /div> <
        div style = {
          {
            width: 230,
            fontWeight: 'bold',
            paddingLeft: 45,
            float: 'left',
          }
        } > 递延所得税 < /div> <
        div style = {
          {
            color: '#383332',
            paddingLeft: 0,
            float: 'left'
          }
        } > 递延所得税实务 < /div> < /
        div > <
        /div> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            backgroundColor: '#fff',
            padding: '60px 0'
          }
        } >
        <
        div style = {
          {
            width: '100%',
            height: 56,
            lineHeight: '56px',
            fontSize: 30,
            color: '#fff',
            fontWeight: 'bold',
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/titile_bg2.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            textAlign: 'center',
          }
        } >
        权威税务讲师倾囊相授 <
        /div> <
        div style = {
          {
            fontSize: 25,
            fontWeight: 'bold',
            color: '#24427b',
            textAlign: 'center',
            paddingTop: 15
          }
        } > 多维度剖析汇算清缴实战攻略 < /div> <
        div style = {
          {
            width: '100%',
            overflow: 'hidden'
          }
        } >
        <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head1.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        汪蔚青 <
        /div> <
        div > 国家税务总局 < /div> <
        div > 中国国际税收研究会学术委员 < /div> <
        div > 著名税务专家 < /div> < /
        div > <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head2.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        李晶 <
        /div> <
        div > 税制改革草案拟定参与人 < /div> <
        div > 著名税务专家 < /div> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            overflow: 'hidden'
          }
        } >
        <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head3.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        许明 <
        /div> <
        div > 国家税务总局师资库成员 < /div> <
        div > 著名税收风险防范专家 < /div> < /
        div > <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head4.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        王越 <
        /div> <
        div > 国家税务总局稽查局人才库成员 < /div> <
        div > 著名税务专家 < /div> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            overflow: 'hidden'
          }
        } >
        <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head5.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        李国华 <
        /div> <
        div > 知名税务师事务所合伙人 < /div> <
        div > 著名税务实战专家 < /div> < /
        div > <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head6.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        王战 <
        /div> <
        div > 中翰中国税务集团合伙人 < /div> <
        div > 著名税务专家 < /div> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            overflow: 'hidden'
          }
        } >
        <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head7.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        富老师 <
        /div> <
        div > 国家税务总局所得税专家库成员 < /div> <
        div > 某省税务稽查官员 < /div> < /
        div > <
        div style = {
          {
            width: 375,
            float: 'left',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head8.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 89,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        王新 <
        /div> <
        div > 亚太鹏盛税务师事务所高级合伙人 < /div> <
        div > 资深财税专家 < /div> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            paddingTop: 25,
            textAlign: 'center',
            fontSize: 22,
            color: '#191919'
          }
        } >
        <
        img src = {
          Dm.getUrl_img(`/img/v2/activity/remit_img/remit_head9.jpg`)
        }
        style = {
          {
            width: 186,
            height: 186,
          }
        }
        /> <
        div style = {
          {
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/title_bg3.jpg`) + ')',
            marginLeft: 276.5,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: 197,
            height: 55,
            lineHeight: '55px',
            fontSize: 28,
            color: '#24427b',
            fontWeight: 'bold',
            textAlign: 'center'
          }
        } >
        李兆婴 <
        /div> <
        div > 上海四达会计事务所税务合伙人 < /div> <
        div > 著名税务专家 < /div> < /
        div > <
        /div> <
        div style = {
          {
            width: '100%',
            backgroundColor: '#90a1bd',
            paddingTop: 50,
            paddingBottom: 60
          }
        } >
        <
        div style = {
          {
            textAlign: 'center',
          }
        } >
        <
        span style = {
          {
            fontSize: 35,
            color: '#3e3a39',
            fontWeight: 'bold'
          }
        } > VIP体验会员 < /span> < /
        div > <
        div style = {
          {
            textAlign: 'center',
            fontSize: 15,
            marginTop: 15,
            marginBottom: 30,
          }
        } >
        <
        span style = {
          {
            fontSize: 25,
            color: '#5c5c5b'
          }
        } > 注册即可申请免费体验线上课程 < /span> < /
        div > <
        input style = {
          { ...styles.inputText
          }
        }
        type = "text"
        value = {
          this.state.name
        }
        placeholder = " 姓名"
        onChange = {
          this._onChangeName.bind(this)
        }
        /> <
        input style = {
          { ...styles.inputText
          }
        }
        type = "text"
        value = {
          this.state.company
        }
        placeholder = " 公司"
        onChange = {
          this._onChangeCompany.bind(this)
        }
        /> <
        input style = {
          { ...styles.inputText
          }
        }
        type = "text"
        value = {
          this.state.telephone
        }
        placeholder = " 手机/电话"
        onChange = {
          this._onChangeTelephone.bind(this)
        }
        /> <
        div style = {
          { ...styles.button
          }
        }
        onClick = {
          this.onClickSubmit.bind(this)
        } >
        立即注册 <
        /div> < /
        div > <
        div style = {
          {
            position: 'fixed',
            zIndex: 999,
            bottom: 0,
            left: 0,
            width: '100%',
            height: 140,
            backgroundImage: 'url(' + Dm.getUrl_img(`/img/v2/activity/remit_img/remit_footer.jpg`) + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }
        } >
        <
        div style = {
          {
            width: '100%',
            height: 140,
            color: '#24427b',
            fontSize: 24,
            textAlign: 'center'
          }
        } >
        <
        div style = {
          {
            width: 187.5,
            float: 'left',
            height: 50,
            paddingTop: 90
          }
        }
        onClick = {
          this._goHomePage.bind(this)
        } > 铂略首页 < /div> <
        div style = {
          {
            width: 187.5,
            float: 'left',
            height: 140,
          }
        } >
        <
        a href = {
          tel_link
        }
        style = {
          {
            display: 'inline-block',
            width: 187,
            height: 50,
            paddingTop: 90,
          }
        } > < span style = {
          {
            color: '#24427b',
            fontSize: 24,
          }
        } > 一键拨号 < /span></a >
        <
        /div> <
        div style = {
          {
            width: 187.5,
            float: 'left',
            height: 50,
            paddingTop: 90
          }
        }
        onClick = {
          this._goLink.bind(this)
        } > 在线咨询 < /div> <
        div style = {
          {
            width: 187.5,
            float: 'left',
            height: 50,
            paddingTop: 90,
          }
        }
        onClick = {
          this._goBack.bind(this)
        } > 返回顶部 < /div> < /
        div > <
        /div>
        <div style = {{ ...styles.show_box,display: this.state.isShow ? 'block' : 'none'}} onClick={this._hide.bind(this)}> < /div>
        <div style = {
          { ...styles.bookDiv,
            display: this.state.isShow ? 'block' : 'none'
          }
        } >
        <
        p style = {
          { ...styles.bookTitle
          }
        } > {
          this.state.success ? '提交成功' : '提交失败'
        } < /p> <
        p style = {
          {
            textAlign: 'center',
            color: '#333',
            fontSize: 25,
            marginTop: 10,
            marginBottom: 13
          }
        } > {
          this.state.title
        } < /p> {
        this.state.success ?
        <
        div style = {
          {
            display: 'inline-block',
            width: 200,
            textAlign: 'center',
            marginLeft: 110,
          }
        } >
        <
        div style = {
          { ...styles.btn_ok,
            fontWeight: 'bold'
          }
        }
        onClick = {
          this._propAlert.bind(this)
        } >
        确定 <
        /div> < /
        div > : null
      } <
      /div> < /
    div >
  )
}

//输入姓名
_onChangeName(e) {
  e.preventDefault();
  var input_text = e.target.value.trim();
  if (this.state.name && input_text.length > 0) {
    this.setState({
      name: input_text,
    });
  } else {
    this.setState({
      name: input_text,
    });
  }
}

//输入公司
_onChangeCompany(e) {
  e.preventDefault();
  var input_text = e.target.value.trim();
  if (this.state.company && input_text.length > 0) {
    this.setState({
      company: input_text,
    });
  } else {
    this.setState({
      company: input_text,
    });
  }
}

//输入电话
_onChangeTelephone(e) {
  e.preventDefault();
  var input_text = e.target.value.trim();
  this.setState({
    telephone: input_text,
  });
}

//提示框
onIsShow(re) {
  console.log('onIsShow', re);
  this.setState({
    isShow: true,
    title: re
  }, () => {
    timer = setTimeout(() => {
      this.setState({
        isShow: false,
      })
    }, 1000)
  })
}

//注册
onClickSubmit() {

  if (!this.state.company) {
    this.onIsShow('公司不能为空')
    return
  }
  if (!this.state.telephone) {
    this.onIsShow('电话不能为空')
    return
  }
  if(!isCellPhoneAvailable(this.state.telephone)){
    this.onIsShow('请输入正确的手机号码')
    return
  }

  Dispatcher.dispatch({
    actionType: 'Special',
    name: this.state.name,
    phone: this.state.telephone,
    company: this.state.company,
    isCima: false,
    url: document.location.href + '',
    title: '决战汇算清缴季(移动端)',
  });
}

_hide(){
  this.setState({
    isShow:false,
    success:false,
    name:'',
    company:'',
    telephone:''
  })
}


_handleSpecialDone(re) {
  if (re.result) {
    this.setState({
      success: true,
      isShow: true,
      title: '您的申请已经成功提交稍后将会有工作人员与您联系',
    });
  }
  if (re.err) {
    this.setState({
      isShow: true,
      title: re.err
    });
  }
}
}

var styles = {
  container: {
    width: 750,
    paddingBottom: 140,
    position: 'relative'
  },
  inputText: {
    height: 34,
    padding: '5px 8px',
    marginBottom: 35,
    borderRadius: 4,
    border: 'none',
    fontSize: 22,
    color: '#adacaa',
    width: 554,
    height: 58,
    lineHeight: '58px',
    marginLeft: 90
  },
  button: {
    backgroundColor: '#f3cf3d',
    textAlign: 'center',
    height: 68,
    lineHeight: '68px',
    width: 320,
    borderRadius: 4,
    marginTop: 45,
    fontSize: 22,
    color: '#fff',
    marginLeft: 215,
  },
  show_box: {
    width: '100%',
    height: 1334,
    backgroundColor: '#cccccc',
    position: 'absolute',
    opacity: 0.5,
    zIndex: 998,
    bottom: 0,
  },
  bookDiv: {
    position: 'absolute',
    zIndex: 999,
    bottom: 280,
    left: 0,
    width: 420,
    height: 220,
    backgroundColor: '#fff',
    marginLeft: 165,
    borderRadius: 12
  },
  bookTitle: {
    textAlign: 'center',
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 16
  },
  hr: {
    marginTop: 4,
    border: 'none',
    height: 1,
    backgroundColor: '#d3d3d3'
  },
  btn_ok: {
    width: 200,
    textAlign: 'center',
    marginTop: 8,
    color: '#fff',
    display: 'inline-block',
    fontSize: 25,
    backgroundColor: '#2196f3',
    borderRadius: 6
  },
  cutHr: {
    borderLeft: '1px solid #d3d3d3',
    height: 42,
    display: 'inline-block'
  }

}

export default PgRemittance;
