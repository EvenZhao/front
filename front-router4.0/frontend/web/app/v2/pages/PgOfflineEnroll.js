import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import ReserveAlert from '../components/ReserveAlert';
import funcs from '../util/funcs'

class PgOfflineEnroll extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      enroll_tab: 'mySelf',
			id: '',
      click: false,
      name: '',
      phone: '',
      tel: '',
      email: '',
      company: '',
      position: '',
      nameErr: '',
      phoneErr: '',
      telErr: '',
      emailErr: '',
      companyErr: '',
      positionErr: '',
			rightButton: '',
			title: '',
			isShow: false,
		};

    this._user = this.props.location.state.user

		this._isEnrollUser = ''
	}


  componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-报名')
		if(!this.props.location.state.isReserved) {
			this.setState({
	      name: this.props.location.state.user.name || '',
	      phone: this.props.location.state.user.phone || '',
	      email: this.props.location.state.user.email || '',
	      company: this.props.location.state.user.company || '',
	      position: this.props.location.state.user.position || '',
	    })
		}
		Dispatcher.dispatch({
			actionType: 'GetEnrollInfo',
			resource_id: this.props.match.params.id,
			resource_type: 3,
		})
		this._getEnrollInfo = EventCenter.on('GetEnrollInfoDone', this._handleEnrollInfo.bind(this))
		this._getReserveDone = EventCenter.on('OfflineReserveDone', this._handleOfflineReserveDone.bind(this))
		this._getPropToCenter = EventCenter.on('PropToCenter', this._handlePropToCenter.bind(this))
		this._backToOffline = EventCenter.on('BackToOffline', this._handleBackToOffline.bind(this))
		this._hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))
  }

  componentWillUnmount() {
		this._getEnrollInfo.remove()
		this._getReserveDone.remove()
		this._getPropToCenter.remove()
		this._backToOffline.remove()
		this._hideAlert.remove()
  }

	_handlePropToCenter() {
		this.props.history.push(`${__rootDir}/PgCenter`)
	}

	_handleHideAlert() {
		this.setState({
			isShow: false,
			name: '',
			phone: '',
			email: '',
			company: '',
			position: '',
			tel: ''
		})
	}

	_handleBackToOffline() {
		this.setState({
			isShow: false
		}, () => {
			this.props.history.go(-1)
		})
	}

	_handleEnrollInfo(re) {
		console.log(re)
		if(re && re.result && this.props.location.state.isReserved){
			var req = re.result
			this._isEnrollUser = req
			this.setState({
	      name: req.name || '',
	      phone: req.phone || '',
	      email: req.email || '',
	      company: req.company || '',
	      position: req.position || '',
				tel: req.tel || ''
	    })
		}
	}

	_handleOfflineReserveDone(re) {
		console.log("ZZZ",re)
		if(re && re.result) {
			if(re.result == true) {
				if(this.state.enroll_tab == 'mySelf') {
					this.setState({
						title: '您可以去个人中心查看报名信息。',
						rightButton: '点击查看',
						isShow: true,
					})
				} else if(this.state.enroll_tab == 'otherSelf') {
					this.setState({
						title: '您还继续帮别人提交报名信息吗?',
						rightButton: '继续报名',
						isShow: true
					})
				}
				return
			} else {
				alert(re.err)
			}
		} else {
			alert(re.err)
		}
	}

  _changeEnrollTab(type) {
    if(type == 'mySelf') {
			if(this.props.location.state.isReserved) {
				this.setState({
	        enroll_tab: 'mySelf',
	        name: this.state.name || this._isEnrollUser.name,
	        phone: this.state.phone || this._isEnrollUser.phone,
	        email: this.state.email || this._isEnrollUser.email,
	        company: this.state.company || this._isEnrollUser.company,
	        position: this.state.position || this._isEnrollUser.position,
	        tel: this.state.tel || this._isEnrollUser.tel,
	        nameErr: '',
	        phoneErr: '',
	        telErr: '',
	        emailErr: '',
	        companyErr: '',
	        positionErr: ''
	      })
			} else {
				this.setState({
	        enroll_tab: 'mySelf',
	        name: this._user.name || '',
	        phone: this._user.phone || '',
	        email: this._user.email || '',
	        company: this._user.company || '',
	        position: this._user.position || '',
	        tel: this._user.tel || '',
	        nameErr: '',
	        phoneErr: '',
	        telErr: '',
	        emailErr: '',
	        companyErr: '',
	        positionErr: ''
	      })
			}
    } else if(type == 'otherSelf'){
      this.setState({
        enroll_tab: 'otherSelf',
        name: '',
        phone: '',
        tel: '',
        email: '',
        company: '',
        position: '',
        nameErr: '',
        phoneErr: '',
        telErr: '',
        emailErr: '',
        companyErr: '',
        positionErr: ''
      })
    }
  }

  _check_name(event) {
    this.setState({
      name: event.target.value,
      nameErr: ''
    })
  }

  _check_phone(event) {
    this.setState({
      phone: event.target.value,
      phoneErr: ''
    })
  }

  _check_tel(event) {
    this.setState({
      tel: event.target.value,
      telErr: ''
    })
  }

  _check_email(event) {
    this.setState({
      email: event.target.value,
      emailErr: ''
    })
  }

  _check_company(event) {
    this.setState({
      company: event.target.value,
      companyErr: ''
    })
  }

  _check_position(event) {
    this.setState({
      position: event.target.value,
      positionErr: ''
    })
  }

	_check_name_type() {
		if(this.state.name == '') {
      this.setState({
        nameErr: '请输入姓名'
      })
    }
	}

	_check_phone_type() {

		// var phoneTest = /^1[3|4|5|7|8]\d{9}$/
		// if(this.state.phone == '' || !phoneTest.test(this.state.phone)) {
    //   this.setState({
    //     phoneErr: '请检查手机号'
    //   })
    // }
		if(this.state.phone == '' || !isCellPhoneAvailable(this.state.phone)) {
      this.setState({
        phoneErr: '请检查手机号'
      })
    }
	}

	_check_tel_type() {

		// var telTest = /^0\d{2,3}-\d{1,9}(-\d{0,9})?$/
		// if(this.state.tel != '' && !telTest.test(this.state.tel)) {
    //   this.setState({
    //     telErr: '请检查座机号'
    //   })
    // }
		if(this.state.tel != '' && !isTelCorrect(this.state.tel)) {
      this.setState({
        telErr: '请检查座机号'
      })
    }
	}

	_check_email_type() {
		// var _email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
		if(this.state.email == '' || !isEmailAvailable(this.state.email)) {
      this.setState({
        emailErr: '请检查邮箱格式'
      })
    }
	}

	_check_company_type() {
		if(this.state.company == '') {
      this.setState({
        companyErr: '请输入公司'
      })
    }
	}

	_check_position_type() {
		if(this.state.position == '') {
      this.setState({
        positionErr: '请输入职位'
      })
    }
	}

  _enroll(invited) {
    console.log(invited)
    Dispatcher.dispatch({
      actionType: 'OfflineReserve',
      resource_id: this.props.match.params.id,
      resource_type: 3,
      phone: this.state.phone,
      title: this.props.location.state.title,
      name: this.state.name,
      company: this.state.company,
      position: this.state.position,
      tel: this.state.tel,
      email: this.state.email,
      invited: invited
    })
  }

  _button() {
    var invited
    // var phoneTest = /^1[3|4|5|7|8]\d{9}$/
    // var _email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
		// var telTest = /^0\d{2,3}-\d{1,9}(-\d{0,9})?$/
    if(this.state.enroll_tab == 'mySelf') {
      invited = 0
    } else if (this.state.enroll_tab == 'otherSelf') {
      invited = 1
    }

    this._enroll(invited)
  }

	_hideBlackGround() {
		this.setState({
			isShow: false
		})
	}

  render() {

    var phoneColor = '#666'
    var phoneReadOnly
    var emColor = '#666'
    var emReadOnly
    var buttonColor
		var buttonDisabled
		var nameColor = '#666'
		var nameReadOnly
		var companyColor = '#666'
		var companyReadOnly
		var positionColor = '#666'
		var positionReadOnly
		var telColor = '#666'
		var telReadOnly
		// var phoneTest = /^1[3|4|5|7|8]\d{9}$/
    // var _email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
		// var telTest = /^0\d{2,3}-\d{1,9}(-\d{0,9})?$/
    if(this.props.location.state.user.phone != '' && this.state.enroll_tab == 'mySelf') {
      phoneColor = '#d1d1d1'
      phoneReadOnly = true
    } else {
      phoneColor = '#666'
      phoneReadOnly = false
    }
    if(this.props.location.state.user.email && this.state.enroll_tab == 'mySelf') {
      emColor = "#d1d1d1"
      emReadOnly = true
    } else {
      emColor = '#666'
      emReadOnly = false
    }
		if(this.props.location.state.isReserved && this.state.enroll_tab == 'mySelf') {
			phoneColor = '#d1d1d1'
	    phoneReadOnly = true
	    emColor = '#d1d1d1'
	    emReadOnly = true
			nameColor = '#d1d1d1'
			nameReadOnly = true
			companyColor = '#d1d1d1'
			companyReadOnly = true
			positionColor = '#d1d1d1'
			positionReadOnly = true
			telColor = '#d1d1d1'
			telReadOnly = true
		}

    if(this.state.name && this.state.phone && isCellPhoneAvailable(this.state.phone) && this.state.email && isEmailAvailable(this.state.email) && this.state.company && this.state.position) {
			if(this.state.tel != '' && isTelCorrect(this.state.tel)) {
				buttonColor = '#2196f3'
				buttonDisabled = false
			} else if(this.state.tel == '') {
				buttonColor = '#2196f3'
				buttonDisabled = false
			} else if(this.state.tel != '' && !isTelCorrect(this.state.tel)) {
				buttonColor = '#d1d1d1'
				buttonDisabled = true
			}
    } else{
      buttonColor = '#d1d1d1'
			buttonDisabled = true
    }
		if(this.props.location.state.isReserved && this.state.enroll_tab == 'mySelf') {
			buttonColor = '#d1d1d1'
			buttonDisabled = true
		}

    return(
      <div>
			<div style={{height: devHeight, width: devWidth, backgroundColor: '#000', opacity: 0.5, position: 'absolute', zIndex: 1, display: this.state.isShow ? 'block' : 'none'}} onClick={this._hideBlackGround.bind(this)}></div>
			<ReserveAlert isShow={this.state.isShow} title={this.state.title} rightButton={this.state.rightButton} type={this.state.enroll_tab}/>
        <div style={{height: 51, backgroundColor: "#fff"}}>
          <div style={{...styles.tab_div}}
            onClick={() => {this._changeEnrollTab('mySelf')}}
          >
            <span style={{color: this.state.enroll_tab === 'mySelf' ? '#2196f3' : '#999', fontSize: 15}}>自己报名</span>
            <hr style={{...styles.hr, borderColor: this.state.enroll_tab == 'mySelf' ? '#2196f3' : '#f3f3f3'}}></hr>
          </div>
          {/*<hr style={{width: window.screen.width/2, border: '1px solid', borderTop: 0, borderColor: '#2196f3'}}></hr>*/}
          <div style={{...styles.tab_div}}
            onClick={() => {this._changeEnrollTab('otherSelf')}}
          >
            <span style={{color: this.state.enroll_tab === 'otherSelf' ? '#2196f3' : '#999', fontSize: 15}}>帮别人报名</span>
            <hr style={{...styles.hr, borderColor: this.state.enroll_tab == 'otherSelf' ? '#2196f3' : '#f3f3f3'}}></hr>
          </div>
        </div>

        <div style={{backgroundColor: '#fff'}}>

          <div style={{height: 50, padding: '0px 12px'}}>
            {/*<div style={{...styles.img}}></div>*/}
						<img src={Dm.getUrl_img('/img/v2/icons/user-name@2x.png')} style={{...styles.img, height: 20, width: 20}}/>
            <span style={{...styles.title, color: nameColor}}>姓名</span>
            <input style={{...styles.input, color: nameColor}} value={this.state.name} onChange={this._check_name.bind(this)} onBlur={this._check_name_type.bind(this)} placeholder="请输入姓名(必填)" readOnly={nameReadOnly}></input>
          </div>
          <div style={{...styles.errMsg, display: this.state.nameErr ? 'inline' : 'none'}}>*{this.state.nameErr}</div>

          <hr style={{...styles.hr, width: '100%'}}></hr>

          <div style={{height: 50, padding: '0px 12px'}}>
            {/*<div style={{...styles.img}}></div>*/}
						<img src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} style={{...styles.img, height: 20, width: 15, marginRight: 13}}/>
            <span style={{...styles.title, color: phoneColor}}>手机</span>
            <input style={{...styles.input, color: phoneColor}} value={this.state.phone} onChange={this._check_phone.bind(this)} onBlur={this._check_phone_type.bind(this)} placeholder="请输入手机(必填)" readOnly={phoneReadOnly}></input>
          </div>
          <div style={{...styles.errMsg, display: this.state.phoneErr ? 'inline' : 'none'}}>*{this.state.phoneErr}</div>

          <hr style={{...styles.hr, width: '100%'}}></hr>

          <div style={{height: 50, padding: '0px 12px'}}>
            {/*<div style={{...styles.img}}></div>*/}
						<img src={Dm.getUrl_img('/img/v2/icons/tel@2x.png')} style={{...styles.img}}/>
            <span style={{...styles.title, color: telColor}}>座机</span>
            <input style={{...styles.input, color: telColor}} value={this.state.tel} onChange={this._check_tel.bind(this)} onBlur={this._check_tel_type.bind(this)} placeholder="格式: 021-12345678-1234" readOnly={telReadOnly}></input>
          </div>
          <div style={{...styles.errMsg, display: this.state.telErr ? 'inline' : 'none'}}>*{this.state.telErr}</div>

          <hr style={{...styles.hr, width: '100%'}}></hr>

          <div style={{height: 50, padding: '0px 12px'}}>
            {/*<div style={{...styles.img}}></div>*/}
						<img src={Dm.getUrl_img('/img/v2/icons/e-mail@2x.png')} style={{...styles.img, width: 18, height: 14, marginRight: 9, verticalAlign: 'middle'}}/>
            <span style={{...styles.title, color: emColor}}>电子邮箱</span>
            <input style={{...styles.input, color: emColor}} value={this.state.email} onChange={this._check_email.bind(this)} onBlur={this._check_email_type.bind(this)} placeholder="请输入邮箱(必填)" readOnly={emReadOnly}></input>
          </div>
          <div style={{...styles.errMsg, display: this.state.emailErr ? 'inline' : 'none'}}>*{this.state.emailErr}</div>

          <hr style={{...styles.hr, width: '100%'}}></hr>

          <div style={{height: 50, padding: '0px 12px'}}>
            {/*<div style={{...styles.img}}></div>*/}
						<img src={Dm.getUrl_img('/img/v2/icons/company@2x.png')} style={{...styles.img, height: 19}}/>
            <span style={{...styles.title, color: companyColor}}>公司</span>
            <input style={{...styles.input, color: companyColor}} value={this.state.company} onChange={this._check_company.bind(this)} onBlur={this._check_company_type.bind(this)} placeholder="请输入公司(必填)" readOnly={companyReadOnly}></input>
          </div>
          <div style={{...styles.errMsg, display: this.state.companyErr ? 'inline' : 'none'}}>*{this.state.companyErr}</div>

          <hr style={{...styles.hr, width: '100%'}}></hr>

          <div style={{height: 50, padding: '0px 12px'}}>
            {/*<div style={{...styles.img}}></div>*/}
						<img src={Dm.getUrl_img('/img/v2/icons/position@2x.png')} style={{...styles.img, height: 14, width: 18, verticalAlign: 'middle'}}/>
            <span style={{...styles.title, color: positionColor}}>职位</span>
            <input style={{...styles.input, color: positionColor}} value={this.state.position} onChange={this._check_position.bind(this)} onBlur={this._check_position_type.bind(this)} placeholder="请输入职位(必填)" readOnly={companyReadOnly}></input>
          </div>
          <div style={{...styles.errMsg, display: this.state.positionErr ? 'inline' : 'none'}}>*{this.state.positionErr}</div>

          <hr style={{...styles.hr, width: '100%', borderColor: '#e5e5e5'}}></hr>

        </div>

        <div style={{margin: '0 36px'}}>
  				<button style={{...styles.button, backgroundColor: buttonColor}} onClick={this._button.bind(this)} disabled={buttonDisabled}>提交</button>
  			</div>

      </div>

    )
  }
}

var styles = {
  tab_div: {
    width: devWidth/2,
    textAlign: 'center',
    display: 'inline-block',
    height: 50,
    lineHeight: '50px'
  },
  hr: {
    width: devWidth/2,
    border: '1px solid',
    borderTop: 0,
    borderColor: '#f3f3f3',
  },
  button: {
    backgroundColor: '#d1d1d1',
    borderRadius: 4,
    height: 45,
    width: devWidth-72,
    color: '#fff',
    border: 'none',
    fontSize: 15,
    marginTop: 40
  },
  img: {
    height: 17,
    width: 17,
    // border: '1px solid black',
    display: 'inline-block',
    verticalAlign: 'sub',
    marginRight: 10
  },
  input: {
    float: 'right',
    width: devWidth - 150,
    height: 50,
    border: 'none',
    textAlign: 'right',
    fontSize: 15,
    color: '#666'
  },
  title: {
    lineHeight: '50px',
    color: '#666',
    fontSize: 15
  },
  errMsg: {
    float:'right',
    position: 'relative',
    fontSize: 12,
    display: 'inline-block',
    height: 0,
    color: '#ff0000',
    top: '-18px',
    marginRight: 12
  }
}

export default PgOfflineEnroll;
