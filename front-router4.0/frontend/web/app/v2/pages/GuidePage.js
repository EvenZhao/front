import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import Dm from '../util/DmURL'
import FactoryTxt from '../FactoryTxt';
import FullLoading from '../components/FullLoading';
import Common from '../Common'

class GuidePage extends React.Component {
	constructor(props) {
    super(props);

	}

  componentWillMount() {

  }

	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-app引导页')
    // devWidth = window.innerHeight;
    // devHeight = window.innerHeight;
	}
	componentWillUnmount() {

	}

  //下载APP
  gotoDownload(){
		window.location="https://mb.bolue.cn/dlapp";
	}

	render(){

    return(
      <div style={styles.container}>
        <div style={styles.title}>如需访问，请下载铂略财课APP</div>
        <div style={{paddingTop:25,textAlign:'center'}}>
          <img src={Dm.getUrl_img('/img/v2/icons/guide_phone@2x.png')} width={201} height={359}/>
        </div>
        <div style={{fontSize:Fnt_Large,color:Common.Black,marginTop:20,textAlign:'center'}}>
          铂略财课<span style={{marginLeft:15}}>让专业知识触手可及</span>
        </div>
        <div style={{marginTop:7,lineHeight:'20px',fontSize:Fnt_Normal,color:'#ababab',textAlign:'center'}}>
          铂略财课APP专注于财务培训<br/>是企业财务 税务 会计的学习平台
        </div>
        <div style={styles.button} onClick={this.gotoDownload.bind(this)}>
					<img src={Dm.getUrl_img('/img/v2/icons/button@2x.png')} width={devWidth} height={90}/>
        </div>
      </div>
    )
  }
}

var styles = {
  container:{
    width:devWidth,
    height:devHeight + 100,
    backgroundColor:'#f3f7fa',
		position:'absolute',
		zIndex:99999999999999999999999,
		overflowY:'scroll',
		overflowX:'hidden',
  },
  title:{
    fontSize:Fnt_Normal,
    width:devWidth,
    textAlign:'center',
    paddingTop:25,
    color:'#ababab',
  },
  button:{
    // backgroundImage:'url('+Dm.getUrl_img('/img/v2/icons/button@2x.png')+')',
    // width:devWidth,
    height:'190px',
    // backgroundRepeat:'no-repeat',
    // backgroundSize:'cover',
		marginBottom: 30
    // textAlign:'center',
    // lineHeight:'95px',
		// position:'relative',
		// paddingTop:'36px'
  }
};

export default GuidePage;
