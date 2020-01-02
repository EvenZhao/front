/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class PgSetPassword extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			oldpass: '',
      newpass: '',
			buttonColor:false
		};

	}
	_onChangeOldPassWord(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.newpass && v.length > 0) {
			this.setState({
				oldpass: v,
				buttonColor: true
			})
		}else {
			this.setState({
				oldpass: v,
				buttonColor: false
			})
		}

	}
  _onChangeNewPassWord(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.oldpass && v.length > 0) {
      this.setState({
        newpass: v,
        buttonColor: true
      })
    }else {
      this.setState({
        newpass: v,
        buttonColor: false
      })
    }

  }
	_onBlurChangeButton(){
		if (this.state.oldpass && this.state.newpass) {
			this.setState({
				buttonColor: true
			})
		}else {
			this.setState({
				buttonColor: false
			})
		}
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.titleDiv}}>
          <span style={{...styles.titleSpan}}>该账号对应多个账户,请选择</span>
        </div>
        <div style={{...styles.div}}>
					<div style={{...styles.infoDiv,height:18,width:18,borderRadius:10,backgroundColor:'gray'}}></div>
					<div style={{...styles.infoDiv}}><span>dennistang@qq.com</span></div>
					<div style={{position:'absolute',right:12}}><span style={{fontSize:14,color:'#999999'}}>个人</span></div>
        </div>
        <div style={{...styles.buttonDiv}}>
					{
						this.state.buttonColor ?
						<div style={{...styles.button,backgroundColor:'#2196f3'}}>
							<button>
								<span style={{fontSize:16,color:'#ffffff'}}>登录</span>
							</button>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
							<button>
								<span style={{fontSize:16,color:'#ffffff'}}>登录</span>
							</button>
						</div>
					}
        </div>
			</div>
		);
	}
}
PgSetPassword.propTypes = {

};
PgSetPassword.defaultProps = {

};
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:'100%',
    width:'100%',
  },
  titleDiv:{
    textAlign:'center',
    // marginTop: 23,
		height:56,

  },
  titleSpan:{
    position:'relative',
    top: 23,
		fontSize:16,
		color:'#333333'
  },
  div:{
    height: '50px',
    width: '100%',
    backgroundColor: '#ffffff',
    lineHeight: 3,
		marginTop: 12
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
  },
  button:{
    width:300,
    height:46,
    textAlign:'center',
    lineHeight:2.5,
    borderRadius:5,
    marginLeft:35,
  },
	infoDiv:{
		float: 'left',
	}
};
export default PgSetPassword;
