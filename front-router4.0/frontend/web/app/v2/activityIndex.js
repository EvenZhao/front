/* flow */
'use strict';
import "babel-polyfill";
import {dm, makeSureCurrentUrlSaveForWeixinShare} from './util/DmURL.js';
import {jumpToPC} from './redirectPC'
// import URL from 'url';
import './util/DateFormat';
import './util/funcs';
import Dispatcher from './AppDispatcher';
import EventCenter from './EventCenter';
import React, {PropTypes} from 'react';
import Common from './Common';
import iosSelect from './util/iosSelect'
import {
  render
} from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Match,
  withRouter,
  IndexRoute,
  Link,
} from 'react-router-dom'
import {CSSTransitionGroup} from 'react-transition-group'


const cx = require('classnames');
const util = require('util'),
    f = util.format;

import {AuthStore} from './stores/AuthStore.js';
import './stores/StoreRegister'
/*活动页*/
import PgHome from './pages/PgHome';
import CimaAuthority from './activity/CimaAuthority'
import CimaLearningMethod from './activity/CimaLearningMethod'
import AboutCima from './activity/AboutCima'
import PgActivityApp from './activity/PgActivityApp'
import PgCimaPromotion from './activity/PgCimaPromotion'
import PgActivityCwdzz from './activity/PgActivityCwdzz'
import PgActivityZrdj from './activity/PgActivityZrdj'
import PgExcel from './activity/PgExcel'
import PgTax from './activity/PgTax'
import RemittanceActivity from './activity/RemittanceActivity'
import PgRemittance from './activity/PgRemittance'
import PgPlatinumBrand from './activity/PgPlatinumBrand'
import PgConnectionCFO from './activity/PgConnectionCFO'
import PgNonTrade from './activity/PgNonTrade'
import PgActivityOfCards from './activity/PgActivityOfCards'
import CimaIndex from './activity/CimaIndex'
import CimaCourse from './activity/CimaCourse'
import AboutBolue from './activity/AboutBolue'
import yyg from './activity/yyg'
import yygmb from './activity/yygmb'
import bolueWeeklyReport from './EMP/bolueWeeklyReport'

var urlll = document.location.href; // 获取当前url链接
var urlquery = dm.getCurrentUrlQuery();
global.specialCode = urlquery.specialCode || '';
global.wailian = urlquery.wailian || '';
global.renderFromApp = urlquery.renderFromApp || '';
var ts_sw_last = localStorage.getItem("ts_sw_last") //记录wailian设置时长
if (!ts_sw_last || Date.now() - ts_sw_last > 5 * 60 * 1000) {
  localStorage.setItem("specialCode",specialCode);
  localStorage.setItem("wailian",wailian);
  localStorage.setItem("ts_sw_last", Date.now());
}
global.AddLearnRecordLeave = () => {}
global.IsActivity = false
global.offlineUsers = [];//线下课主持卡人报名存储选中用户状态
global.__rootDir = process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'dev' ? '' : '/' + process.env.NODE_ENV;
var userAgent = window.navigator.userAgent.toLowerCase();
if (__DEBUG__) console.log('userAgent', userAgent);
// if (__DEBUG__) alert(userAgent)
if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ) {
  jumpToPC(window.location)
}
global.isWeiXin = userAgent.indexOf('micromessenger') > -1;//为了测试先注释掉
// global.isWeiXin = userAgent.indexOf('micromessenger') > -1 ? false : true;
global.isApple = userAgent.indexOf('iphone') > -1;
//##Main Entry

var urlll = document.location.href; // 获取当前url链接
var service = urlll.split('about')[1]
var reShare = urlll.split('resourceShare')[1]
var huawei
var Integral = urlll.split('Integral')[1]



class ActivIndex extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      nonceIframe: '',
  	};
  }
  initData(){
    // makeSureCurrentUrlSaveForWeixinShare()
    Dispatcher.dispatch({
      actionType: 'loginTest'
    })
  }
  _handleloginTestDone(re){
    this.setState({
          authenticated: true
  	});
  }
  _handleREQUEST_START(re) {
    this.setState({
      isMaskPg: true
    });
  }

  _handleSET_TITLE(title) {
      // console.log('_handleSET_TITLE',title);
      document.title = title;

  }

  componentWillMount(){


  }
  componentDidMount() {

  }
  // componentDidUpdate (prevProps) {
  // }
  componentWillUnmount() {

  }

	render(){

    return (
      <div>
        <div>
          <Router>
            <div>
              <Route render={({ location }) => (
                <CSSTransitionGroup
                  transitionName="AnimNavTrans"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                >
                <Route location={location} key={location.key}>
                  <Switch>
                    <Route exact path={`${__rootDir}/activity/home`} component={withRouter(PgHome)} />
                    <Route exact path={`${__rootDir}/activity/zrdj20170330`} component={withRouter(PgActivityZrdj)} />
                    <Route exact path={`${__rootDir}/activity/cwdzz20170331`} component={withRouter(PgActivityCwdzz)} />
                    <Route exact path={`${__rootDir}/activity/PgPlatinumBrand20170504`} component={withRouter(PgPlatinumBrand)} />
                    <Route exact path={`${__rootDir}/activity/RemittanceActivity2017`} component={withRouter(RemittanceActivity)} />
                    <Route exact path={`${__rootDir}/activity/RemittanceActivity20171102`} component={withRouter(PgRemittance)} />
                    <Route exact path={`${__rootDir}/activity/PgConnectionCFO20170516`} component={withRouter(PgConnectionCFO)} />
                    <Route exact path={`${__rootDir}/activity/PgNonTrade20170516`} component={withRouter(PgNonTrade)} />
                    <Route exact path={`${__rootDir}/activity/cwdzz20170330`} component={withRouter(PgExcel)} />
                    <Route exact path={`${__rootDir}/activity/PgTax20180329`} component={withRouter(PgTax)} />
                    <Route exact path={`${__rootDir}/activity/PgActivityOfCards20170526`} component={withRouter(PgActivityOfCards)} />
                    <Route exact path={`${__rootDir}/activity/CimaIndex20170621`} component={withRouter(CimaIndex)}></Route>
                    <Route exact path={`${__rootDir}/activity/CimaCourse20170621`} component={withRouter(CimaCourse)}></Route>
                    <Route exact path={`${__rootDir}/activity/CimaAuthority20170622`} component={withRouter(CimaAuthority)}></Route>
                    <Route exact path={`${__rootDir}/activity/CimaLearningMethod20170622`} component={withRouter(CimaLearningMethod)}></Route>
                    <Route exact path={`${__rootDir}/activity/AboutCima20170622`} component={withRouter(AboutCima)}></Route>
                    <Route exact path={`${__rootDir}/activity/PgActivityApp`} component={withRouter(PgActivityApp)}></Route>
                    <Route exact path={`${__rootDir}/activity/PgCimaPromotion`} component={withRouter(PgCimaPromotion)}></Route>
                    <Route exact path={`${__rootDir}/activity/AboutBolue20170622`} component={withRouter(AboutBolue)}></Route>
                    <Route exact path={`${__rootDir}/activity/yyg/:source/:uuid`} component={withRouter(yyg)}></Route>
                    <Route exact path={`${__rootDir}/activity/bolueWeeklyReport/:id`} component={withRouter(bolueWeeklyReport)}></Route>
                    <Route exact path={`${__rootDir}/activity/yygmb`} component={withRouter(yygmb)}></Route>
                  </Switch>
                </Route>
                </CSSTransitionGroup>
              )} />
            </div>
          </Router>
        </div>
      </div>
     )
	}
}
global.setParametersForApp =(openid,code,bolueClient,UUIDIMEI,devToken)=>{

  render(<ActivIndex />,  document.getElementById('react'));
}
// if (!renderFromApp) {
//   render(<ActivIndex />,  document.getElementById('react'));
// }
render(<ActivIndex />,  document.getElementById('react'));
