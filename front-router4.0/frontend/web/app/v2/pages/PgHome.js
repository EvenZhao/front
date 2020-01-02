/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link ,History} from 'react-router-dom';
import { SvgIcoMap, SvgIcoArrowBack, SvgIcoBulb,SvgIconStar } from '../icons';
import {SvgIcon} from '../icons/SvgIcon'

class PgHome extends React.Component {
	constructor(props) {
    super(props)
		this.state = {
			title: 'PgHome'
		}

	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
		let iconStyle = {
			width: 64,
			height: 64,
			color: '#ee0000',
			status:'all',//all half none
		}
		return (
			<div className="PgHome container" style={{overflow:'auto',height:667,paddingTop:100,}}>
        <h1>PgHome</h1>
        {/*<h1><Link to='/test/online'>test</Link></h1>*/}
<h1><Link to={`${__rootDir}/activity/PgTax20180329`}>税政通</Link></h1>
				<h1><Link to={`${__rootDir}/GuidePage`}>引导页</Link></h1>
				<h1><Link to={`${__rootDir}/activity/cwdzz20170330`}>Excel财务大作战</Link></h1>
				<div><Link to={`${__rootDir}/activity/RemittanceActivity20171102`}>汇算清缴2</Link></div>
				<h1><Link to={`${__rootDir}/activity/RemittanceActivity2017`}>汇算清缴1</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgCimaPromotion`}>CIMA推广页(学Cima)</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgActivityApp`}>app推广页</Link></h1>
				<h1><Link to={`${__rootDir}/PersonalCenter`}>个人中心</Link></h1>
				<h1><Link to={`${__rootDir}/BindAccount`}>BindAccount</Link></h1>

				<h1><Link to={`${__rootDir}/activity/CimaIndex20170621`}>CimaIndex</Link></h1>
				<h1><Link to={`${__rootDir}/activity/yyg`}>一元购</Link></h1>
				<h1><Link to={`${__rootDir}/activity/yygmb`}>一元购yygmb</Link></h1>
				<h1><Link to={`${__rootDir}/list/online`}>online</Link></h1>
				<h1><Link to={`${__rootDir}/list/live`}>live</Link></h1>

				<h1><Link to={`${__rootDir}/reserveDetail/666`}>reserveDetail</Link></h1>
				<h1><Link to={`${__rootDir}/list/offline`}>offline</Link></h1>
				<h1><Link to={`${__rootDir}/questionDetail/2`}>questionDetail</Link></h1>
				<h1><Link to={`${__rootDir}/questionList`}>questionList</Link></h1>
				<h1><Link to={`${__rootDir}/exam/486/1395`}>exam</Link></h1>
				<h1><Link to={`${__rootDir}/chooseAccount`}>chooseAccount</Link></h1>
				<h1><Link to={`${__rootDir}/quickLogin`}>quickLogin</Link></h1>

        <h1><Link to='/test'>test</Link></h1>

				<h1><Link to={`${__rootDir}/activity/PgActivityOfCompanyQuote`}>H5报价（总公司报价）</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgActivityOfCards20170526`}>H5报价（分公司单页）</Link></h1>

				<h1><Link to={`${__rootDir}/activity/zrdj20170330`}>zrdj</Link></h1>
				<h1><Link to={`${__rootDir}/activity/cwdzz20170331`}>Exel财务大作战-cwdzz</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgPlatinumBrand20170504`}>PgPlatinumBrand</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgConnectionCFO20170516`}>连线CFO</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgNonTrade20170516`}>非贸付汇</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgZrdj`}>PgZrdj</Link></h1>
				<h1><Link to={`${__rootDir}/activity/PgCwdzz`}>PgCwdzz</Link></h1>

				<h1><Link to='/promptBox'>提示框</Link></h1>
				<h1><Link to={`${__rootDir}/PgSearchResult`}>搜索结果页</Link></h1>
				<h1><Link to={`${__rootDir}/PgHomeIndex`}>首页</Link></h1>
				<h1><Link to={`${__rootDir}/PgMyReserveEnroll`}></Link>我的预约</h1>
				<h1><Link to={`${__rootDir}/PgSetPosition`}>自定义职位</Link></h1>
				<h1><Link to={`${__rootDir}/PgUpdatePhone`}>修改绑定手机号</Link></h1>
				<h1><Link to={`${__rootDir}/PgPositionList`}>职位列表</Link></h1>
				<h1><Link to={`${__rootDir}/PgSetPhone`}>修改手机号</Link></h1>
				<h1><Link to={`${__rootDir}/PgMyQuestion`}>我的问答</Link></h1>
				<h1><Link to={`${__rootDir}/PgMyCollect`}>我的收藏</Link></h1>
				<h1><Link to={`${__rootDir}/PgLearnRecord`}>学习记录</Link></h1>
				<h1><Link to={`${__rootDir}/PgProductList`}>专题课列表</Link></h1>
				<h1><Link to={`${__rootDir}/PgMyDiscount`}>我的优惠券</Link></h1>
				<h1><Link to={`${__rootDir}/PgAddDiscount`}>添加优惠券</Link></h1>
				<h1><Link to={`${__rootDir}/login`}>登录</Link></h1>
				<h1><Link to={`${__rootDir}/nplogin`}>无密码登录</Link></h1>
				<h1><Link to={`${__rootDir}/findpass`}>找回密码</Link></h1>
				<h1><Link to={`${__rootDir}/register`}>注册</Link></h1>
				<h1><Link to={`${__rootDir}/PgCompleteData`}>补全信息</Link></h1>
				<h1><Link to={`${__rootDir}/PgCenter`}>个人中心</Link></h1>
				<h1><Link to={`${__rootDir}/PgCenterSet`}>会员设置</Link></h1>
				<h1><Link to={`${__rootDir}/PgSetInfo`}>设置会员信息</Link></h1>
				<h1><Link to={`${__rootDir}/PgSetNickname`}>昵称修改</Link></h1>
				<h1><Link to={`${__rootDir}/PgAdvice`}>意见反馈</Link></h1>
				<h1><Link to={`${__rootDir}/PgSetPassword`}>修改密码</Link></h1>
				<h1><Link to={`${__rootDir}/PgSelectAccount`}>选择账户</Link></h1>
				<h1><Link to={`${__rootDir}/online_list`}>test2</Link></h1>
        <h1>
          <SvgIcon name="SvgIcoMap" {...iconStyle} />
          <SvgIcoMap {...iconStyle}/>
          <SvgIcoArrowBack {...iconStyle}/>
          <SvgIcoBulb {...iconStyle}/>
					<SvgIconStar {...iconStyle}/>
        </h1>
        <h1><Link to='/test?qr=xxx'>test</Link></h1>
			</div>
		);
	}
}
PgHome.propTypes = {

};
PgHome.defaultProps = {

};
export default PgHome;
