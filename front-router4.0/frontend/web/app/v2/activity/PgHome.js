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
