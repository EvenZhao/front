import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Common from '../Common';
import maskStyle from './maskStyle';

class ChangePwdTips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	showChangePwd:false //修改初始密码标记
        };

    }
    componentWillMount() {}
    componentDidMount() {
    	this.e_showChangePwd = EventCenter.on("showChangePwdTips", this._handleshowChangePwd.bind(this));
    }
    componentWillUnmount() {
    	this.e_showChangePwd.remove()
    }
    _handleshowChangePwd(){
      this.setState({
        showChangePwd:true
      })
    }
    _hideChangePwdAlert(){
      this.setState({
        showChangePwd:false
      })
    }
    _goToChangePwd(){
      this.setState({
        showChangePwd:false
      },()=>{
        window.location =`${__rootDir}/ChangePwd`
      })
    }
    render() {

        return (
        	<div style={{display:this.state.showChangePwd ? 'block':'none'}}>
        	  <div style={{...maskStyle.msk,display:'block'}} onClick={this._hideChangePwdAlert.bind(this)}></div>
        	  <div style={{...maskStyle.white_alert,paddingTop:-1,display:'block'}}>
        	    <div style={{marginTop:20,fontSize:Fnt_Large,color:Common.Black,fontWeight:'bold'}}>友情提示</div>
        	    <div style={{ color: Common.Black,fontSize:Fnt_Normal,lineHeight:'20px'}}>为了您的账号安全，请修改初始密码</div>
        	    <div style={maskStyle.alert_bottom}>
        	      <div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Gray}} onClick={this._hideChangePwdAlert.bind(this)}>稍后再说
        	      </div>

        	      <div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._goToChangePwd.bind(this)}>
        	        立即前往修改
        	      </div>
        	    </div>
        	  </div>
        	</div>
        )
    }
}



export default ChangePwdTips;