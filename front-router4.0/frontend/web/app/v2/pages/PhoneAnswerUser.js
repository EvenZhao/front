import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import Common from '../Common';
import EventCenter from '../EventCenter';
import Dm from '../util/DmURL';
import NavigationS from '../components/navigations';
import BigLoading from '../components/BigLoading';
import ZixunAlert from '../components/phoneanswer/ZixunAlert'
import CallphoneAlert from '../components/phoneanswer/CallphoneAlert'
import BlackAlert from '../components/BlackAlert';
import FxsxAlert from '../components/phoneanswer/FxsxAlert'


class PhoneAnswerUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pjNum: localStorage.getItem('waitremarknum'),
      showFxsxAlert: false,
      showZixunAlert: false,
      showCallphoneAlert: false,
      datas: [],
      showLoginTips: false,
      alertCon: '',
      showLoading: true, //加载中效果
      directionName: '全部方向',

    }

    this.limit = 15;
    this.skip = 0;
    this.direction = 0; //0:全部 1:财务方向 2:税务方向
    this.callerNum = localStorage.getItem('epcode'); //手机号
    this.callDirection = 0; //答疑方向 默认传0
    this.expertId;
    this.showExpertListFilter = localStorage.getItem('showexpertlistfilter')
    this.ExpertListFilterH = this.showExpertListFilter ? 40 : 0;
    this.callDirections = [];
  }

  componentWillMount() {
    EventCenter.emit("SET_TITLE", '铂略财课-电话答疑');
    this.e_CallAnswerExpertList = EventCenter.on('CallAnswerExpertList', this._callAnswerExpertList.bind(this));

  }

  componentDidMount() {
    this._getDatas();
  }

  componentWillUnmount() {
    this.e_CallAnswerExpertList.remove()
  }
  //答疑记录
  _callRecord(type) {
    this.props.history.push({
      pathname: `${__rootDir}/PhoneAnswerUserRecords/`,
      state: { phone: this.callerNum, status: type }
    });
  }
  //拨打电话
  _callTeacher(id,is_finance,is_taxation) {
    this.callDirections = [];
    if(is_finance){
      this.callDirections.push({ name: '财务方向', value: 0 })
    }
    if(is_taxation){
      this.callDirections.push({ name: '税务方向', value: 1 })
    }
    this.expertId = id;
    this.setState({ showZixunAlert: true })
  }

  _getDatas() {
    Dispatcher.dispatch({
      actionType: 'CallAnswerExpertList',
      direction: this.direction,
      skip: this.skip,
      limit: this.limit,
    })
  }

  _callAnswerExpertList(data) {
    console.log("_callAnswerExpertList: " + JSON.stringify(data))
    this.setState({
      showLoading: false
    })
    const { err, user, result } = data
    if (err) {
      //错误
      this.setState({ showLoginTips: true, alertCon: err }, () => {
        setTimeout(() => {
          this.setState({
            showLoginTips: false,
            alertCon: ''
          })
        }, 2000)
      })
      return;
    }
    if (!user || !user.isLogined) {
      //未登录
      this.setState({ showLoginTips: true, alertCon: '您当前未登录，即将返回登录页面' }, () => {
        setTimeout(() => {
          this.setState({
            showLoginTips: false,
            alertCon: ''
          })
        }, 2000)
      })
      return;
    }
    if (result && Array.isArray(result) && result.length > 0) {
      let newDatas = this.state.datas.concat(result);
      this.setState({
        datas: newDatas,
        pjNum: user.waitRemarkNum
      }, () => {
        this.skip = newDatas.length;
      })
    }
  }

  render() {
    return (
      <div style={{ width: devWidth, height: devHeight, backgroundColor: '#fff' }}>
        <BigLoading isShow={this.state.showLoading} />
        <NavigationS isShow={true} titles={'会员电话答疑'} backFlag={true} />
        <div style={styles.navigations_rightBtn} onClick={this._callRecord.bind(this, 'all')}>
          答疑记录
        </div>
        {this.showExpertListFilter ?
          < div onClick={() => {
            this.setState({ showFxsxAlert: !this.state.showFxsxAlert })
          }} style={{ height: 40, width: devWidth, backgroundColor: '#F4F8FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, color: this.direction == 0 ? '#333333' : '#2196F3' }}>{this.state.directionName}</span>
            <img style={{ marginLeft: 5 }} src={this.state.showFxsxAlert ? Dm.getUrl_img('/img/v2/PhoneAnswer/tup.png') : Dm.getUrl_img('/img/v2/PhoneAnswer/tdown.png')} width="8" height="6" />
          </div> : null}
        {this.state.pjNum > 0 ?
          <div style={styles.pj} onClick={this._callRecord.bind(this, 'unRemark')}>
            <img style={{ marginLeft: 10 }} src={Dm.getUrl_img('/img/v2/PhoneAnswer/tishi.png')} width="16" height="16" />
            <span style={styles.div_wpj}>目前有{this.state.pjNum}个答疑尚未评价</span>
            <img style={{ marginRight: 10 }} src={Dm.getUrl_img('/img/v2/PhoneAnswer/jinru.png')} width="8" height="15" />
          </div>
          :
          null
        }
        {
          this.state.showLoading ? ''
            : this.state.datas.length == 0 ?
              <li style={styles.no_data}>
                <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={styles.no_data_img} />
                <p style={styles.no_data_p}>暂无相关数据~</p>
              </li>
              :
              <div onScroll={(e) => {
                let { clientHeight, scrollHeight, scrollTop } = this.divScroll;
                if (scrollHeight - (clientHeight + scrollTop) < 50) {
                  this._getDatas();
                }
              }} ref={e => { this.divScroll = e }} style={{ ...styles.div_1, height: this.state.pjNum > 0 ? devHeight - 94 - this.ExpertListFilterH : devHeight - 59 - this.ExpertListFilterH }}>
                {this.state.datas.map((item, i) => {
                  return (
                    this.renderItem(item, i)
                  )
                })}
              </div>
        }
        {
          this.state.showZixunAlert ?
            <ZixunAlert
              callDirections={this.callDirections}
              from={1}
              dismiss={() => {
                //取消
                this.setState({ showZixunAlert: false })
              }}
              confirm={(value) => {
                //确认
                this.callDirection = value;
                this.setState({ showCallphoneAlert: true })
              }} /> : null
        }


        {
          this.state.showCallphoneAlert ?
            <CallphoneAlert
              expertId={this.expertId}
              callAnswerId={null}
              callRole={0}
              callerNum={this.callerNum}
              callDirection={this.callDirection}
              dismiss={() => {
                //取消
                this.setState({ showCallphoneAlert: false })
              }}
            /> : null
        }

        {
          this.state.showFxsxAlert ?
            <FxsxAlert
              dismiss={() => {
                this.setState({ showFxsxAlert: false })
              }}
              confirm={(item) => {
                this.setState({ datas: [], directionName: item.name }, () => {
                  this.direction = item.value;
                  this.skip = 0;
                  this._getDatas();
                })
              }}
            /> : null
        }

        <BlackAlert isShow={this.state.showLoginTips} word={this.state.alertCon} />
      </div >
    )
  }

  renderItem(item, i) {
    const { id, name, title, photo, is_finance, is_taxation, start_time, end_time, status } = item;
    return (
      <div style={styles.div_1_1} key={i}>
        {/* 图标 在线 */}
        <div style={styles.div_1_1_1} >
          <img src={photo} style={{ width: 60, height: 60, borderRadius: 30 }} />
          <div style={{ ...styles.div_1_1_1_1, backgroundColor: status == 2 ? '#F29700' : status == 1 ? '#3BC1A7' : '#89899A' }}>
            {status == 2 ? '忙碌' : status == 1 ? '在线' : '休息'}
          </div>
        </div>
        {/* 名字税务时间   */}
        <div style={styles.div_1_1_2}>
          <div style={styles.div_1_1_2_1}>
            <span style={styles.span_1_1_2_1_1}>{name}</span>
            <span style={styles.span_1_1_2_1_2}>{title}</span>
          </div>
          <div style={styles.div_1_1_2_2}>
            {is_finance ? <div style={{ ...styles.div_1_1_2_2_1, color: '#975900', background: '#FDEED5', marginRight: 10 }}>财务方向
              </div> : null}
            {is_taxation ? <div style={{ ...styles.div_1_1_2_2_1, color: '#276BA0', background: '#D5EAFB', }}>税务方向
              </div> : null}
          </div>
          <div style={styles.div_1_1_2_3}>
            服务时间：{start_time}-{end_time} 法定工作日
            </div>
        </div>
        {/* 电话图标 */}
        {status == 0 ?
          <div style={styles.div_1_1_3}>
            <img src={Dm.getUrl_img('/img/v2/PhoneAnswer/nocall.png')} width="30" height="30" />
          </div> :
          <div style={styles.div_1_1_3} onClick={this._callTeacher.bind(this, id,is_finance,is_taxation)}>
            <img src={Dm.getUrl_img('/img/v2/PhoneAnswer/pbig.png')} width="30" height="30" />
          </div>}
      </div>
    )
  }

}

var styles = {
  navigations: {
    display: 'flex',
    flexDirection: 'row',
    height: 45,
    width: devWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigations_leftBtn: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45
  },
  navigations_text: {
    fontSize: 16,
    color: '#333333'
  },
  navigations_rightBtn: {
    position: 'absolute',
    zIndex: 5,
    top: 9,
    right: 25,
    fontSize: 12,
    color: '#666'
  },
  line: {
    width: devWidth,
    height: 1,
    backgroundColor: '#f4f4f4'
  },
  pj: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    width: devWidth,
    backgroundColor: '#F8ECE5'
  },
  div_wpj: {
    fontSize: 13,
    color: '#F48043',
    marginLeft: 5, flex: 1
  },
  div_1: {
    paddingTop: 18,
    // display: 'flex',
    // flexDirection: 'column',
    width: devWidth,
    alignItems: 'center',
    overflow: 'auto',
  },
  div_1_1: {
    display: 'flex',
    marginLeft: '15px',
    width: devWidth - 30,
    // height: 120,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: '0 2px 20px 0 #D1D1D1',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  div_1_1_1: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    marginLeft: 12,
    width: 65,
    height: 65,
    position: 'relative'
  },
  div_1_1_1_1: {
    paddingRight: 6,
    paddingLeft: 6,
    height: 16,
    lineHeight: '16px',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    position: 'absolute',
    right: 0,
    top: '46px',
    color: '#ffffff'
  },
  div_1_1_2: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 8,
    marginLeft: 8,
    height: 120,
  },
  div_1_1_2_1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  span_1_1_2_1_1: {
    fontSize: 16,
    color: '#000000'
  },
  span_1_1_2_1_2: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 5
  },
  div_1_1_2_2: {
    display: 'flex',
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center'
  },
  div_1_1_2_2_1: {
    display: 'flex',
    paddingLeft: 10,
    paddingRight: 10,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 11,
  },
  div_1_1_2_3: {
    fontSize: 11,
    color: '#999999',
    marginTop: 9
  },
  div_1_1_3: {
    display: 'flex',
    marginTop: 18,
    marginRight: 17,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  div_1_1_3_1: {
    width: 30,
    height: 30,
  },
  no_data: {
    padding: '20px 0',
    textAlign: 'center'
  },
  no_data_img: {
    height: '128px',
    width: '188px',
    verticalAlign: 'middle',
    marginTop: '100px'
  },
  no_data_p: {
    fontSize: '16px',
    color: '#333333',
    marginTop: '20px'
  },
}

export default PhoneAnswerUser;
