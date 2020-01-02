import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'

var t
class RemittanceActivity extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: '决战汇算清缴季',
  				desc: '铂略2018汇算清缴专题课程包重磅登录',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/remi_share.jpg'),
  				type: 'link'
  		}
      this.state={
        name:'',
        company:'',
        telephone:'',
        isShow:false,
        success:false,
        title: 'PgHome',
        top: 0,
        height:0,
      }
  }
  componentDidMount(){
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
    EventCenter.emit("SET_TITLE",'决战汇算清缴季');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillMount(){

  }

  componentWillUnmount(){

  }

  render(){

    return(

      <div style={{...styles.container}}>
        <div style={{width:devWidth,}}>
          <img src={Dm.getUrl_img(`/img/v2/activity/rema1.jpg`)} width={devWidth} height={devWidth*(4096/750)} />
          <div style={{...styles.form_box}}>
            <div style={{...styles.form_div}}>
            <div style={{width:devWidth-26,textAlign:'center',}}>
              <span style={{fontSize:18,color:'#3e3a39'}}>VIP体验会员</span>
            </div>
            <div style={{width:devWidth-26,textAlign:'center',fontSize:15,marginTop:15,marginBottom:30,}}>
              <span style={{fontSize:15,color:'#5c5c5b'}}>注册即可申请免费体验线上课</span>
            </div>
            <input style={{...styles.inputText}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
            <input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" 公司" onChange={this._onChangeCompany.bind(this)}/>
            <input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder=" 手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
            <div style={{...styles.button}} onClick={this.onClickSubmit.bind(this)}>
              <span style={{color:'#fff'}}>立即注册</span>
            </div>
            <div style={{width:devWidth-26,textAlign:'center',marginTop:19,paddingBottom:20,}}>
              <span style={{color:'#565554',fontSize:12,}}>了解更多欢迎详询:400-689-0679</span>
            </div>
            </div>
          </div>
          <img src={Dm.getUrl_img(`/img/v2/activity/pla_end.png`)} width={devWidth} height={devWidth*(91.5/375)} />
        </div>
        <div style={{...styles.show_box,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
        <ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
      </div>
    )
  }

  //输入姓名
  _onChangeName(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.name && input_text.length>0){
      this.setState({
        name:input_text,
      });
    }
    else {
      this.setState({
        name:input_text,
      });
    }
  }

  //输入公司
  _onChangeCompany(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    this.setState({
      company:input_text,
    });
  }

  //输入电话
  _onChangeTelephone(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.telephone && input_text.length>0){
      this.setState({
        telephone:input_text,
      });
    }
    else {
      this.setState({
        telephone:input_text,
      });
    }
  }

  //提示框
  onIsShow(re){
		console.log('onIsShow',re);
		this.setState({
			isShow: true,
			title: re
		},()=>{
			t = setTimeout(() => {
				this.setState({
					isShow: false,
				})
			}, 1000)
		})
	}

  //注册
  onClickSubmit(){

    if(!this.state.company) {
        this.onIsShow('公司不能为空')
      return
    }
    if(!this.state.telephone) {
      this.onIsShow('电话不能为空')
      return
    }
    if(!isCellPhoneAvailable(this.state.telephone)){
      this.onIsShow('请输入正确的手机号码')
      return false;
    }

    Dispatcher.dispatch({
      actionType: 'Special',
      name:this.state.name,
      phone: this.state.telephone,
      company: this.state.company,
      isCima:false,
      url: document.location.href + '',
      title:'决战汇算清缴季(移动端)',
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

  _handleSpecialDone(re){
    if(re.result){
			this.setState({
				success: true,
				isShow: true,
				title:'您的申请已经成功提交稍后将会有工作人员与您联系',
			});
		}
		if(re.err){
			this.setState({
				isShow: true,
				title:re.err
			});
		}
  }
}

var styles ={
  container:{
    width:devWidth,
    height:devHeight,
    overflowX: 'hidden',
  },
  form_box:{
    height:400,
    width:devWidth,
    backgroundColor:'#a9b8c1',
    marginTop:-6,
  },
  form_div:{
    width:devWidth-26,
    marginLeft:13,
    backgroundColor:'#a9b8c1',
    paddingTop:30,
  },
  inputText:{
  		height:34,
      paddingLeft:8,
  		width: devWidth - 128,
  		marginLeft:(devWidth-(devWidth -128))/2-13,
  		marginBottom:18,
      borderRadius:4,
      border:'none',
  },
  button:{
    backgroundColor:'#f3cf3d',
    textAlign:'center',
    height:30,
    width:160,
    borderRadius: 4,
  	marginLeft: (devWidth-160)/2-13,
  	lineHeight: 1.8,
    marginTop:14,
  },
  show_box:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#cccccc',
    position:'absolute',
    opacity: 0.5,
    zIndex: 998,
    top:0,
  },

}

export default RemittanceActivity;
