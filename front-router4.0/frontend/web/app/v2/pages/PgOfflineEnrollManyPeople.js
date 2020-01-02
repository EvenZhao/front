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
import ResultAlert from '../components/ResultAlert'
import { isPayed, isFree, unit, getTitle } from '../util/OfflineEnrollUtil'

var countdown;
class PgOfflineEnrollManyPeople extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //所有员工信息
      companyUsers: [],
      //权益数据
      authData: {},
      //参课人数
      attend_num: 0,
      //扣除次数
      times: 0,
      //单位
      unit: '',
      //剩余点/次
      left_num: 0,
      //免费
      freeNum: 0,
      //搜索框是否清除关键字的标识
      isClear: false,
      //搜索条件
      // filterText:'',
      //判断是否已报名,显示对应提示信息
      isShowUsed: false,
      //已报名人姓名
      name: '',
      //权益不足时弹出弹框
      isAuthShow: false,
      //是否超额，记录权益不足传给后台
      outOfAuth: false,
      //是否显示遮罩层
      isShow: false,
      //提示信息的标题
      title: '',
      //返回提示信息
      msgInfo: '',
      phone: '',
      email: '',
      //是否显示提示输入手机号弹框
      phoneAlert: false,
      //是否显示提示输邮箱弹框
      emailAlert: false,
      //当输入手机号或者邮箱错误的时候提醒再次输入
      isAgin: false,
      //区分提示输入手机号还是邮箱的标题
      diffTitle: '',
      //再次输入手机号或者邮箱的提示文案
      infoTitle: '',
    }
    //过滤条件
    this.filterText = ''
    //用来存储原始列表
    this._people = []
    // this.authData = {}
    //被选中员工信息id
    // this.ids = []
    //被选中的员工信息列表集合
    this.selectedList = []
    //index、idx用于记录被选中行在数组中的位置
    this.index = null;
    this.idx = null;
  }

  componentWillMount() {
    EventCenter.emit("SET_TITLE", '铂略财课-线下课报名');
    //isDetail:true 表示从线下课详情页跳转过来
    if (localStorage.getItem('isDetail')) {
      Dispatcher.dispatch({
        actionType: 'getCompanyUsers',
        resource_id: this.props.location.state.id,
      })
    }
    else {//可能是新增页或者确认页过来，取本地存储数据
      if (JSON.parse(localStorage.getItem('initData'))) {
        this._people = JSON.parse(localStorage.getItem('initData'));
        this.selectedList = this._filter(this._people);
        this.setState({
          companyUsers: this._people,
          attend_num: this.selectedList.length,
        })
      }
      var _tiems = 0;
      if (JSON.parse(localStorage.getItem('times'))) {
        _tiems = JSON.parse(localStorage.getItem('times'));
        this.setState({
          times: _tiems
        })
      }
    }

    Dispatcher.dispatch({
      actionType: 'getOfflineAuth',
      id: this.props.location.state.id,
      type: 'newEnroll'
    })
    //获取员工信息
    this.e_getCompanyUsers = EventCenter.on('getCompanyUsersDone', this._handleGetCompanyUsersDone.bind(this))
    //获取线下课报名权限
    this._OffgetOfflineAuth = EventCenter.on("getOfflineAuthNewEnrollDone", this._handlegetOfflineAuthDone.bind(this))
  }
  componentDidMount() {
  }

  componentWillUnmount() {
    this.e_getCompanyUsers.remove()
    this._OffgetOfflineAuth.remove()
    clearTimeout(countdown)
  }

  //获取员工信息
  _handleGetCompanyUsersDone(re) {
    console.log('_handleGetCompanyUsersDone：', re);
    if (re.err) {
      return;
    }
    //首次加载数据，放入本地存储，便于新增数据合并
    this._people = re.result.companyUsers;
    this._people.map((item, index) => {
      item.data.map((currentItem, currentIndex) => {
        currentItem['selected'] = false
      })
    })
    this.setState({
      companyUsers: this._people
    })
  }

  //获取权益
  _handlegetOfflineAuthDone(re) {
    console.log('_handlegetOfflineAuthDone==', re);
    if (!re || re.err) {
      return;
    }
    var result = re.result
    //msgInfo是后台返的各种情况下给出的提示文案
    if (result.msgInfo) {//有错误信息
      this.setState({
        isAuthShow: true,
        outOfAuth: result.title == '权益不足' ? true : false,//提交报名的时候通知后台权益不足给销售发短信
        title: result.title,
        msgInfo: result.msgInfo,
        isShow: true,
      })
      return;
    }

    if (result.data) {
      var data = result.data;
      var authFlag = data.authFlag;
      var _unit = '';//单位
      if (authFlag == 5 || authFlag == 7) {//点
        _unit = '点'
      }
      else if (authFlag == 6 || authFlag == 8) {
        _unit = '次'
      }
      //剩余点/次的数量
      //剩余的点跟次不会共存，二者只会出现一种情况
      var _left = data.num;
      if (_left == null) {
        _left = data.point;
      }
      if (_left == null) {
        _left = 0
      }

      //参课人数
      var _attend_num = this.state.attend_num;
      //扣点扣次的数量
      var _times = this.state.times;
      //免费名额
      var _freeNum = result.data.freeNum;

      if (this.index != null) {
        //勾选后，index值不为null，避免第一行默认选中
        //可以报名
        //需要判断手机跟邮箱，如果为空就补全
        var _phone = this.state.companyUsers[this.index].data[this.idx].phone;
        var _email = this.state.companyUsers[this.index].data[this.idx].email;
        if (!_phone) {
          this.setState({
            phoneAlert: true,
            isShow: true,
          })
          return;
        }
        else if (!_email) {
          this.setState({
            emailAlert: true,
            isShow: true,
          })
          return;
        }

        //取得当前勾选这一行的标识
        var _currentRow = this.state.companyUsers[this.index].data[this.idx];
        var _selected = this.state.companyUsers[this.index].data[this.idx].selected
        //authFlag为(1、10)表示付费课或者免费课，没有点次，只需要记录参课人数，不扣点次
        if (authFlag == 1 || authFlag == 10) {
          // _attend_num = this.state.attend_num;//参课人数
          if (!_selected) {//勾选
            //每次勾选的时候，当前勾选上这行的id
            _attend_num = _attend_num + 1;
            //更新原始列表
            this._people = this._updateInitList(this._people, _currentRow, true);
            _selected = true
          }
          this.state.companyUsers[this.index].data[this.idx].selected = _selected
          //过滤列表筛选出已勾选的，便于判断“下一步”按钮是否高亮
          this.selectedList = this._filter(this.state.companyUsers);
        }
        else {
          // _attend_num = this.state.attend_num;//参课人数
          _times = this.state.times;//扣点、次的次数
          _freeNum = data.freeNum ? data.freeNum : 0;

          if (!_selected) {//勾选
            //每次勾选的时候，当前勾选上这行的id
            _attend_num = _attend_num + 1;
            if (_attend_num > _freeNum) {
              //参课人数大于免费次数，才扣点或者次
              _times = _times + data.authSingleCount;
            }
            //更新原始列表
            this._people = this._updateInitList(this._people, _currentRow, true);
            _selected = true
          }
          this.state.companyUsers[this.index].data[this.idx].selected = _selected;
          //过滤列表筛选出已勾选的，便于判断“下一步”按钮是否高亮
          this.selectedList = this._filter(this.state.companyUsers);
        }
      }
      this.setState({
        unit: _unit,
        left_num: _left,
        title: result.title,
        msgInfo: result.msgInfo,
        authData: data,
        attend_num: _attend_num,
        companyUsers: this.state.companyUsers,
        times: _times,
        freeNum: _freeNum,
      })
    }
  }

  //获取输入框value
  _onChange(e) {
    e.preventDefault();
    var text = e.target.value.trim();
    var _isClear = false;
    if (text) {
      _isClear = true;
    }
    this.filterText = text;
    this.setState({
      isClear: _isClear
    })
  }
  //清空输入框
  _Clear() {
    this.filterText = ''
    this.setState({
      isClear: false
    })
  }

  //搜索
  search() {
    //判断是否输入了搜索条件
    if (!this.filterText) {
      //加载所有列表
      this.setState({
        companyUsers: this._people,
      })
      return;
    }
    var text = this.filterText
    var _people = [];//用于存储匹配关键字的数据
    this._people.map((item, index) => {
      var _data = item.data.filter(function (currentValue) {
        return currentValue.name.indexOf(text) >= 0
      })
      if (_data.length > 0) {
        var _temp = {
          section: item.section,
          data: _data,
        }
        _people.push(_temp)
      }
    })
    this.setState({
      companyUsers: _people
    })
  }
  //已参与报名的提示
  _AttendInfo(name) {
    this.setState({
      isShowUsed: true,
      name: name
    }, () => {
      countdown = setTimeout(() => {
        this.setState({
          isShowUsed: false
        });
      }, 1500);
    })
  }

  //新增员工
  _onAdd() {
    var authFlag = this.state.authData.authFlag;
    //跳转页面前，先存储一下最新列表数据
    localStorage.setItem('initData', JSON.stringify(this._people));
    localStorage.setItem('times', JSON.stringify(this.state.times))
    this.props.history.push({
      pathname: `${__rootDir}/PgOfflineAddEnroll`,
      query: null,
      hash: null,
      state: {
        param: this.state.authData,
        id: this.props.location.state.id,
        unit: this.state.unit,
        left_num: this.state.left_num,
      }
    })

  }

  /*更新原始列表
  * params:this._people(原始列表)，_currentRow(当前选中或取消的一行)
  * isSelected：选中(true)或取消(false),最终返回更新后的列表
  */
  _updateInitList(_people, _currentRow, isSelected) {
    _people.map((item) => {
      item.data.map((current) => {
        if (current == _currentRow) {
          current.selected = isSelected;
        }
      })
    })
    return _people;
  }

  //选择员工进行报名
  _onSelected(index, idx) {
    this.index = index;
    this.idx = idx;
    var _currentRow = this.state.companyUsers[index].data[idx];
    if (_currentRow.selected) {//取消勾选的时候不需发送请求
      //更新this._people,这样原始列表的数据状态才会与state中存的同步
      //取消勾选，selected:false
      this._people = this._updateInitList(this._people, _currentRow, false);
      _currentRow.selected = false;
      this.state.companyUsers[index].data[idx] = _currentRow;
      //更新原始列表
      var _attend_num = this.state.attend_num;//参课人数
      var _times = this.state.times;//扣点、次的次数
      var _freeNum = this.state.freeNum;//免费名额
      var authFlag = this.state.authData.authFlag
      if (authFlag == 1 || authFlag == 10) {
        if (_attend_num > 0) {
          _attend_num = _attend_num - 1;
        } else {
          _attend_num = 0;
        }
      }
      else {
        //当参课人数小于或者等于免费次、点数的时候不扣点次
        _attend_num = _attend_num - 1;
        if (_attend_num <= _freeNum) {
          _times = 0;
        }
        else {
          _times = _times - this.state.authData.authSingleCount
        }
      }
      //选中的列表
      this.selectedList = this._filter(this._people);
      this.setState({
        attend_num: _attend_num,
        times: _times,
        companyUsers: this.state.companyUsers,
      })
      return;
    }

    if (this.state.authData.authFlag == 1) {//付费课
      if (!_currentRow.selected) {//勾选
        //验证手机号和邮箱
        var _phone = this.state.companyUsers[this.index].data[this.idx].phone;
        var _email = this.state.companyUsers[this.index].data[this.idx].email;
        if (!_phone) {
          this.setState({
            phoneAlert: true,
            isShow: true,
          })
          return;
        }
        else if (!_email) {
          this.setState({
            emailAlert: true,
            isShow: true,
          })
          return;
        }
        //更新this._people,这样原始列表的数据状态才会与state中存的同步
        //取消勾选，selected:false
        var _attend_num = this.state.attend_num;//参课人数
        _attend_num = _attend_num + 1;

        this._people = this._updateInitList(this._people, _currentRow, true);
        _currentRow.selected = true;
        this.state.companyUsers[index].data[idx] = _currentRow;
        //选中的列表
        this.selectedList = this._filter(this._people);
        this.setState({
          companyUsers: this.state.companyUsers,
          attend_num: _attend_num
        })
      }
    }
    else {
      var _users = this._people;
      var _ids = [];
      _users.map(function (section) {
        section.data.map(function (row) {
          if (row.selected) {
            if (row.id) {
              _ids.push(row.id);
            } else {
              _ids.push(null);
            }
          }
        });
      });
      _ids.push(_currentRow.id);
      var _sIds = _ids.join(",");

      Dispatcher.dispatch({
        actionType: 'getOfflineAuth',
        id: this.props.location.state.id,
        ids: _sIds,
        type: 'newEnroll'
      })
    }
  }

  //添加手机号
  _addPhone() {
    if (this.state.phone == '' || !isCellPhoneAvailable(this.state.phone)) {
      this.setState({
        isAgin: true,
        diffTitle: 'isPhone',
        phoneAlert: false,
        infoTitle: '请输入合法手机号'
      })
    }
    else {
      this.setState({
        phoneAlert: false,
        isShow: false,
      })
      //补全手机号
      this.state.companyUsers[this.index].data[this.idx].phone = this.state.phone
    }
  }
  //添加邮箱
  _addEmail() {
    if (this.state.email == '' || !isEmailAvailable(this.state.email)) {
      this.setState({
        isAgin: true,
        diffTitle: 'isEmail',
        infoTitle: '请输入合法邮箱',
        emailAlert: false,
      })
    }
    else {
      this.setState({
        emailAlert: false,
        isShow: false,
      })
      //补全手邮箱
      this.state.companyUsers[this.index].data[this.idx].email = this.state.email
    }
  }
  _AginInput() {
    if (this.state.diffTitle == 'isPhone') {
      this.setState({
        isAgin: false,
        phoneAlert: true,
      })
    }
    else {
      this.setState({
        isAgin: false,
        emailAlert: true,
      })
    }
  }
  //输入手机号
  _onChangeInput(e) {
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      phone: val,
    });
  }
  //输入邮箱
  _onChangeEmail(e) {
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      email: val,
    });
  }

  //关闭弹框
  _hideAlert() {
    this.setState({
      isAuthShow: false,
      isShow: false,
      phoneAlert: false,
      emailAlert: false,
      isAgin: false,
    })
  }
  //联系客服
  _ApplyVoucher() {
    if (isWeiXin) {
      this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
    } else {
      window.location.href = 'https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

  //过滤列表，筛选出选中的返回array
  _filter(_people) {
    var tm_array = []
    _people.map((item, index) => {
      var _data = item.data.filter(function (currentValue) {
        return currentValue.selected;
      })

      if (_data.length > 0) {
        tm_array = tm_array.concat(_data)
      }
    })
    return tm_array;
  }

  _onNextStep() {
    //跳转前将被更新后的列表存储起来
    localStorage.setItem('initData', JSON.stringify(this._people));
    localStorage.setItem('times', JSON.stringify(this.state.times))
    //过滤选中的列表
    this.selectedList = this._filter(this._people);

    this.props.history.push(
      {
        pathname: `${__rootDir}/PgConfirmenrollment`,
        state:
        {
          addCompanyUserList: this.selectedList,
          resource_id: this.props.location.state.id,
          outOfAuth: this.state.outOfAuth,
          authData: this.state.authData,
          unit: this.state.unit,
          left_num: this.state.left_num,
          times: this.state.times,
          allPeople: this.state.companyUsers
        }
      }
    )

  }

  render() {
    //输入手机号
    var phoneAlert = (
      <div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.phoneAlert ? 'block' : 'none' }}>
        <div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>该帐号缺少手机号信息</div>
        <div>
          <input type='text' placeholder="请输入手机号" value={this.state.phone} style={styles.input_alert} onChange={this._onChangeInput.bind(this)} />
        </div>
        <div style={styles.alert_bottom}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', borderRight: 'solid 1px #d4d4d4', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._hideAlert.bind(this)}>取消</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._addPhone.bind(this)}>确定</div>
        </div>
      </div>
    )
    //输入邮箱
    var emailAlert = (
      <div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.emailAlert ? 'block' : 'none' }}>
        <div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>该帐号缺少邮箱信息</div>
        <div>
          <input type='text' placeholder="请输入邮箱" value={this.state.email} style={styles.input_alert} onChange={this._onChangeEmail.bind(this)} />
        </div>
        <div style={styles.alert_bottom}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text, borderRight: 'solid 1px #d4d4d4', }} onClick={this._hideAlert.bind(this)}>取消</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._addEmail.bind(this)}>确定</div>
        </div>
      </div>
    )

    var aginAlert = (
      <div style={{ ...styles.white_alert, height: 130, paddingTop: -1, display: this.state.isAgin ? 'block' : 'none' }}>
        <div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>提示</div>
        <div style={{ fontSize: 14, color: '#333', textAlign: 'center' }}>{this.state.infoTitle}</div>
        <div style={styles.alert_bottom}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text, borderRight: 'solid 1px #d4d4d4', }} onClick={this._hideAlert.bind(this)}>取消</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._AginInput.bind(this)}>再填一次</div>
        </div>
      </div>
    )

    //权益不足弹框
    var authAlert = (
      <div style={{ display: this.state.isAuthShow ? 'block' : 'none' }}>
        <div style={{ ...styles.white_alert, paddingTop: -1, }}>
          <div style={{ paddingTop: 10, fontSize: Fnt_Large, textAlign: 'center', color: Common.Black }}>{this.state.title}</div>
          <div style={{ color: Common.Black, fontSize: Fnt_Normal, lineHeight: '20px', padding: '10px 12px 0 12px' }}>{this.state.msgInfo}</div>
          <div style={styles.alert_bottom}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text, borderRight: 'solid 1px #d4d4d4', }} onClick={this._hideAlert.bind(this)}>知道了</div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Gray }} onClick={this._ApplyVoucher.bind(this)}>联系客服
           </div>
          </div>
        </div>
      </div>
    )

    //遍历所有员工信息
    var list = this.state.companyUsers.map((item, index) => {
      var section = item.section || '';
      var data;
      if (item.data && item.data.length > 0) {
        data = item.data.map((it, idx) => {
          //it.status(0:表示可以继续报名，1：表示不能报名)
          return (
            <div key={idx} style={{ backgroundColor: '#fff', borderBottom: 'solid 1px #f3f3f3' }}>
              {it.status == 0 ?
                <div style={{ display: 'flex', flex: 1, width: window.screen.width }}>
                  <div style={{ ...styles.companyUsersInfoDiv, color: '#333333', ...styles.LineClamp, paddingLeft: 12, paddingRight: 5, width: 83 }}>
                    {it.name}
                  </div>
                  <div style={{ ...styles.companyUsersInfoDiv, color: '#333333', ...styles.LineClamp, width: 130, }}>
                    {it.email ? it.email : '请补充邮箱'}
                  </div>
                  <div style={{ ...styles.companyUsersInfoDiv, color: '#333333', ...styles.LineClamp, paddingLeft: 10, width: 88 }}>
                    {it.phone ? it.phone : '请补充手机号'}
                  </div>
                  <div onClick={this._onSelected.bind(this, index, idx)} style={{ ...styles.companyUsersInfoDiv, flex: 0.5, alignItems: 'center' }}>
                    {it.selected ?
                      <img src={Dm.getUrl_img('/img/v2/icons/offlineChooseed@2x.png')} width={12} height={12} />
                      :
                      <img src={Dm.getUrl_img('/img/v2/icons/offlineChoose@2x.png')} width={12} height={12} />
                    }
                  </div>
                </div>
                :
                <div style={{ display: 'flex', width: window.screen.width }} onClick={this._AttendInfo.bind(this, it.name)}>
                  <div style={{ ...styles.companyUsersInfoDiv, ...styles.LineClamp, paddingLeft: 12, paddingRight: 5, width: 83 }}>
                    {it.name}
                  </div>
                  <div style={{ ...styles.companyUsersInfoDiv, ...styles.LineClamp, width: 130, }}>
                    {it.email}
                  </div>
                  <div style={{ ...styles.companyUsersInfoDiv, ...styles.LineClamp, paddingLeft: 10, width: 88 }}>
                    {it.phone}
                  </div>
                  <div style={{ ...styles.companyUsersInfoDiv, flex: 0.5, }}>
                    &nbsp;
                  </div>
                </div>
              }
            </div>
          )
        })
      }
      return (
        <div key={index}>
          {section ?
            <div style={{ width: window.screen.width, height: 20, lineHeight: '20px', }}>
              <span style={{ fontSize: 15, color: '#333333', marginLeft: 12 }}>{section}</span>
            </div>
            :
            null
          }
          {data}
        </div>
      )
    })

    var _data = this.state.authData;
    console.log(_data.authFlag)
    //头部文案
    var _titleView = null;
    var _isPayed = isPayed(_data.authFlag);
    var _isFree = isFree(_data.authFlag);
    var _unit = unit(_data.authFlag);
    var _getTitle = getTitle(_isPayed, _isFree, _unit, _data)
    if (_data.authFlag == 14) {
      //2.3.50版本 14为私享会券充足
      _titleView = (
        <div style={{ ...styles.freeDiv }}>
          <img style={{ marginRight: 10, marginLeft: 15 }} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15} />
          本课为私享会课程，参与需抵扣私享会券 1张/人
        </div>
      )
    } else {
      //2.3.40以前版本
      if (_isPayed == true) {
        //请提交本次参与员工信息，已便我们尽快联系您跟进后续报名事宜
        _titleView = (
          <div style={{ fontSize: 12, color: '#666666', height: 35, backgroundColor: '#f4f4f4' }}>
            <div style={{ marginLeft: 7 }}>请提交本次参与员工信息，以便我们尽快联系您跟进后续报名事宜。</div>
          </div>
        )
      } else {
        if (_isFree == true) {
          //本课程剩余免费席位x人
          _titleView = (
            <div style={{ ...styles.freeDiv }}>
              <img style={{ marginRight: 10, marginLeft: 15 }} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15} />
              本课剩余免费席位<span>{_data.freeNum}人</span>
            </div>
          )
        } else {
          if (_data.authFlag != 7 && _data.authFlag != 8) {
            //本课程剩余免费席位x人。。。。。。超出后抵扣。。。。
            _titleView = (
              <div style={{ ...styles.freeDiv }}>
                <img style={{ marginRight: 10, marginLeft: 15 }} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15} />
                本课剩余免费席位<span>{_data.freeNum}人{_getTitle}</span>
              </div>
            )
          } else {
            //本课程共/实际抵扣
            _titleView = (
              <div style={{ ...styles.freeDiv }}>
                <img style={{ marginRight: 10, marginLeft: 15 }} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15} />
                <span>{_getTitle}</span>
              </div>
            )
          }
        }
      }


    }

    /* authFlag:1 付费课
    * authFlag:10 免费课，只有免费名额，没有点次
    * authFlag:5||7 扣点课程 （authFlag:5 有免费席位）
    * authFlag:6||8 扣次课程（authFlag:6 有免费席位）
    */
    // if(_data.authFlag == 5){
    //   _title = (
    //     <div style={{...styles.freeDiv}}>
    //       <img style={{marginRight:10,marginLeft:15}} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15}/>
    //       本课剩余免费席位<span>{_data.freeNum}人，</span>
    //       超出后抵扣<span>{_data.authSingleCount}点/人</span>
    //     </div>
    //   )
    // }
    // else if (_data.authFlag == 6) {
    //   _title =(
    //     <div style={{...styles.freeDiv}}>
    //       <img style={{marginRight:10,marginLeft:15}} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15}/>
    //       本课剩余免费席位<span>{_data.freeNum}人，</span>
    //       超出后抵扣<span>{_data.authSingleCount}次/人</span>
    //     </div>
    //   )
    // }
    // else if(_data.authFlag == 10){
    //   _title =(
    //     <div style={{...styles.freeDiv}}>
    //       <img style={{marginRight:10,marginLeft:15}} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15}/>
    //       本课剩余免费席位<span>{_data.freeNum}人</span>
    //     </div>
    //   )
    // }
    // else if (_data.authFlag == 7) {
    //   _title =(
    //     <div style={{...styles.freeDiv}}>
    //       <img style={{marginRight:10,marginLeft:15}} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15}/>
    //       本课程抵扣<span>{_data.authSingleCount}点/人</span>
    //     </div>
    //   )
    // }
    // else if (_data.authFlag == 8) {
    //   _title =(
    //     <div style={{...styles.freeDiv}}>
    //       <img style={{marginRight:10,marginLeft:15}} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15}/>
    //       本课程抵扣<span>{_data.authSingleCount}次/人</span>
    //     </div>
    //   )
    // }
    // else if(_data.authFlag == 1) {
    //   _title=(
    //     <div style={{fontSize:12,color:'#666666',height:28,lineHeight:'28px',backgroundColor:'#f4f4f4'}}>
    //       <div style={{marginLeft:7}}>请提交本次参与员工信息，以便我们尽快联系您跟进后续报名事宜.</div>
    //     </div>
    //   )
    // }

    return (
      <div style={styles.container}>
        {_titleView}
        <div style={{ ...styles.top, }}>
          <div style={{ ...styles.input_box }}>
            <img src={Dm.getUrl_img('/img/v2/icons/searchTeacher@2x.png')} width={15} height={15}
              style={{ float: 'left', marginTop: 7, marginLeft: 13, marginRight: 9, }} />
            <input placeholder="输入员工进行搜索" type='text' style={{ ...styles.input }} value={this.filterText} onChange={this._onChange.bind(this)} />
            <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} width={14} height={14} style={{ ...styles.clear, display: this.state.isClear ? 'block' : 'none' }} onClick={this._Clear.bind(this)} />
          </div>
          <div onClick={this.search.bind(this)} style={{ ...styles.btn_search }}>搜索</div>
          <div style={{ clear: 'both' }}></div>
        </div>
        <div style={{ width: window.screen.width, height: 41, backgroundColor: '#ffffff' }}>
          <div onClick={this._onAdd.bind(this)} style={{ width: window.screen.width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/offlineAddEnroll@2x.png')} width={17} height={17} />
            <span style={{ fontSize: 14, color: '#333333', }}>新增名单外报名</span>
          </div>
        </div>

        <div style={{ ...styles.content, backgroundColor: this.state.companyUsers.length > 0 ? '' : '#ffffff' }}>
          {
            this.state.companyUsers.length > 0 ? list :
              <span style={{ fontSize: 12, color: '#333333', width: 96, marginLeft: (window.screen.width - 96) / 2, marginTop: 15 }}>未搜到该结果~</span>
          }
        </div>
        {/*底部显示*/}
        <div style={{ ...styles.bottomDiv }}>
          <div style={{ ...styles.bottomFirstDiv }}>
            {/* 底部显示 */}
            {_data.authFlag == 14 ?
              <div>
                <div style={{ width: window.screen.width * 0.68, float: 'left', overflow: 'auto' }}>
                  <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width={15} height={17} style={{ float: 'left', margin: '15px 8px 0 16px' }} />
                  <span style={{ fontSize: 14, color: '#2a2a2a' }}>
                    您目前剩余券
                <span style={{ fontSize: 14, color: '#2196f3' }}>{_data.privClubTicket}</span>
                    张 本次应扣
                 <span style={{ fontSize: 14, color: '#2196f3' }}>{this.state.times}</span>
                    张
                </span>
                </div>
                <div style={{ width: window.screen.width * 0.32, float: 'left', textAlign: 'center', fontSize: 14, color: '#333333', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                  <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18} />
                  已选<span style={{ color: 'red' }}>{this.state.attend_num}</span>人
                </div>
              </div>
              :
              <div style={{ ...styles.bottomFirstDiv }}>
                {_isPayed == true || _isFree == true || (_data.num == null && _data.point == null) ?
                  <div style={{ width: window.screen.width, textAlign: 'center', fontSize: 14, color: '#333333', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                    <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18} />
                    已选<span style={{ color: '#2196f3' }}>{this.state.attend_num}</span>人
                </div>
                  :
                  <div>
                    <div style={{ width: window.screen.width * 0.68, float: 'left', overflow: 'auto' }}>
                      <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width={15} height={17} style={{ float: 'left', margin: '15px 8px 0 16px' }} />
                      <span style={{ fontSize: 14, color: '#2a2a2a' }}>
                      您目前剩余
                      <span style={{ fontSize: 14, color: '#2196f3' }}>{this.state.left_num}</span>
                        {this.state.unit} 本次应扣
                      <span style={{ fontSize: 14, color: '#2196f3' }}>{this.state.times}</span>
                        {this.state.unit}
                      </span>
                    </div>
                    <div style={{ width: window.screen.width * 0.32, float: 'left', textAlign: 'center', fontSize: 14, color: '#333333', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                      <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18} />
                      已选<span style={{ color: 'red' }}>{this.state.attend_num}</span>人
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          {/* 
{
              (this.state.authData.authFlag !== 1 && this.state.authData.authFlag !== 10) ?
                <div>
                  {this.state.authData.num == null && this.state.authData.point == null ?
                    null
                    :
                    <div style={{ width: window.screen.width * 0.63, float: 'left', overflow: 'auto' }}>
                      <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width={15} height={17} style={{ float: 'left', margin: '15px 8px 0 25px' }} />
                      <span style={{ fontSize: 14, color: '#2a2a2a' }}>
                        剩余
                    <span style={{ fontSize: 14, color: '#2196f3' }}>{this.state.left_num}</span>
                        {this.state.unit}，
                        本次应扣
                    <span style={{ fontSize: 14, color: '#2196f3' }}>{this.state.times}</span>
                        {this.state.unit}
                      </span>
                    </div>
                  }
                  <div style={{ width: window.screen.width * 0.37, float: 'left', textAlign: 'center', fontSize: 14, color: '#333333', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                    <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18} />
                    已选<span style={{ color: 'red' }}>{this.state.attend_num}</span>人
                </div>
                </div>
                :
                <div style={{ width: window.screen.width, textAlign: 'center', fontSize: 14, color: '#333333', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                  <img style={{ marginRight: 10, }} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18} />
                  已选<span style={{ color: '#2196f3' }}>{this.state.attend_num}</span>人
              </div>
            } */}
          {
            this.selectedList.length > 0 ?
              <div style={{ width: window.screen.width - 32, marginLeft: 16, height: 45, backgroundColor: '#2196f3', textAlign: 'center', marginTop: 11, borderRadius: '4px' }} onClick={this._onNextStep.bind(this)}>
                <span style={{ fontSize: 18, color: '#ffffff' }}>下一步</span>
              </div>
              :
              <div style={{ width: window.screen.width - 32, marginLeft: 16, height: 45, backgroundColor: '#D1D1D1', textAlign: 'center', marginTop: 11, borderRadius: '4px' }}>
                <span style={{ fontSize: 18, color: '#ffffff' }}>下一步</span>
              </div>
          }
        </div>
        <div style={{ ...styles.used, display: this.state.isShowUsed ? 'block' : 'none' }}>
          <span style={{ fontSize: 14, color: '#ffffff' }}>{this.state.name}已报名~</span>
        </div>
        <div style={{ ...styles.msk, display: this.state.isShow || this.state.isAuthShow ? 'block' : 'none' }} onClick={this._hideAlert.bind(this)}></div>
        {authAlert}
        {phoneAlert}
        {emailAlert}
        {aginAlert}
      </div>
    )
  }
}

var styles = {
  container: {
    height: window.innerHeight,
  },
  top: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 12,
    paddingRight: 12,
  },
  content: {
    height: window.innerHeight - 240,
    overflowY: 'auto',
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
  input_box: {
    width: window.screen.width - 67,
    height: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    float: 'left',
    position: 'relative',
  },
  input: {
    width: window.screen.width - 120,
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
  bottomDiv: {
    width: window.screen.width,
    height: 114,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    lineHeight: 3
  },
  bottomFirstDiv: {
    height: 50,
    width: devWidth,
    borderBottom: 'solid 1px #e1e1e1',
    borderTop: 'solid 1px #e1e1e1',
  },
  clear: {
    position: 'absolute',
    zIndex: 2,
    right: 25,
    top: 9,
  },
  used: {
    width: 190,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: '5px',
    opacity: 0.7,
    position: 'absolute',
    top: 254,
    zIndex: 999,
    textAlign: 'center',
    lineHeight: 2,
    marginLeft: (window.screen.width - 190) / 2
  },
  white_alert: {
    width: devWidth - 100,
    height: 150,
    backgroundColor: Common.Bg_White,
    borderRadius: 12,
    position: 'absolute',
    zIndex: 1000,
    top: 180,
    left: 50,
    textAlign: 'center',
  },
  alert_bottom: {
    position: 'absolute',
    zIndex: 201,
    bottom: 0,
    left: 0,
    width: devWidth - 100,
    height: 42,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    display: 'flex',
    flex: 1,
  },
  msk: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#000000',
    position: 'absolute',
    zIndex: 999,
    opacity: 0.2,
    top: 0,
    textAlign: 'center',
  },
  input_alert: {
    border: 'solid 1px #d4d4d4',
    height: 20,
    padding: '2px 2px 2px 5px',
    width: devWidth - 167,
    marginTop: 10,
    fontSize: Fnt_Normal,
    color: Common.Black,
  },
}

export default PgOfflineEnrollManyPeople;
