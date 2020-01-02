import Dispatcher from '../AppDispatcher';
import React from 'react';
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import Common from '../Common';
import NavigationS from '../components/navigations';
import BigLoading from '../components/BigLoading';
import styles from '../components/PAnswerStyle';
import BlackAlert from '../components/BlackAlert';
import CallphoneAlert from '../components/phoneanswer/CallphoneAlert';

class PhoneAnswerTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginTips: false, //显示登录提醒
            showTabs1: true, //全部:1 未接通:2
            showTabs2: false,
            alert_title: '',
            alert_cont: '',
            addDisplay: 'none',
            teacherList: [],
            alertCon: '您当前未登录，即将返回登录页面',
            showCallphoneAlert: false,
            showLoading: true, //加载中效果
        }
        this.skip = 0;
        this.callerNum = localStorage.getItem('epcode'); //讲师手机号
        this.callDirection = 0; //答疑方向 默认传0
        this.expertId;
        this.callAnswerId;
        this.callRole = 1;
        this.status = 'all';
        this.loadMore = false; //是否是加载更多
        this.loadAll = false; //是否加载所有数据
    }

    componentWillMount() {
        EventCenter.emit("SET_TITLE", '会员电话答疑(专家端)');
        this._getTeacherListDone = EventCenter.on('TeacherListDone', this._handleTeacherListDone.bind(this));
        // 获取方法是把这个字段的后四位转到前面去，如：“26300631306”转为"13062630063"即可
        this.callerNum = this.callerNum ? (this.callerNum.slice(-4) + this.callerNum.slice(0, 7)) : '';
    }
    componentDidMount() {
        this._GetTeacherList();
    }

    componentWillUnmount() {
        this._getTeacherListDone.remove()
    }
    // tab切换
    _forTabs(index) {
        this.status = index;
        this.skip = 0;
        this.loadMore = false;
        if ('unAnswer' == index && this.state.showTabs1) {
            this.setState({
                showTabs1: false,
                showTabs2: true,
            });
            this._GetTeacherList();
        } else if ('all' == index && this.state.showTabs2) {
            this.setState({
                showTabs1: true,
                showTabs2: false,
            });
            this._GetTeacherList();
        }
        this.teacherListDom.scrollTop = 0
    }

    // callAnswerId -- 答疑订单ID，用户端再次拨打和专家端回拨时必须，新建答疑单时传空
    // expertId -- 答疑专家ID，新建答疑单时必须，用户端再次拨打和专家端回拨时传空
    _makePhoneCall(callAnswerId, callDirection) {
        //调用Ask的公共呼叫方法
        this.callDirection = callDirection;
        this.callAnswerId = callAnswerId;
        this.setState({ showCallphoneAlert: true })
    }
    // 滑动页面的处理：根据滑动当前位置是否在倒数一条数据DOM的开始点，确定是否加载更多数据。 222：一条数据DOM的高度+marginTop
    _listScroll(re) {
        // console.log('this.teacherListDom.scrollHeight====',this.teacherListDom.scrollHeight,"-------------this.teacherListDom.scrollTop===",this.teacherListDom.scrollTop)
        if (!this.loadAll && (this.teacherListDom.scrollHeight - this.teacherListDom.scrollTop - 222) < document.documentElement.clientHeight - 80) {
            this.loadMore = true;
            this._GetTeacherList();
        }
    }
    //加载列表数据
    _GetTeacherList() {
        Dispatcher.dispatch({
            actionType: 'PATeacherList',
            status: {
                status: this.status || 'all',
                skip: this.skip,
                limit: 15
            }
        })
    }
    //列表加载完毕
    _handleTeacherListDone(re) {
        this.setState({
            showLoading: false
        })
        if (re.err) {
            this.setState({
                showLoginTips: true,
                alertCon: re.err
            })
            return;
        }
        if (re.user.isLogined == false) {
            // -- 是否登录(true/false)，未登录不返回列表数据
            this.setState({
                showLoginTips: true,
                alertCon: '您当前未登录，即将返回登录页面'
            }, () => {
                //post 消息给app
            })
            return;
        }
        var result = re.result || [];
        if (result.length < 15) {
            this.loadAll = true;
        } else {
            this.loadAll = false;
        }
        this.setState({
            teacherList: this.loadMore ? this.state.teacherList.concat(result) : result,
        }, () => {
            this.skip = this.state.teacherList.length;
        })
    }
    render() {
        var _that = this;
        var stylesLi1 = this.state.showTabs1 ? styles.tabs__li_curr : {},
            stylesLi2 = this.state.showTabs2 ? styles.tabs__li_curr : {};
        var LIST = this.state.teacherList.map((item, index) => {
            return (
                <li key={index} style={{ ...styles.bgfff, ...styles.li }}>
                    <Link to={{ pathname: `${__rootDir}/PhoneAnswerUserDet/${item.id}`, state: { page: 1, phone: this.callerNum } }}>
                        <div style={{ ...styles.li__info }}>
                            <span style={styles.sp}>
                                答疑单号:{item.order_no}
                            </span>
                        </div>
                    </Link>
                    <div style={{ ...styles.li__inner }}>
                        <Link to={{ pathname: `${__rootDir}/PhoneAnswerUserDet/${item.id}`, state: { page: 1, phone: this.callerNum } }}>
                            <img style={{ ...styles.fl, ...styles.li__img }} src={item.photo} />
                        </Link>
                        <div style={{ ...styles.right_overfl }}>
                            <Link to={{ pathname: `${__rootDir}/PhoneAnswerUserDet/${item.id}`, state: { page: 1, phone: this.callerNum } }}>
                                <div style={{ ...styles.fl }}>
                                    <div style={{ ...styles.li__name }}>{item.name}</div>
                                    <span style={{ ...styles.li__type,color: item.call_direction == 0 ? '#975900' : '#276BA0', background: item.call_direction == 0 ? '#FDEED5' : '#D5EAFB' }}>{item.call_direction == 0 ? '财务方向' : '税务方向'}</span>
                                </div>
                                {item.order_status == 1 || item.order_status == 2 ?
                                    <div style={{ ...styles.fr }}>
                                        <div style={{ ...styles.li__status, ...item.order_status == 1 ? styles.li__s1 : '' }}>{item.order_status == 1 ? '未完结' : '已完结'}</div>
                                    </div>
                                    : ''
                                }
                                <div style={{ ...styles.clearfix }}></div>
                                <div style={{ ...styles.li__times }}>最近连线时间: {item.last_call_time}</div>
                            </Link>
                            {item.order_status == 1 ? 
                                <div>
                                    <div style={{ ...styles.li__line }}></div>
                                    <div style={{ ...styles.opereate, ...styles.fr }} onClick={this._makePhoneCall.bind(this, item.id, item.call_direction)}>
                                        <img style={{ ...styles.li__btn }} src={Dm.getUrl_img('/img/v2/PhoneAnswer/psmall.png')} />回拨
                                    </div>
                                </div>
                                : ''
                            }
                        </div>
                        <div style={{ ...styles.clearfix }}></div>
                    </div>
                </li>
            )
        })
        return (
            <div style={{ ...styles.p_pAnswer }}>
                <div>
                    <BigLoading isShow={this.state.showLoading} />
                    <NavigationS isShow={true} titles={'会员电话答疑(专家端)'} backFlag={true} />
                    <ul style={{ ...styles.bgfff, ...styles.tabs }}>
                        <li style={{ ...styles.tabs__li }} onClick={this._forTabs.bind(this, 'all')}><span style={{ display: 'inline-block', ...stylesLi1 }}>全部</span></li>
                        <li style={{ ...styles.tabs__li }} onClick={this._forTabs.bind(this, 'unAnswer')}><span style={{ display: 'inline-block', ...stylesLi2 }}>未接通</span></li>
                    </ul>
                    <ul ref={(teacherListDom) => this.teacherListDom = teacherListDom} style={{ ...styles.pageList, height: devHeight - 80 }} onScroll={this._listScroll.bind(this)}>
                        {_that.state.showLoading ? ''
                            : _that.state.teacherList.length > 0 ? LIST
                                :
                                <li style={{ ...styles.no_data }}>
                                    <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={{ ...styles.no_data_img }} />
                                    <p style={{ ...styles.no_data_p }}>暂无相关数据~</p>
                                </li>
                        }
                    </ul>
                    <div style={{ ...Common.alertDiv, display: this.state.addDisplay, width: '80%', left: '50%', marginLeft: "-40%", height: "auto" }}>
                        <div style={{ padding: "20px 15px" }}>{this.state.alert_title}<br />{this.state.alert_cont}</div>
                    </div>
                    <BlackAlert isShow={this.state.showLoginTips} word={this.state.alertCon} />
                </div>
                {this.state.showCallphoneAlert ?
                    <CallphoneAlert
                        expertId={this.expertId}
                        callAnswerId={this.callAnswerId}
                        callRole={this.callRole}
                        callerNum={this.callerNum}
                        callDirection={this.callDirection}
                        dismiss={() => {
                            //取消
                            this.setState({ showCallphoneAlert: false })
                        }}
                        confirm={(value) => {
                            //立即呼叫
                        }}
                    /> : null}
            </div>
        )
    }
}

export default PhoneAnswerTeacher;