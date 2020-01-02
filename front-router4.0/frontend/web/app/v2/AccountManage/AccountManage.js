/*
 * Author: JOyce
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'

import VerifyType from '../VerifyType'

String.prototype.replaceAll = function(s1,s2){
return this.replace(new RegExp(s1,"gm"),s2);
}

class AccountManage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

	}
  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-账号管理');
  }
	componentWillUnmount() {

	}

  render(){

    var mobile = '';
    if(this.props.location.state.user){
      mobile = this.props.location.state.user.phone.replaceAll('(\\d{3})\\d{4}(\\d{4})', '$1****$2');
    }

    return(
      <div style={{...styles.account_box}}>
        <Link to={{pathname:`${__rootDir}/ChangePwd`,query: null, hash: null, state:{verifyType:VerifyType.UPDATE_PWD_VERIFY}}}>
          <div style={{...styles.div,marginTop:15}}>
            <div style={{...styles.titlediv}}>
              <span style={{fontSize:14,color:'#666666'}}>修改密码</span>
            </div>
            <div style={{...styles.more}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
          </div>
        </Link>
        <div style={{...styles.divider}}></div>
        <div style={{...styles.div}}>
          <div style={{...styles.titlediv}}>
            <span style={{fontSize:14,color:'#666666'}}>手机绑定</span>
          </div>
          {
            mobile ?
            <div style={{float:'right',marginRight:46,}} onClick={this.UpdateBindPhone.bind(this)}>
              <span style={{fontSize:14,color:'#666666'}}>{mobile}</span>
            </div>
            :
            <div style={{float:'right',marginRight:46,}} onClick={this.BindPhone.bind(this)}>
              <span style={{fontSize:14,color:'#666666'}}>未绑定</span>
            </div>
          }

          <div style={{...styles.more}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
        </div>
      </div>

    )
  }

  //绑定手机号
  BindPhone(){
    this.props.history.push({pathname:`${__rootDir}/BindPhoneNumber`,state:{isFirst:true}});
  }

  //已绑定手机号，修改绑定
  UpdateBindPhone(){
    this.props.history.push({pathname: `${__rootDir}/UpdateBindMobile`,state:null});
  }

}

var styles = {
  account_box:{
    backgroundColor:'#fff',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:'1px solid #E5E5E5',
  },
  div:{
    height: '50px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:3,
  },
  titlediv:{
    fontSize: 15,
    marginLeft: 12,
    float: 'left',
  },
  divider:{
    backgroundColor:'#E5E5E5',
    height:1,
    marginLeft:12,
  },
  more:{
		position: 'absolute',
		right: 16,
	},

}


export default AccountManage;
