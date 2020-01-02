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
import MsgAlert from '../components/MsgAlert'
import NavigationS from '../components/navigations'
import newEnrollStyle from './newEnrollStyle'
var skip = 0
var countdown

/*
* 方法:Array.baoremove(dx)
* 功能:删除数组元素.
* 参数:dx删除元素的下标.
* 返回:在原数组上修改数组.
*/
Array.prototype.baoremove = function (dx) {
  if (isNaN(dx) || dx > this.length) { return false; }
  this.splice(dx, 1);
}
class PgConfirmenrollment extends React.Component {

  constructor(props) {
    super(props);
    var data = this.props.location.state.authData;
    this.authSingleCount = data.authSingleCount;
    this.freeNum = data.freeNum ? data.freeNum : 0;
    //头部信息显示
    this.top_title = this._Header(data);
    this.state = {
      authData: data,
      //单位
      unit: this.props.location.state.unit,
      //参课人列表
      companyUserList: [],
      //参课人数
      attend_num: 0,
      //剩余数
      left_num: this.props.location.state.left_num,
      isShow: false,
      alertTitle: '',
      checkNum: '',
      //弹框是否显示
      display: 'none',
      //弹框提示信息
      alert_title: '',
      alert_cont: '',
      //弹框的图标
      alert_icon: '',
      times: this.props.location.state.times,
      authUnit: false,
      isShowSubmit: false,
      isAlert: false,
      showMsgAlert: false,
      msgAlertTitle: '',
      msgAlertContent: '',
      msgAlertLeftText: '',
      msgAlertRightText: '',
      msgAlertOnLeft: null,
      msgAlertOnRight: null,
      navigation_display: localStorage.getItem("navigationDisplay"), //是否显示顶部导航
      scrollHeight: window.innerHeight - (localStorage.getItem("navigationDisplay") ? 174 : 134), //列表滚动高度
    }
    this.infoTitle = '确认报名名单';
  }

  componentWillMount() {

    // companyUserList: this.props.location.state.addCompanyUserList || [],
    //参课人数
    // attend_num: this.props.location.state.addCompanyUserList.length || 0,
    localStorage.removeItem('isDetail')
    // 当页刷新处理，需要获取正确的应扣和已选列表：修复之前刷新，删除的数据还存在的问题
    var _times = JSON.parse(localStorage.getItem('times'));
    if (_times != null) {
      this.setState({
        times: _times
      })
    }
    var _companyUserList = JSON.parse(localStorage.getItem('addCompanyUserList'));
    if (_companyUserList != null) {
      this.setState({
        companyUserList: _companyUserList,
        attend_num: _companyUserList.length
      })
    }
    Dispatcher.dispatch({
      actionType: 'getOfflineAuth',
      id: this.props.location.state.resource_id
    })

  }
  // filter 重复人员信息
  _filterPeople(_value) {
    if (_value) {
      var selectedList = JSON.parse(localStorage.getItem('addCompanyUserList'));
      for (var i = 0; i < selectedList.length; i++) {
        var current = selectedList[i];
        if (current.phone == _value || current.email == _value) {
          return current
        }
      }
      return { 'name': '' }
    }
  }
  _handleenrollDone(re) {
    console.log('_handleenrollDone===', re);
    var result = re.result || {}
    if (re.err) {
      var pList = result.phoneRepeatList
        , eList = result.emailRepeatList;
      if (pList || eList) {
        // 部分人员信息与已成功报名本课的学员重复
        this.setState({
          alert_cont: (() => {
            var res = {}
              , _list = [];
            if (pList) {
              _list = _list.concat(result.phoneRepeatList);
            }
            if (eList) {
              _list = _list.concat(result.emailRepeatList);
            }
            for (var i = 0; i < _list.length; i++) {
              var _peo = this._filterPeople(_list[i]);
              if (_peo.name) {
                var key = _peo.name + '&' + _peo.phone + '&' + _peo.email;
                res[key] = 1;
              }
            }
            var str = "";
            for (key in res) {
              str = str + key.split('&')[0] + " "
            }
            return str;
          })()
        })
      } else {
        this.setState({
          alert_cont: ""
        })
      }
      this.setState({
        display: 'block',
        alert_title: re.err,
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
      return;
    }

    if (this.state.authData.authFlag != 1) {
      //报名成功
      this.setState({
        display: 'block',
        alert_title: '报名成功',
        alert_icon: success_icon,
        icon_width: suc_widthOrheight,
        icon_height: suc_widthOrheight,
      }, () => {
        countdown = setInterval(() => {
          clearInterval(countdown);
          this.setState({
            display: 'none',
          }, () => {
            this._goBack()
          })
        }, 2000);
      })
      return;
    }
    else {
      //'申请提交成功',['本课为另收费课程，无法使用权益抵扣。','工作人员将于2个工作日内与您联系。'
      this.setState({
        isAlert: true,
      })
    }
  }
  _goBack() {
    //移除线下课报名本地存储数据
    localStorage.removeItem('initData');
    localStorage.removeItem('times');
    localStorage.removeItem('addCompanyUserList');
    // if (renderFromApp) {
    // 返回APP
    if (headersDatas && headersDatas.bolueclient == 'ios') {
      window.webkit.messageHandlers.close.postMessage('1')
    } else if (headersDatas && headersDatas.bolueclient == 'android') {
      // window.webkit.messageHandlers.close.postMessage('1')
    } else {
      // 返回微信线下课详情页
      this.props.history.push({ pathname: `${__rootDir}/lesson/offline/${this.props.location.state.resource_id}`, query: null, hash: null, state: null });
    }
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE", (!renderFromApp ? '铂略财课-' : '') + '确认报名');
    this._getenrollDone = EventCenter.on("enrollDone", this._handleenrollDone.bind(this))
    backFocuscompanyUserList = []
  }

  componentWillUnmount() {
    this._getenrollDone.remove()
  }
  //头部显示
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


  _check_invite() {
    var _title = '';
    var _content = '';
    var _leftText = '取消'
    var _RightText = '确认'
    if (this.state.authData.authFlag == 14) {
      //2.3.50新增  私享会券扣取弹窗二次确认
      _title = '确认通过';
      _content = `本次预计抵扣私享会券${this.state.times}张，点击确认后将进行权益扣除`;
    } else {
      var _isPayed = isPayed(this.state.authData.authFlag);
      var _isFree = isFree(this.state.authData.authFlag);
      //2.3.40 及以前版本
      if (_isPayed == false) {
        if (_isFree == false) {
          _title = '确认报名名单';
          _content = `当前已选${this.state.companyUserList.length}人，本次应扣${this.state.times}${this.state.unit},\n点击确认后将提交报名`;
        } else {
          _title = '确认报名名单';
          _content = `当前已选${this.state.companyUserList.length}人，本次应扣0点,\n点击确认后将提交报名`;
        }
      } else {
        _title = '确认报名名单';
        _content = '当前已选' + this.state.companyUserList.length + '人，\n点击确认后将提交报名申请';
      }
    }
    this.setState({
      showMsgAlert: true,
      msgAlertTitle: _title,
      msgAlertContent: _content,
      msgAlertLeftText: _leftText,
      msgAlertRightText: _RightText,
      msgAlertOnLeft: () => {
        this.setState({
          showMsgAlert: false,
        })
      },
      msgAlertOnRight: () => {
        this.setState({
          showMsgAlert: false,
        }, () => {
          this.Submitl();
        })
      }
    })
  }



  Submitl() {
    Dispatcher.dispatch({
      actionType: 'Enroll',
      main_holder: 1,
      enroll_info: this.state.companyUserList,
      resource_id: this.props.location.state.resource_id,
      user_type: 1,
      lesson_type: 1,
      outOfAuth: this.props.location.state.outOfAuth,
    })
  }
  del(index) {
    var authFlag = this.state.authData.authFlag;
    var _companyUserList, _delItemId, _phone;
    var _times = this.state.times;//扣除次数
    if (authFlag == 1 || authFlag == 10) {
      //付费课和免费课，没有点次
      _companyUserList = this.state.companyUserList || []
      _delItemId = _companyUserList[index]['id']
      _companyUserList.splice(index, 1)
      this.setState({
        //参课列表更新
        companyUserList: _companyUserList,
        attend_num: this.state.attend_num - 1,
        checkNum: '',
        isShow: false,
      })
    }
    else {
      var _freeNum = this.freeNum;//免费名额
      if (this.state.attend_num - 1 < _freeNum) {
        //参课人数小于免费名额，不扣点次
        _times = 0;
      }
      else {
        _times = _times - this.authSingleCount;
      }
      _companyUserList = this.state.companyUserList || [];
      _delItemId = _companyUserList[index]['id']
      _phone = _companyUserList[index]['phone']
      _companyUserList.splice(index, 1)
      this.setState({
        //参课列表更新
        companyUserList: _companyUserList,
        //参课人数
        attend_num: this.state.attend_num - 1,
        times: _times,
        checkNum: '',
        isShow: false,
      })
    }

    this._updateInitData(_delItemId, _phone, _times);

  }
  // 点击删除按钮，需要同步更新上一步的缓存数据
  _updateInitData(id, _phone, _times) {
    localStorage.setItem('addCompanyUserList', JSON.stringify(this.state.companyUserList));
    if (id || _phone) {
      var _people = JSON.parse(localStorage.getItem('initData'))
        , list = this._updateInitList(_people, id, _phone, false);
      //跳转页面前，先存储一下最新列表数据
      localStorage.setItem('times', _times)
      localStorage.setItem('initData', JSON.stringify(list));

    }
  }
  /*更新原始列表 from NewEnrollManyPeople 2019年8月13日10:04:40
  * params:this._people(原始列表)，_currentRow(当前选中或取消的一行)
  * isSelected：选中(true)或取消(false),最终返回更新后的列表
  */
  _updateInitList(_people, id, _phone, isSelected) {
    var isOK = !!0;
    for (var i = 0; i < _people.length; i++) {
      var item = _people[i]['data'] || [];
      for (var j = 0; j < item.length; j++) {
        var current = item[j] || {};
        // 新增了多条，id都是null，然后根据手机号更新

        if (id == null) {
          if (current.id == null && current.phone == _phone) {
            current.selected = isSelected;
            isOK = !!1;
            break;
          }
        } else if (current.id == id) {
          current.selected = isSelected;
          isOK = !!1;
          break;
        }
      }
      if (isOK) {
        break;
      }
    }
    /*_people.map((item) => {
      item.data.map((current) => {
      console.log('============================')
      console.log(id)
      console.log(current.id)
      // 新增了多条，id都是null，然后根据手机号更新
        if(id == null){
          if(current.phone == _phone) {
            current.selected = isSelected;
            return false;
          }
        }else if(current.id == id) {
          current.selected = isSelected;
          return false;
        }
      })
    })*/
    return _people;
  }
  delOrCancel(re) {
    this.setState({
      isShow: true,
      alertTitle: '确认移除此人吗？',
      checkNum: re
    })
  }
  cancel() {//取消方法
    this.setState({
      isShow: false,
      checkNum: ''
    })
  }
  cancelSummiy() {
    this.setState({
      isShowSubmit: false,
    })
  }
  countersignSubmit(re) {
    this.setState({
      isShowSubmit: false
    }, () => {
      this.Submitl()
    })
  }
  countersign() {//确认方法
    this.del(this.state.checkNum)
  }
  render() {
    var companyUserList = this.state.companyUserList.map((it, index) => {
      return (
        <div key={index} style={{ ...newEnrollStyle.offline_ul__li }}>
          <span style={{ ...newEnrollStyle.offline_ul__li__item, ...newEnrollStyle.offline_ul__li__name }}>{it.name}</span>
          <span style={{ ...newEnrollStyle.offline_ul__li__item, ...newEnrollStyle.offline_ul__li__email, ...newEnrollStyle.ft12 }}>{it.email}</span>
          <span style={{ ...newEnrollStyle.offline_ul__li__item, ...newEnrollStyle.offline_ul__li__phone, ...newEnrollStyle.ft12 }}>{it.phone}</span>
          <span style={{ ...newEnrollStyle.offline_ul__li__item, ...newEnrollStyle.offline_ul__li__del, ...newEnrollStyle.fr }} onClick={this.delOrCancel.bind(this, index)}></span>
          <span style={{ ...newEnrollStyle.clearfix_after }}></span>
        </div>
      )
    })

    var _data = this.state.authData;
    var _isPayed = isPayed(_data.authFlag);
    var _isFree = isFree(_data.authFlag);
    return (
      <div style={{ ...newEnrollStyle.p_offline }}>
        <NavigationS isShow={this.state.navigation_display} titles={"确认报名"} />
        <div style={{ ...newEnrollStyle.left_feiInfo }}>
          {this.top_title}
        </div>
        <div style={{ ...newEnrollStyle.bgfff, ...newEnrollStyle.offline_ul, ...newEnrollStyle.mt10, height: this.state.scrollHeight }}>
          {companyUserList}
        </div>
        <div style={{ ...newEnrollStyle.bgfff, ...newEnrollStyle.bottom }}>
          {this.state.authData.authFlag == 14 ?
            <div style={{ ...newEnrollStyle.left_rights, ...newEnrollStyle.disFlex }}>
              <div style={{ ...newEnrollStyle.left_rights__left }}>
                <img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width="15" height="17" />
                您目前剩余券<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this.state.authData.privClubTicket}</i>张，本次应扣<i style={{ ...newEnrollStyle.c_orang, ...newEnrollStyle.left_rights_i }}>{this.state.times}</i>张
                </div>
              <div style={{ ...newEnrollStyle.left_rights__right }}>
                <img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width="18" height="18" />
                已选<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this.state.attend_num}</i>人
                </div>
            </div>
            :
            <div style={{ ...newEnrollStyle.left_rights }}>
              {_isPayed == true || _isFree == true || (_data.num == null && _data.point == null) ?
                <div><img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width="18" height="18" />
                  已选<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this.state.attend_num}</i>人</div>
                :
                <div style={{ ...newEnrollStyle.disFlex }}>
                  <div style={{ ...newEnrollStyle.left_rights__left }}>
                    <img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width="15" height="17" />
                    您目前剩余<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this.state.left_num}</i>{this.state.unit}，本次应扣<i style={{ ...newEnrollStyle.c_orang, ...newEnrollStyle.left_rights_i }}>{this.state.times}</i>{this.state.unit}
                  </div>
                  <div style={{ ...newEnrollStyle.left_rights__right }}>
                    <img style={{ ...newEnrollStyle.left_rights_img }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width="18" height="18" />
                    已选<i style={{ ...newEnrollStyle.c_blue, ...newEnrollStyle.left_rights_i }}>{this.state.attend_num}</i>人
                  </div>
                </div>
              }
            </div>
          }
          <div style={{ ...newEnrollStyle.bottom__operate }}>
            {
              this.state.companyUserList.length > 0 ?
                <span onClick={this._check_invite.bind(this)} style={{ ...newEnrollStyle.operate__dis_ib, ...newEnrollStyle.operate__next_step }}>提交</span>
                :
                <span style={{ ...newEnrollStyle.operate__dis_ib, ...newEnrollStyle.operate__next_step_disable }}>提交</span>
            }
          </div>
        </div>
        <div style={{ ...styles.zzc, display: this.state.showMsgAlert ? 'block' : 'none' }}></div>
        <MsgAlert
          title={this.state.msgAlertTitle}
          content={this.state.msgAlertContent}
          isShow={this.state.showMsgAlert}
          leftText={this.state.msgAlertLeftText}
          rightText={this.state.msgAlertRightText}
          onClickLeft={this.state.msgAlertOnLeft}
          onClickRight={this.state.msgAlertOnRight} />

        <div style={{ ...styles.zzc, display: this.state.isShow ? 'block' : 'none' }}></div>
        <div style={{ ...styles.alert, display: this.state.isShow ? 'block' : 'none' }}>
          <div style={{ ...styles.alertFirstDiv }}>
            <div style={{ width: 242, marginLeft: 14, height: 50, marginTop: 18, position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: 17, color: '#030303', }}>
                {this.state.alertTitle}
              </span>
            </div>
          </div>
          <div>
            <div style={{ ...styles.alertSecond, width: 134 }} onClick={this.cancel.bind(this)}>
              <span style={{ fontSize: 17, color: '#2196f3' }}>取消</span>
            </div>
            <div style={{ ...styles.alertSecond, border: 'none' }} onClick={this.countersign.bind(this)}>
              <span style={{ fontSize: 17, color: '#2196f3' }}>确定</span>
            </div>
          </div>
        </div>
        <div style={{ ...styles.zzc, display: this.state.isShowSubmit ? 'block' : 'none' }}></div>
        <div style={{ ...styles.alert, display: this.state.isShowSubmit ? 'block' : 'none' }}>
          <div style={{ ...styles.alertFirstDiv }}>
            <div style={{ width: 242, marginLeft: 14, height: 50, marginTop: 18, position: 'absolute', textAlign: 'center' }}>
              {this.state.alertSubmiyTitle}
            </div>
          </div>
          <div>
            <div style={{ ...styles.alertSecond, width: 134 }} onClick={this.cancelSummiy.bind(this)}>
              <span style={{ fontSize: 17, color: '#2196f3' }}>取消</span>
            </div>
            <div style={{ ...styles.alertSecond, border: 'none' }} onClick={this.countersignSubmit.bind(this)}>
              <span style={{ fontSize: 17, color: '#2196f3' }}>确定</span>
            </div>
          </div>
        </div>
        {/*弹框*/}
        <div style={{ ...Common.alertDiv, display: this.state.display, width: '80%', left: '50%', marginLeft: "-40%", height: "auto" }}>
          <div style={{ padding: "20px 15px" }}>
            {
              this.state.alert_cont ?
                <div>
                  {this.state.alert_title.slice(0, 12)} <br /> {this.state.alert_title.slice(12)}
                </div>
                :
                this.state.alert_title
            }<br />{this.state.alert_cont}
          </div>
        </div>

        <div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.isAlert ? 'block' : 'none' }}>
          <div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>申请提交成功</div>
          <div style={styles.alert_conts}>
            本课为另收费课程，无法使用权益抵扣。
            <div>工作人员将于2个工作日内与您联系。</div>
          </div>
          <div style={styles.alert_bottom}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Normal, }} onClick={this._goBack.bind(this)}>知道了</div>
          </div>
        </div>
        <div style={{ ...styles.zzc, display: this.state.isAlert ? 'block' : 'none' }}></div>


      </div>

    )
  }
}

var styles = {
  container: {
    height: devHeight,
    backgroundColor: '#ffffff'
  },
  top: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input_box: {
    width: devWidth - 67,
    height: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    float: 'left',
  },
  input: {
    width: devWidth - 120,
    height: 20,
    lineHeight: '20px',
    marginTop: 5,
    border: 'none',
    float: 'left',
    fontSize: Fnt_Small,
  },
  btn_search: {
    fontSize: Fnt_Normal,
    color: Common.Activity_Text,
    float: 'right',
    border: 'none',
    height: 30,
    lineHeight: '30px',
    backgroundColor: Common.Bg_White,
  },
  content: {
    height: devHeight - 135,
    overflowY: 'auto',
  },
  title: {
    color: '#000',
    fontSize: 14,
    marginTop: 30,
  },

  line: {
    width: devWidth - 24,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  companyUserDiv: {
    width: devWidth,
    backgroundColor: '#ffffff',
    height: 45,
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  },
  companyUsersInfoDiv: {
    height: 45,
    lineHeight: '45px',
    fontSize: 12,
    color: '#999999',
  },
  LineClamp: {
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    height: 45,
    lineHeight: '45px'
  },
  bottomDiv: {
    width: devWidth,
    height: 114,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    lineHeight: 3
  },
  bottomFirstDiv: {
    height: 50,
    width: devWidth,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    borderTopStyle: 'solid'
  },
  alert: {
    width: 270,
    height: 145,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    position: 'absolute',
    top: 211,
    zIndex: 999,
    left: (devWidth - 270) / 2
  },
  alertFirstDiv: {
    width: 270,
    height: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D4D4D4',
    borderBottomStyle: 'solid',
    // padding:'20px 14px 0px 14px'
  },
  alertSecond: {
    width: 135,
    height: 45,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D4D4D4',
    borderRightStyle: 'solid',
    float: 'left',
    lineHeight: 3
  },
  zzc: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#000',
    position: 'absolute',
    opacity: 0.3,
    zIndex: 998,
    top: 0,
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
  white_alert: {
    width: devWidth - 100,
    // height: 155,
    backgroundColor: Common.Bg_White,
    borderRadius: 12,
    position: 'absolute',
    zIndex: 999,
    top: devHeight / 2,
    left: 50,
    marginTop: -65,
    textAlign: 'center',
  },
  alert_bottom: {
    // position: 'absolute',
    // zIndex: 999,
    // bottom: 0,
    // left: 0,
    width: devWidth - 100,
    height: 42,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    display: 'flex',
    flex: 1,
  },
  alert_conts: {
    padding: '10px 12px 20px',
    fontSize: Fnt_Normal,
    lineHeight: '20px'
  },
}


export default PgConfirmenrollment;