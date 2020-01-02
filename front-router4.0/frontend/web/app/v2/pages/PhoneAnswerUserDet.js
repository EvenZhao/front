import Dispatcher from '../AppDispatcher';
import React from 'react';
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
import Common from '../Common';
import NavigationS from '../components/navigations'
import CallLogs from '../components/CallLogs'
import styles from '../components/PAnswerStyle'
import BlackAlert from '../components/BlackAlert';
import ZixunAlert from '../components/phoneanswer/ZixunAlert'
import CallphoneAlert from '../components/phoneanswer/CallphoneAlert'
import PinjiaAlert from '../components/phoneanswer/PinjiaAlert'

class PhoneAnswerUserDet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id || '', //会员电话答疑主数据ID(即答疑订单ID)
            page: this.props.location.state && this.props.location.state.page, //从哪个页面过来的，用于区别显示底部按钮 ： 1 专家端 2 会员端
            showLoginTips: false, //显示登录提醒
            addDisplay: 'none',
            userList: [], //用户信息
            dataList: [], //通话记录
            alertCon: '您当前未登录，即将返回登录页面',
            remark_status: true, //仅用户端返，评价状态，0:未评价;1:已解决;2:未解决;3:仍需答疑
            can_remark: 0, // -- 仅用户端返，用户是否可评价，0:否;1:是
            order_status: 0, // -- 答疑订单状态，用户不可评价算无效(0),用户可评价但未评价算待评价/未完结(1),用户可评价且已评价算已评价/已完结(2)
            remark: '', //-- 仅用户端返，评价详情(内容)
            showZixunAlert: false,
            showCallphoneAlert: false,
            showPinjiaAlert: localStorage.getItem("showPinjiaAlert"),
            expert_status: -1,
        }
        this.expert_id = this.props.location.state.expertId;
        this.callerNum = this.props.location.state.phone
        this.callDirection = 0; //答疑方向 默认传0
        this.expertId;
        this.callAnswerId;
        this.callRole;

        this.from = 2;
        this.callDirections = [];
    }
    componentWillMount() {
        EventCenter.emit("SET_TITLE", '答疑详情');
        this._getCallAnswerDetailDone = EventCenter.on('CallAnswerDetailDone', this._handleCallAnswerDetailDone.bind(this))
    }
    componentDidMount() {
        if (this.state.id) {
            Dispatcher.dispatch({
                actionType: 'CallAnswerDetail',
                status: {
                    id: this.state.id, //会员电话答疑主数据ID(即答疑订单ID)
                }
            })
        }
    }
    componentWillUnmount() {
        this._getCallAnswerDetailDone.remove()
    }
    //呼叫 type=1: 回拨 type=2 再次呼叫
    _makePhoneCall(type) {
        //调用Ask的公共呼叫方法
        if (1 == type) {
            this.callRole = 1;
            this.setState({ showCallphoneAlert: true })
        } else if (2 == type) {
            if (this.state.order_status == 1 || this.state.order_status == 0) {
                this.from = 2;
            } else {
                this.from = 1;
            }
            this.callRole = 0;
            this.setState({ showZixunAlert: true })
        }
    }
    // 评价
    _eValuation() {
        this.setState({
            showPinjiaAlert: "true"
        })
    }
    // 获得详情数据后
    _handleCallAnswerDetailDone(re) {
        console.log("_handleCallAnswerDetailDone: " + JSON.stringify(re))
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
        var result = re.result || {};
        this.setState({
            can_remark: result.can_remark,
            remark_status: result.remark_status,
            order_status: result.order_status,
            remark: result.remark,
            userList: [result],
            dataList: result.detailList,
            isLoading: false,
            expert_status: result.expert_status
        }, () => {
            this.callAnswerId = result.id;
            this.callDirection = result.call_direction
            this.callDirections = [];
            if (result.is_finance) {
                this.callDirections.push({ name: '财务方向', value: 0 })
            }
            if (result.is_taxation) {
                this.callDirections.push({ name: '税务方向', value: 1 })
            }
        })
    }
    render() {
        var _that = this;
        var LI = this.state.userList.map((item, index) => {
            return (
                <li key={index} style={{ ...styles.bgfff, ...styles.li }}>
                    <div style={styles.li__info}>
                        <span style={styles.sp}>
                            答疑单号：{item.order_no}
                        </span>
                    </div>
                    <div style={{ ...styles.li__inner }}>
                        <img style={{ ...styles.fl, ...styles.li__img, ...styles.bigPhoto }} src={item.photo} />
                        {item.expert_status == 0 || item.expert_status == 1 || item.expert_status == 2 ?
                            item.expert_status == 2 ?
                                <span style={{ ...styles.li__online, ...styles.li__online_2 }}>忙碌</span>
                                : item.expert_status == 1 ?
                                    <span style={{ ...styles.li__online, ...styles.li__online_1 }}>在线</span>
                                    :
                                    <span style={{ ...styles.li__online }}>休息</span>
                            : ''
                        }
                        <div style={{ ...styles.right_overfl }}>

                            <div style={{ ...styles.fl, width: '78%' }}>
                                <div style={{ ...styles.li__name }}>{item.name}<span style={{ ...styles.li__title }}>{item.title}</span></div>
                                <span style={{ ...styles.li__type, color: item.call_direction == 0 ? '#975900' : '#276BA0', background: item.call_direction == 0 ? '#FDEED5' : '#D5EAFB' }}>{item.call_direction == 0 ? '财务方向' : '税务方向'}</span>
                            </div>
                            {item.order_status == 1 || item.order_status == 2 ?
                                <div style={{ ...styles.fr }}>
                                    <div style={{ ...styles.li__status, ...item.order_status == 1 ? styles.li__s1 : '' }}>{item.order_status == 1 ? (_that.state.page == 2 ? '待评价' : '未完结') : (_that.state.page == 2 ? '已评价' : '已完结')}</div>
                                </div>
                                : ''
                            }
                            <div style={{ ...styles.clearfix }}></div>
                        </div>
                        <div style={{ ...styles.clearfix }}></div>
                    </div>
                </li>
            )
        })
        return (
            <div style={{ ...styles.p_pAnswerDet }}>
                <NavigationS isShow={true} titles={'答疑详情'} backFlag={false} />
                <div style={{ ...styles.p_pAnswerDet_scroll }}>
                    <ul style={{ ...styles.pageList }}>
                        {LI}
                    </ul>
                    <CallLogs dataList={this.state.dataList} page={this.state.page} />
                    {this.state.page == 1 && this.state.order_status == 1 || (this.state.page == 2 && (this.state.order_status || this.state.expert_status == 0 || this.state.expert_status == 1 || this.state.expert_status == 2)) ?
                        <div style={{ ...styles.bottom }}>
                            {this.state.page == 1 && this.state.order_status == 1 ?
                                <div style={{ ...styles.fr, ...styles.opereate, ...styles.opereate_sp }} onClick={this._makePhoneCall.bind(this, 1)}>回拨</div>
                                : this.state.page == 2 ?
                                    <div>
                                        {this.state.expert_status == 1 || this.state.expert_status == 2 || this.state.expert_status == 0 ?
                                            <div style={{ ...styles.fr, ...styles.opereate, ...styles.opereate_sp }} onClick={this._makePhoneCall.bind(this, 2)}>再次呼叫</div>
                                            : null}
                                        {this.state.order_status == 1 ?
                                            <div style={{ ...styles.fr, ...styles.opereate, ...styles.opereate_sp }} onClick={this._eValuation.bind(this)}>立即评价</div>
                                            : this.state.order_status == 2 ?
                                                <Link to={{ pathname: `${__rootDir}/PhoneAnswerEvaluation`, state: { content: this.state.remark, isok: this.state.remark_status } }}><div style={{ ...styles.fr, ...styles.opereate, ...styles.opereate_sp }}>查看评价</div></Link>
                                                : ''
                                        }
                                    </div>
                                    : ''
                            }
                        </div>
                        : ''}
                    <div style={{ ...Common.alertDiv, display: this.state.addDisplay, width: '80%', left: '50%', marginLeft: "-40%", height: "auto" }}>
                        <div style={{ padding: "20px 15px" }}>{this.state.alert_title}<br />{this.state.alert_cont}</div>
                    </div>
                    <BlackAlert isShow={this.state.showLoginTips} word={this.state.alertCon} />
                </div>
                {this.state.showZixunAlert ?
                    <ZixunAlert
                        callDirections={this.callDirections}
                        from={this.from}
                        dismiss={() => {
                            //取消
                            this.setState({ showZixunAlert: false })
                        }}
                        confirm={(value, isNew) => {
                            //确认
                            if (isNew) {
                                this.callDirection = value;
                                this.callAnswerId = null;
                                this.expertId = this.expert_id
                            } else {
                                this.expertId = null
                            }
                            this.setState({ showCallphoneAlert: true })
                        }} /> : null}


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

                {this.state.showPinjiaAlert == "true" ?
                    <PinjiaAlert
                        id={this.state.id}
                        dismiss={() => {
                            //取消
                            this.setState({ showPinjiaAlert: "false" })
                        }}
                        confirm={() => {
                            localStorage.setItem("showPinjiaAlert","false")
                            if (this.state.id) {
                                Dispatcher.dispatch({
                                    actionType: 'CallAnswerDetail',
                                    status: {
                                        id: this.state.id, //会员电话答疑主数据ID(即答疑订单ID)
                                    }
                                })
                            }
                        }}
                    /> : null}

            </div>
        )
    }
}
export default PhoneAnswerUserDet;