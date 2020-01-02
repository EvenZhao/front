import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import { dm } from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'
import { isPayed, isFree, unit, getTitle } from '../util/OfflineEnrollUtil'
import NavigationS from '../components/navigations'
import newEnrollStyle from './newEnrollStyle'
import CHECK from '../components/checkListInfo'
import { Z_FIXED } from 'zlib';

var width = window.screen.width
var countdown
class PgOfflineAddEnroll extends React.Component {

  constructor(props) {
    super(props);

    this._id = props.location.state.id;

    var data = this.props.location.state.param
    //单次
    this._authSingleCount = data.authSingleCount;
    //剩余点/次
    this._left = this.props.location.state.left_num;
    //单位
    this._unit = this.props.location.state.unit;
    //头部信息显示
    this.top_title = this._Header(data);

    this._isPayed = isPayed(data.authFlag);
    this._isFree = isFree(data.authFlag);
    this.state = {
      usedNum: 0,
      name: '',
      phone: '',
      position: '',
      email: '',
      display: 'none',
      authFlag: data.authFlag,
      authData: data,
      navigation_display: localStorage.getItem("navigationDisplay") || false, //是否显示顶部导航
      scrollHeight: 314,
      boderS1: false,
      boderS2: false,
      boderS3: false,
    };
    this._showBottom = true;
    if (data.num == null && data.point == null) {
      this._showBottom = false;
    }
  }

  componentWillMount() {
    this.setState({
      scrollHeight: window.innerHeight - (this.state.navigation_display ? 314 : 274) + (this._isPayed == false && this._isFree == false && this._showBottom ? 0 : 40)
    })
    localStorage.removeItem('isDetail');
    EventCenter.emit("SET_TITLE", (!renderFromApp ? '铂略财课-' : '') + '新增名单外报名');
  }

  componentDidMount() {

    //针对安卓机，键盘遮挡输入框滚动页面
    // if(!isApp){
    //   // 移动web捕获虚拟键盘弹出和关闭事件，一般用于input获取焦点弹出虚拟键盘，同时调整可是范围。以下js可以实现此效果：
    // 	var wHeight = window.innerHeight;   //获取初始可视窗口高度
    // 	window.onresize = function() {         //监测窗口大小的变化事件
    // 		var resizeHeight = window.innerHeight;     //当前可视窗口高度
    // 		var viewTop = document.body.scrollTop || document.documentElement.scrollTop;    //可视窗口高度顶部距离网页顶部的距离
    // 		if(wHeight > resizeHeight){//可以作为虚拟键盘弹出事件
    // 	   //调整可视页面的位置
    // 			document.body.scrollTop = viewTop + 300;
    // 		}else{ //可以作为虚拟键盘关闭事件
    // 			document.body.scrollTop = viewTop - 300;
    // 		}
    // 	  wHeight = resizeHeight;
    // 	}
    // }

  }

  componentWillUnmount() {
    clearInterval(countdown);
    // if(!isApp){
    //   window.onresize = '';
    // }
  }
  _onfocusI(i) {
    var o = {};
    o['boderS' + i] = true;
    this.setState(o)
  }
  _onblurI(i) {
    var o = {};
    o['boderS' + i] = false;
    this.setState(o)
  }
  //头部显示文案
  _Header(_data) {
    var _titleView = null;
    var _isPayed = isPayed(_data.authFlag);
    var _isFree = isFree(_data.authFlag);
    var _unit = unit(_data.authFlag);
    var _getTitle = getTitle(_isPayed, _isFree, _unit, _data)
    if (_data.authFlag == 14) {
      //2.3.50版本 14为私享会券充足
      _titleView = "本课为私享会课程，参与需抵扣私享会券 1张/人"
    } else {
      //2.3.40以前版本
      if (_isPayed == true) {
        //请提交本次参与员工信息，已便我们尽快联系您跟进后续报名事宜
        _titleView = "请提交本次参与员工信息，以便我们尽快联系您跟进后续报名事宜。"
      } else {
        if (_isFree == true) {
          //本课程剩余免费席位x人
          _titleView = "本课剩余免费席位" + _data.freeNum + "人"
        } else {
          if (_data.authFlag != 7 && _data.authFlag != 8) {
            //本课程剩余免费席位x人。。。。。。超出后抵扣。。。。
            _titleView = "本课剩余免费席位" + _data.freeNum + "人" + _getTitle
          } else {
            //本课程共/实际抵扣
            _titleView = _getTitle
          }
        }
      }
    }
    return _titleView;
  }
  checkName(e) {
    e.preventDefault()
    var v = e.target.value.trim();
    this.setState({
      name: v
    })
  }
  checkPhone(e) {
    e.preventDefault()
    var v = e.target.value.trim();
    this.setState({
      phone: v
    })
  }
  checkEmail(e) {
    e.preventDefault()
    var v = e.target.value.trim();
    this.setState({
      email: v
    })
  }


  submit() {
    if (!isCellPhoneAvailable(this.state.phone)) {
      this.setState({
        display: 'block',
        alert_title: '请输入合法的手机号',
        alert_icon: failure_icon,
        icon_width: failure_width,
        icon_height: failure_height,

      }, () => {
        countdown = setInterval(() => {
          clearInterval(countdown);
          this.setState({
            display: 'none',
          })
        }, 2000);
      });

      return false;
    }

    if (!isEmailAvailable(this.state.email)) {
      this.setState({
        display: 'block',
        alert_title: '请输入合法的邮箱',
        alert_icon: failure_icon,
        icon_width: failure_width,
        icon_height: failure_height,

      }, () => {
        countdown = setInterval(() => {
          clearInterval(countdown);
          this.setState({
            display: 'none',
          })
        }, 2000);
      });

      return false;
    }
    if (this.state.name && this.state.phone && this.state.email) {
      var _data = {
        id: null,
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        status: 0,
        selected: false,
        actType: 3
      }
      var _people = JSON.parse(localStorage.getItem('initData'));
      var selectedList = JSON.parse(localStorage.getItem('addCompanyUserList'));
      var sInfo = CHECK.selectedList(selectedList, _people, _data);
      if (sInfo.alert_cont) {
        this.setState({
          display: 'block',
          alert_title: sInfo.alert_title,
          alert_email: sInfo.alert_cont,
          alert_icon: null,
        })
        setTimeout(() => {
          this.setState({
            display: 'none',
          })
        }, 2000)
        return false;
      }
      this.setState({
        display: 'block',
        alert_title: '提交成功',
        alert_icon: success_icon,
        icon_width: suc_widthOrheight,
        icon_height: suc_widthOrheight,
      }, () => {
        if (_people[0].section != "新增") {
          // 置顶显示
          _people.splice(0, 0, { section: '新增', data: [_data], })
        }
        else {
          _people[0].data.push(_data);
        }
        localStorage.setItem('initData', JSON.stringify(_people));
        setTimeout(() => {
          this.setState({
            display: 'none',
          }, () => {
            this.props.history.push({
              pathname: `${__rootDir}/NewEnrollManyPeople`,
              query: null,
              hash: null,
              state: {
                data: _data,
                id: this.props.location.state.id
              }
            });

          })
        }, 2000);
      })
    }

  }
  _labelScorll(re) {
    if ((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) < document.documentElement.clientHeight) {

    }
  }

  render() {
    return (
      <div style={{ ...styles.container }}>
        <NavigationS isShow={this.state.navigation_display} titles={"新增名单外报名"} />
        <div style={{ ...newEnrollStyle.left_feiInfo }}>
          {this.top_title}
        </div>
        <div style={{ ...newEnrollStyle.bgfff }}>
          <div style={{ ...styles.input_box, borderBottomColor: this.state.boderS1 ? '#2196F3' : '#f3f3f3' }}>
            <span style={{ ...newEnrollStyle.dis_ib, width: 40, height: 50, textAlign: 'center' }}><img src={Dm.getUrl_img('/img/v2/icons/addEnrollperson@2x.png')} width={12} height={12} /></span>
            <span style={{ fontSize: 15, color: '#333333' }}>姓名</span>
            <input onFocus={this._onfocusI.bind(this, 1)} onBlur={this._onblurI.bind(this, 1)} onChange={this.checkName.bind(this)} style={{ ...styles.input }} type="text" placeholder="请输入姓名" value={this.state.name} />
          </div>
          <div style={{ ...styles.input_box, borderBottomColor: this.state.boderS2 ? '#2196F3' : '#f3f3f3' }}>
            <span style={{ ...newEnrollStyle.dis_ib, width: 40, height: 50, textAlign: 'center' }}><img src={Dm.getUrl_img('/img/v2/icons/addEnrollPhone@2x.png')} width={12} height={12} /></span>
            <span style={{ fontSize: 15, color: '#333333' }}>手机</span>
            <input onFocus={this._onfocusI.bind(this, 2)} onBlur={this._onblurI.bind(this, 2)} onChange={this.checkPhone.bind(this)} style={{ ...styles.input }} type="number" value={this.state.phone} placeholder="请输入手机号" />
          </div>
          <div style={{ ...styles.input_box, borderBottomColor: this.state.boderS3 ? '#2196F3' : '#f3f3f3' }}>
            <span style={{ ...newEnrollStyle.dis_ib, width: 40, height: 50, textAlign: 'center' }}><img src={Dm.getUrl_img('/img/v2/icons/addEnrollEmail@2x.png')} width={14} height={11} /></span>
            <span style={{ fontSize: 15, color: '#333333' }}>邮箱</span>
            <input onFocus={this._onfocusI.bind(this, 3)} onBlur={this._onblurI.bind(this, 3)} onChange={this.checkEmail.bind(this)} style={{ ...styles.input }} type="text" value={this.state.email} placeholder="请输入电子邮箱" />
          </div>
        </div>
        <div style={{ height: this.state.scrollHeight, overflow: 'hidden' }}></div>
        {/*底部显示*/}
        <div style={{ ...newEnrollStyle.bgfff, ...newEnrollStyle.bottom }}>
          {this.state.authFlag == 14 ?
            <div style={{ ...newEnrollStyle.left_rights, ...newEnrollStyle.disFlex }}>
              <div style={{ ...newEnrollStyle.left_rights__left, flex: 1 }}>
                <img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width="15" height="17" />
                您目前剩余券<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this.state.authData.privClubTicket}</i>张，本次应扣<i style={{ ...newEnrollStyle.c_orang, ...newEnrollStyle.left_rights_i }}>{this.state.authData.authSingleCount}</i>张
              </div>
            </div>
            :
            <div>
              {this._isPayed == false && this._isFree == false && this._showBottom ?
                <div style={{ ...newEnrollStyle.left_rights }}>
                  <div style={{ ...newEnrollStyle.left_rights__left }}>
                    <img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width="15" height="17" />
                    您目前剩余<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this._left}</i>{this._unit}，本次应扣<i style={{ ...newEnrollStyle.c_orang, ...newEnrollStyle.left_rights_i }}>{this._authSingleCount}</i>{this._unit}
                  </div>
                </div>
                :
                null
              }
            </div>
          }
          <div style={{ ...newEnrollStyle.bottom__operate }}>
            {this.state.name && this.state.phone && this.state.email ?
              <span style={{ ...newEnrollStyle.operate__dis_ib, ...newEnrollStyle.operate__next_step }} onClick={this.submit.bind(this)}>提交</span>
              :
              <span style={{ ...newEnrollStyle.operate__dis_ib, ...newEnrollStyle.operate__next_step_disable }}>提交</span>
            }
          </div>
        </div>

        {/*弹框*/}
        {this.state.alert_icon ?
          <div style={{ ...Common.alertDiv, display: this.state.display }}>
            <div style={{ marginBottom: 14, paddingTop: 15, height: 30, }}>
              <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height} />
            </div>
            <span style={{ color: Common.BG_White }}>{this.state.alert_title}</span>
          </div>
          :
          <div style={{
            ...Common.alertDiv, display: this.state.display, width: '80%', left: '50%', marginLeft: "-40%", height: "auto"
          }}>
            <div style={{ color: Common.BG_White, padding: "20px 15px" }}>{this.state.alert_title}<br />{this.state.alert_email}重复，请修改</div>
          </div>
        }
      </div>
    )
  }
}

var styles = {
  container: {
    fontSize: '14px',
    height: window.innerHeight,
    // backgroundColor: 'red'
    /* position: 'fixed',
    zIndex: 10,
    left: 0,
    top: 0,
    width: window.screen.width,
    height: window.innerHeight,
    overflow: 'hidden' */
  },
  freeDiv: {
    width: window.screen.width,
    height: 28,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64BAFF',
    fontSize: 12,
    color: '#ffffff'
  },
  top: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input_box: {
    // width: width,
    margin: '0 10px',
    height: 49,
    lineHeight: '50px',
    borderBottom: '1px solid #f3f3f3'
  },
  input: {
    width: width - 140,
    border: 'none',
    height: 22,
    // padding: '5px 15px 5px 5px',
    // marginTop: '9px',
    lineHeight: '22px',
    fontSize: 12,
    color: '#333',
    marginLeft: '15px',
    // textAlign: 'right',
    // float: 'right',
  },

}


export default PgOfflineAddEnroll;
