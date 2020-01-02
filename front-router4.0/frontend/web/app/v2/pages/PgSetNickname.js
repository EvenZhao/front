/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';


function isEmojiCharacter(substring) {//暂时保留  判断当前输入值 是否给表情emoji
    for ( var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                    || hs == 0x2b50) {
                return true;
            }
        }
    }
}

// 获取字符串的字节长度
function len(s) {
  s = String(s);
  return s.length + (s.match(/[^\x00-\xff]/g) || "").length;// 加上匹配到的全角字符长度
}


var countdown;
class PgSetNickname extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			nick_name: '',
			buttonColor:false,
			display:'none',
			errDisplay:'none',
      lenDisplay:'none'
			// isEmoji: false
		};

	}
	_onChangeNiceName(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.nick_name && v.length > 0) {
			this.setState({
				buttonColor: (v == this.state.nick_name) ? false : true,
				nick_name: v,
				// isEmoji: isEmojiCharacter(v) ? true : false
			})
		}else {
      console.log('222',v);
			this.setState({
				nick_name: v,
				buttonColor: v.length > 0 ? true : false ,
				// isEmoji: isEmojiCharacter(v) ? true : false
			})
		}

	}
	_onBlurChangeButton(){
		if (this.state.nickname) {
			this.setState({
				buttonColor: true
			})
		}else {
      console.log('33');
			this.setState({
				buttonColor: false
			})
		}
	}
	_handlegetUserAccountDone(re){
		console.log('_handlegetUserAccountDone',re);
		if (re && re.user) {
			var user = re.user
			this.setState({
				user: re.user || {},
				nick_name: user.nick_name || '',
			})
		}
	}
	_handleupdNickNameDone(re){
		// console.log('_handleupdNickNameDone',re);
		if (re.result || re.result.isSuccess) {
			this.setState({
				display:'block'
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
      
      completeFlag = true;
  		companyFlag = true;
      window.history.back();

		}else if (re.err) {
			this.setState({
				errDisplay:'block'
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							errDisplay: 'none'
					});
			}, 1500);
		}
	}
	_onUpdateNiceName(re){
    if (len(this.state.nick_name) > 16) {
      this.setState({
        lenDisplay: 'block'
      })
      return
      // console.log('djshdjkhsjdh-----------------');
    }else {
      this.setState({
        lenDisplay: 'none'
      })
    }
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'updNickName',
			nickName: this.state.nick_name
		})
	}
	componentWillMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-昵称修改')
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this))
		this._updNickNameDone = EventCenter.on('updNickNameDone', this._handleupdNickNameDone.bind(this))

	}
	componentWillUnmount() {
		this._getUserAccountDone.remove()
		this._updNickNameDone.remove()
    clearInterval(countdown)
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div}}>
          <input style={{...styles.input}} value={this.state.nick_name} placeholder="请输入昵称" onChange={this._onChangeNiceName.bind(this)}/>
        </div>
        <div style={{...styles.buttonDiv}}>
					{
						this.state.buttonColor ?
						<div onClick={this._onUpdateNiceName.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
						</div>
					}
        </div>
				<div style={{...styles.alertDiv,display:this.state.display}}>
					<span>修改成功~</span>
				</div>
				<div style={{...styles.errAlertDiv,display:this.state.errDisplay}}>
					<span>昵称重复，重新输入。~</span>
				</div>
        <div style={{...styles.errAlertDiv,display:this.state.lenDisplay}}>
          <span>昵称过长~</span>
        </div>
			</div>
		);
	}
}
PgSetNickname.propTypes = {

};
PgSetNickname.defaultProps = {

};
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:'100%',
    width:'100%',
  },
  div:{
    height: '65px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:4,
  },
  input:{
    width:window.screen.width -24,
		marginLeft: 12,
		border:0
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
  },
  button:{
    width:window.screen.width*0.8,
    height:45,
    textAlign:'center',
    lineHeight:2.5,
    borderRadius:6,
    marginLeft:35,
  },
	alertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:105,
		height:28,
		left: (window.screen.width-105)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	},
	errAlertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:180,
		height:28,
		left: (window.screen.width-180)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	}
};
export default PgSetNickname;
