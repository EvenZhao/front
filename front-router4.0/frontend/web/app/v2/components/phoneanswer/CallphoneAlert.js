import React from 'react';
import Dm from '../../util/DmURL'
import Dispatcher from '../../AppDispatcher';
import EventCenter from '../../EventCenter';
import BlackAlert from '../../components/BlackAlert';
/**
 * 拨打电话弹窗
 */
export default class CallphoneAlert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertType: 1, // 1: 拨打电话弹窗 2：修改电话弹窗
            isPhone: true,
            showLoginTips: false,
            alertCon: '',
        }

        this.expertId = this.props.expertId;
        this.callAnswerId = this.props.callAnswerId;
        this.callRole = this.props.callRole;
        this.callerNum = this.props.callerNum;
        this.callDirection = this.props.callDirection;
    }


    componentWillMount() {
        this.e_CallAnswerMakeCall = EventCenter.on('CallAnswerMakeCall', this._callAnswerMakeCall.bind(this));
        if (!this.callerNum) {
            this.setState({ alertType: 2 })
        }
    }

    componentWillUnmount() {
        this.e_CallAnswerMakeCall.remove();
    }

    _callAnswerMakeCall(data) {
        console.log("_callAnswerMakeCall: " + JSON.stringify(data));
        const { err, user, result } = data
        if (err) {
            //错误
            this.setState({ showLoginTips: true, alertCon: err }, () => {
                setTimeout(() => {
                    this.setState({
                        showLoginTips: false,
                        alertCon: ''
                    })
                    this.props.dismiss();
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
                    this.props.dismiss();
                }, 2000)
            })
            return;
        }
        //调用拨打电话
        var bc = localStorage.getItem("bolueClient");
        if (bc == 'ios') {
            window.webkit.messageHandlers.callPhone.postMessage(result.xphone)
        } else if (bc == 'miniprogram') {
            wx.miniProgram.postMessage({ data: result.xphone });
            wx.miniProgram.navigateBack()
        } else {
            Android && Android.callPhone(result.xphone)
        }
        this.props.dismiss && this.props.dismiss();
        // this.setState({
        //     showLoginTips: true,
        //     alertCon: '<a href="tel:'+xphone+'" style="color:#fff">进入拨号界面</a>'
        // });
    }

    _callBing() {
        console.log("expertId:  答疑专家ID" + this.expertId);
        console.log("callAnswerId: 答疑订单ID" + this.callAnswerId);
        console.log("callRole: 呼叫发起角色" + this.callRole);
        console.log("callerNum:  呼叫发起号码" + this.callerNum);
        console.log("callDirection: 答疑方向" + this.callDirection);
        Dispatcher.dispatch({
            actionType: 'CallAnswerMakeCall',
            expertId: this.expertId,
            callAnswerId: this.callAnswerId,
            callRole: this.callRole,
            callerNum: this.callerNum,
            callDirection: this.callDirection,
        })
    }

    _changBorder1(){
        this.spInput.style.borderColor = '#2196f3'
    }
    _changBorder2(){
        this.spInput.style.borderColor = '#757575'
    }

    render() {
        if (this.state.alertType == 1) {
            let phone = this.props.callerNum ? this.props.callerNum.toString().replace(/^(.{3})(.*)(.{4})$/, '$1-$2-$3') : '';
            return (
                <div style={styles.div_container}>
                    <div style={styles.div_bg} onClick={() => {
                        this.props.dismiss();
                    }} />
                    <div style={{
                        ...styles.div_bottom, height: 313,
                        top: (devHeight - 313) / 2,
                    }}>
                        <div style={styles.div_1}>
                            <div>
                                <img src={Dm.getUrl_img('/img/v2/PhoneAnswer/callout.png')} style={styles.div_1_img1} />
                            </div>
                            <span style={styles.span_1}>将使用该号码进行加密呼出</span>
                            <span style={styles.span_2}>{phone}</span>
                            <div style={styles.div_2_1} onClick={() => {
                                this.setState({ alertType: 2 },()=>{
                                    this.callerNum = ""
                                })
                            }}>若非本机号码请修改 ›</div>
                            <span style={styles.span_3}>请在点击<span style={styles.span_4}>立即呼叫</span>之后的1分钟内完成系统<br />拨打操作，否则将无法成功接通。</span>
                        </div>
                        <div style={styles.div_2}>
                            <div style={styles.div_2_cancel} onClick={() => {
                                this.props.dismiss();
                            }}>
                                取消
                            </div>
                            <div style={styles.div_2_line} />
                            <div style={styles.div_2_com} onClick={() => {
                                this._callBing();
                            }}>
                                立即呼叫
                            </div>
                        </div>
                    </div>
                    <BlackAlert isShow={this.state.showLoginTips} word={this.state.alertCon} />
                </div>
            )
        }
        return (
            <div style={styles.div_container}>
                <div style={styles.div_bg} onClick={() => {
                    this.props.dismiss();
                }} />
                <div style={{
                    ...styles.div_bottom, height: 209,
                    top: (devHeight - 209) / 2,
                }}>
                    <div style={styles.div_1}>
                        <span style={styles.span_1_r}>将使用该号码进行加密呼出</span>
                        <input
                            ref={(ref) => this.spInput = ref}
                            style={styles.input}
                            onChange={(e) => {
                                this.callerNum = e.target.value
                            }}
                            placeholder='请输入本机有效手机号'
                            type={"number"}
                            onFocus={this._changBorder1.bind(this)} 
                            onBlur= {this._changBorder2.bind(this)}/>
                        {this.state.isPhone ? null : <span style={{ color: '#ff0000', fontSize: 10 }}>请输入正确的手机号</span>}
                        <span style={styles.span_2_r}>请在点击<span style={styles.span_3_r}>立即呼叫</span>之后的1分钟内完成系统<br />拨打操作，否则将无法成功接通。</span>
                    </div>
                    <div style={styles.div_2}>
                        <div style={styles.div_2_cancel} onClick={() => {
                            this.props.dismiss();
                        }}>
                            取消
                            </div>
                        <div style={styles.div_2_line} />
                        <div style={styles.div_2_com} onClick={() => {
                            if (isCellPhoneAvailable(this.callerNum)) {
                                this.setState({ isPhone: true }, () => {
                                    this._callBing();
                                })
                            } else {
                                this.setState({ isPhone: false })
                            }
                        }}>
                            立即呼叫
                            </div>
                    </div>
                </div>
                <BlackAlert isShow={this.state.showLoginTips} word={this.state.alertCon} />
            </div>
        )
    }
}
var styles = {
    div_container: {
        width: devWidth,
        height: devHeight,
        position: 'absolute',
        top: 0,
        zIndex: 999999
    },
    div_bg: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#000000',
        width: devWidth,
        height: devHeight,
        opacity: 0.3,
    },
    div_bottom: {
        display: 'flex',
        width: 270,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'absolute',
        borderRadius: 12,
        alignItems: 'center',
        left: (devWidth - 270) / 2,
    },
    div_1: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    div_1_img1: {
        width: 98,
        height: 98
    },
    div_2: {
        display: 'flex',
        flexDirection: 'row',
        height: 43,
        width: 270,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        borderTopStyle: 'solid'
    },
    div_2_cancel: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 17,
        color: '#666666'
    },
    div_2_com: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 17,
        color: '#2196F3'
    },
    div_2_line: {
        width: 1,
        height: 43,
        backgroundColor: '#E5E5E5'
    },
    span_1: {
        fontSize: 12,
        color: '#030303',
        marginTop: 5,
    },
    span_2: {
        fontSize: 24,
        color: '#030303'
    },
    span_3: {
        fontSize: 11,
        color: '#999999',
        textAlign: 'center'
    },
    span_4: {
        fontSize: 11,
        color: '#2A2A2A'
    },
    div_2_1: {
        fontSize: 14,
        color: '#2196F3',
        paddingTop: 10,
        paddingBottom: 20
    },
    span_1_r: {
        fontSize: 17,
        color: '#030303'
    },
    input: {
        borderStyle: 'solid',
        borderColor: '#757575',
        paddingRight: 5,
        paddingLeft: 7,
        width: 200,
        borderWidth: 1,
        marginTop: 8,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 2,
        height: 30,
        outline:'none'
    },
    span_2_r: {
        fontSize: 11,
        color: '#999999',
        textAlign: 'center'
    },
    span_3_r: {
        fontSize: 11,
        color: '#2A2A2A'
    },
}
