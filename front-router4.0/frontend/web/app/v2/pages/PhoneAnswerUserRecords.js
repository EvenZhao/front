import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Dm from '../util/DmURL';
import NavigationS from '../components/navigations'
import ZixunAlert from '../components/phoneanswer/ZixunAlert'
import CallphoneAlert from '../components/phoneanswer/CallphoneAlert'
import BlackAlert from '../components/BlackAlert';
/**
 * 答疑记录列表页面
 */
class PhoneAnswerUserRecords extends React.Component {

    constructor(props) {
        super(props);
        this.status = this.props.location.state.status

        this.state = {
            table: this.status == 'all' ? 1 : 2,
            datas: [],
            showZixunAlert: false,
            showCallphoneAlert: false,
            showLoginTips: false,
            alertCon: '',
        }
        this.limit = 15;
        this.skip = 0;

        this.callerNum = this.props.location.state.phone
        this.callDirection = 0; //答疑方向 默认传0
        this.expertId;
        this.callAnswerId;

        this.from = 2;
        this.callDirections = [];
    }

    componentWillMount() {
        EventCenter.emit("SET_TITLE", '铂略财课-答疑记录');
        this.e_CallAnswerRecordsUser = EventCenter.on('CallAnswerRecordsUser', this._callAnswerRecordsUser.bind(this));
    }

    componentDidMount() {
        this._getDatas();
    }
    _getDatas() {
        Dispatcher.dispatch({
            actionType: 'CallAnswerRecordsUser',
            status: this.status,
            skip: this.skip,
            limit: this.limit,
        })
    }

    componentWillUnmount() {
        this.e_CallAnswerRecordsUser.remove();
    }

    _callAnswerRecordsUser(data) {
        console.log("_callAnswerRecordsUser: " + JSON.stringify(data));
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
                datas: newDatas
            }, () => {
                this.skip = newDatas.length;
            })
        }

    }

    _callTeacher(expert_id, id, call_direction, order_status, is_finance, is_taxation) {
        this.expertId = expert_id;
        this.callAnswerId = id;
        this.callDirection = call_direction
        this.callDirections = [];
        if (is_finance) {
            this.callDirections.push({ name: '财务方向', value: 0 })
        }
        if (is_taxation) {
            this.callDirections.push({ name: '税务方向', value: 1 })
        }
        if (order_status == 1 || order_status==0) {
            this.from = 2;
        } else {
            this.from = 1;
        }
        this.setState({ showZixunAlert: true })


    }

    //答疑详情
    _callDetail(id, expert_id,order_status) {
        localStorage.setItem("showPinjiaAlert", order_status == 1?"true":"false")
        this.props.history.push({
            pathname: `${__rootDir}/PhoneAnswerUserDet/${id}`,
            state: { page: 2, phone: this.callerNum, expertId: expert_id}
        });
    }

    render() {
        return (
            <div style={{ width: devWidth, height: devHeight, backgroundColor: '#fff' }}>
                <NavigationS isShow={true} titles={'答疑记录'} backFlag={false} />
                {this.renderTabelK()}
                {this.state.datas.length == 0 ?
                    <li style={styles.no_data}>
                        <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={styles.no_data_img} />
                        <p style={styles.no_data_p}>暂无相关数据~</p>
                    </li>
                    :
                    <div ref={e => { this.divScroll = e }} style={{ ...styles.div_table, height: devHeight - 103 }}
                        onScroll={(e) => {
                            let { clientHeight, scrollHeight, scrollTop } = this.divScroll;
                            if (scrollHeight - (clientHeight + scrollTop) < 50) {
                                this._getDatas();
                            }
                        }}>
                        {this.state.datas.map((item, i) => {
                            return (
                                this.renderItem(item, i)
                            )
                        })}
                    </div>}

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
                            } else {
                                this.expertId = null
                            }
                            this.setState({ showCallphoneAlert: true })
                        }} /> : null}


                {this.state.showCallphoneAlert ?
                    <CallphoneAlert
                        expertId={this.expertId}
                        callAnswerId={this.callAnswerId}
                        callRole={0}
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
                <BlackAlert isShow={this.state.showLoginTips} word={this.state.alertCon} />
            </div>
        )
    }

    renderItem(item, i) {
        const { id, expert_id, order_no, create_time, name, photo,
            call_direction, last_call_time,
            order_status, title, expert_status, is_finance, is_taxation } = item;
        return (
            <div style={styles.div_item} key={i}>
                <div style={styles.div_item_12}>
                    <span style={styles.div_item_span4}>
                        答疑单号：{order_no}
                    </span>
                </div>
                <div style={styles.div_item_1} onClick={this._callDetail.bind(this, id, expert_id,order_status)}>
                    {/* 图标 在线 */}
                    <div style={styles.div_item_2}>
                        <img src={photo} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        {expert_status == 0 || expert_status == 1 || expert_status == 2 ?
                            <div style={{ ...styles.div_item_3, backgroundColor: expert_status == 0 ? '#89899A' : expert_status == 1 ? '#3BC1A7' : '#F29700' }}>
                                {expert_status == 0 ? '休息' : expert_status == 1 ? '在线' : '忙碌'}
                            </div> : null}
                    </div>
                    {/* 名字税务时间   */}
                    <div style={styles.div_item_4}>
                        <div style={styles.div_item_5}>
                            <span style={styles.div_item_span1}>{name}</span>
                            <span style={styles.div_item_span2}>{title}</span>
                        </div>
                        <div style={styles.div_item_6}>
                            <div style={{
                                ...styles.div_item_7, color: call_direction == 0 ? '#975900' : '#276BA0', background: call_direction == 0 ? '#FDEED5' : '#D5EAFB',
                            }}>{call_direction == 0 ? '财务' : '税务'}方向
                            </div>
                        </div>
                        <div style={styles.div_item_8}>
                            最近连线时间：{last_call_time}
                        </div>
                    </div>
                    {order_status == 0 ? null :
                        <div style={{
                            ...styles.div_item_9,
                            borderColor: order_status == 1 ? '#F4A724' : '#333333',
                            color: order_status == 1 ? '#F4A724' : '#333333'
                        }}>
                            {order_status == 1 ? '待评价' : '已评价'}
                        </div>}
                </div>
                {expert_status == 0 || expert_status == 1 || expert_status == 2 || order_status == 1 ?
                    <div style={styles.div_item_line} /> : null}

                {expert_status == 0 || expert_status == 1 || expert_status == 2 || order_status == 1 ?
                    <div style={styles.div_item_10}>
                        {expert_status == 0 || expert_status == 1 || expert_status == 2 ?
                            <div style={styles.div_item_11} onClick={this._callTeacher.bind(this, expert_id, id, call_direction, order_status, is_finance, is_taxation)}>
                                <img src={Dm.getUrl_img('/img/v2/PhoneAnswer/psmall.png')} style={styles.div_item_img1} />
                                <span style={styles.div_item_span3}>再次呼叫</span>
                            </div> : null}
                        {order_status == 1 ?
                            <div style={styles.div_item_11} onClick={this._callDetail.bind(this, id, expert_id,order_status)}>
                                <img src={Dm.getUrl_img('/img/v2/PhoneAnswer/comment.png')} style={styles.div_item_img2} />
                                <span style={styles.div_item_span3}>立即评价</span>
                            </div> : null}

                    </div> : null}

            </div>
        )
    }

    renderTabelK() {
        return (
            <div style={styles.div_1}>
                <div style={styles.div_1_1}
                    onClick={() => {
                        this.setState({ table: 1, datas: [] }, () => {
                            this.status = 'all'
                            this.skip = 0;
                            this._getDatas();
                        })
                    }}
                >
                    <div style={{
                        ...styles.div_1_1_1,
                        ...this.state.table == 1 ? styles.div_1_1_1_check : styles.div_1_1_1_nocheck,
                    }}>全部</div>
                </div>
                <div style={styles.div_1_1}
                    onClick={() => {
                        this.setState({ table: 2, datas: [] }, () => {
                            this.status = 'unRemark'
                            this.skip = 0;
                            this._getDatas();
                        })
                    }}
                >
                    <div style={{
                        ...styles.div_1_1_1,
                        ...this.state.table == 2 ? styles.div_1_1_1_check : styles.div_1_1_1_nocheck,
                    }}>待评价</div>
                </div>
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
    line: {
        width: devWidth,
        height: 1,
        backgroundColor: '#f4f4f4'
    },

    div_1: {
        display: 'flex',
        width: devWidth,
        height: 41,
        borderBottomColor: '#808080',
        borderBottomWidth: 0.5,
        borderBottomStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
    },
    div_1_1: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    div_1_1_1: {
        display: 'flex',
        height: 41,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
    },
    div_1_1_1_check: {
        color: '#2196F3',
        borderBottom: '2px solid #2196F3'
    },
    div_1_1_1_nocheck: {
        color: '#000000',
        borderBottom: '2px solid transparent'
    },

    div_table: {
        display: 'flex',
        flexDirection: 'column',
        width: devWidth,
        alignItems: 'center',
        overflow: 'auto',
        paddingTop: 20,
    },
    div_item: {
        // display: 'flex',
        width: devWidth - 20,
        borderRadius: 8,
        boxShadow: '0 2px 20px 0 #D1D1D1',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        marginBottom: 20
    },
    div_item_1: {
        display: 'flex',
        height: 100,
        flexDirection: 'row',
        position: 'relative',
    },
    div_item_2: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 15,
        marginLeft: 15,
        width: 55,
        height: 55,
        position: 'relative'
    },
    div_item_3: {
        paddingRight: 5,
        paddingLeft: 5,
        height: 16,
        lineHeight: '16px',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 10,
        position: 'absolute',
        right: 0,
        top: 35,
        color: '#ffffff',
    },
    div_item_4: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginRight: 8,
        marginLeft: 8,
        justifyContent:'center'
    },
    div_item_5: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    div_item_span1: {
        fontSize: 16,
        color: '#000000'
    },
    div_item_span2: {
        fontSize: 12,
        color: '#999999',
        marginLeft: 5
    },
    div_item_6: {
        display: 'flex',
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    div_item_7: {
        display: 'flex',
        paddingLeft: 10,
        paddingRight: 10,
        height: 20,
        borderRadius: 10,
        lineHeight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 11,
    },
    div_item_8: {
        fontSize: 11,
        color: '#999999',
        marginTop: 8
    },
    div_item_9: {
        borderWidth: 1,
        borderStyle: 'solid',
        display: 'flex',
        top: 18,
        right: 15,
        width: 50,
        height: 25,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        position: 'absolute'
    },
    div_item_line: {
        width: devWidth - 30 - 80,
        backgroundColor: '#f3f3f3',
        height: 1,
        marginRight: 17,
        float: 'right'
    },
    div_item_10: {
        marginTop: 15,
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom:15
    },
    div_item_11: {
        borderWidth: 1,
        borderColor: '#2196f3',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        marginRight: 15,
        width: 90,
        height: 30,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    div_item_span3: {
        fontSize: 14,
        color: '#2196F3',
        marginLeft: 5
    },
    div_item_span4: {
        fontSize: 12,
        color: '#999999'
    },
    div_item_12: {
        height: 40,
        paddingLeft: 15,
        backgroundColor: '#FBFBFB',
        paddingRight: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    div_item_img1: {
        width: 12,
        height: 13.5
    },
    div_item_img2: {
        width: 12,
        height: 12
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
export default PhoneAnswerUserRecords;