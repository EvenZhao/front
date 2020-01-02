import React from 'react';
import Dm from '../../util/DmURL'
import BlackAlert from '../../components/BlackAlert';
import Dispatcher from '../../AppDispatcher';
import EventCenter from '../../EventCenter';
/**
 * 评价框
 *
 */
export default class PinjiaAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            remarkStatus: 1,
            pjLength: 60,
            showLoginTips: false,
            alertCon: '',
        }
        this.datas1 = [{ name: '已解决', value: 1 }, { name: '未解决', value: 2 }, { name: '仍需答疑', value: 3 }]
        this.id = this.props.id;
        this.remark = '';

    }


    componentWillMount() {
        this.e_CallAnswerSaveRemark = EventCenter.on('CallAnswerSaveRemark', this._callAnswerSaveRemark.bind(this));
    }

    componentWillUnmount() {
        this.e_CallAnswerSaveRemark.remove();
    }

    _callAnswerSaveRemark(data) {
        console.log("_callAnswerSaveRemark: " + JSON.stringify(data));
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
        this.props.dismiss();
        this.props.confirm();
    }

    _submit() {

        if (!this.remark && (this.state.remarkStatus == 2 || this.state.remarkStatus == 3)) {
            this.setState({ showLoginTips: true, alertCon: '请您输入评价' }, () => {
                setTimeout(() => {
                    this.setState({
                        showLoginTips: false,
                        alertCon: ''
                    })
                }, 2000)
            })
            return;
        }
        console.log("id:  咨询订单ID  " + this.id);
        console.log("remarkStatus: 评价选项值" + this.state.remarkStatus);
        console.log("callRole: 评价具体内容" + this.remark);
        Dispatcher.dispatch({
            actionType: 'CallAnswerSaveRemark',
            id: this.id,
            remarkStatus: this.state.remarkStatus,
            remark: this.remark,
        })
    }

    render() {
        return (
            <div style={styles.div_container}>
                <div style={styles.div_bg} onClick={() => {
                    if (this.props.dismiss) {
                        this.props.dismiss();
                    }
                }} />
                <div style={styles.div_bottom}>
                    <div style={styles.div_navi}>
                        <div style={styles.div_naviCancel} onClick={() => {
                            if (this.props.dismiss) {
                                this.props.dismiss();
                            }
                        }}>
                            取消
                        </div>
                        <span style={styles.span_3}>请您评价</span>
                        <div style={styles.div_naviConfirm} onClick={this._submit.bind(this)}>
                            提交
                        </div>
                    </div>
                    <div style={styles.div_1}>
                        <span style={styles.span_1}>是否已解决您的问题</span>
                        <div style={styles.div_1_1}>
                            {this.datas1.map((item, i) => {
                                return (
                                    <div style={{
                                        ...this.state.remarkStatus == item.value ? styles.div_btn_check : styles.div_btn_nocheck, ...styles.div_btn,
                                    }} key={i} onClick={() => {
                                        this.setState({ remarkStatus: item.value })
                                    }}>
                                        {item.name}
                                    </div>
                                )
                            })}
                        </div>
                        {this.state.remarkStatus == 2 || this.state.remarkStatus == 3 ?
                            <span style={styles.span_2}>抱歉影响您的体验，我们将尽快对服务进行优化</span> : null}
                    </div>
                    {this.state.remarkStatus == 2 || this.state.remarkStatus == 3 ?
                        <div style={styles.div_input_1}>
                            <textarea
                                ref = {(ref) => this.ta = ref}
                                maxLength={60}
                                style={styles.div_input_2}
                                onChange={(e) => {
                                    var v = e.target.value.trim();
                                    this.setState({ pjLength: 60 - v.length })
                                    this.remark = v;
                                }}
                                placeholder='您的评价与建议对我们非常重要'
                                type="text" 
                                onFocus={()=>{
                                    this.ta.style.borderColor = '#2196F3'
                                }}
                                onBlur={()=>{
                                    this.ta.style.borderColor = '#E5E5E5'
                                }}/>
                            <div style={styles.div_input_3}>
                                <span style={styles.span_4}>{this.state.pjLength}</span>
                            </div>
                        </div> : null}
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
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
    },
    div_bg: {
        backgroundColor: '#000000',
        width: devWidth,
        height: devHeight,
        opacity: 0.3,
    },
    div_bottom: {
        display: 'flex',
        width: devWidth,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'fixed',
        zIndex: 999999,
        left: 0,
        bottom: 0
    },
    div_navi: {
        display: 'flex',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#E5E5E5'
    },
    div_naviCancel: {
        display: 'flex',
        width: 70,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        color: '#333333'
    },
    div_naviConfirm: {
        display: 'flex',
        width: 70,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        color: '#2196F3'
    },
    div_line: {
        width: devWidth - 24,
        height: 1,
        marginLeft: 12,
        backgroundColor: '#E5E5E5'
    },
    div_1: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 155,
        background: '#ffffff'
    },
    span_1: {
        fontSize: 16,
        color: '#333333',
        marginTop: 20,
    },
    span_2: {
        fontSize: 12,
        color: '#2196F3',
        marginTop: 18,
    },
    span_3: {
        color: '#666666',
        fontSize: 14
    },
    span_4: {
        fontSize: 14,
        color: '#A4A4A4',
        marginRight: 16
    },
    div_1_1: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: devWidth - 40,
        marginLeft: 20,
        marginRight: 20,
    },
    div_btn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 30,
        borderRadius: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        fontSize: 14,
    },
    div_btn_nocheck: {
        borderColor: '#BDBDBD',
        color: '#9E9E9E',
        backgroundColor: '#ffffff'
    },
    div_btn_check: {
        borderColor: '#2196F3',
        color: '#2196F3',
        backgroundColor: '#E3F1FC'
    },
    div_input_1: {
    },
    div_input_2: {
        width: devWidth,
        height: 137,
        boxSizing: 'border-box',
        fontSize: 14,
        padding: '20px',
        outline:'none',
        border: '0.5px solid #E5E5E5',
        borderWidth: '0.5px 0',
        boxShadow:'none'
    },
    div_input_3: {
        display: 'flex',
        height: 37,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    div_input_img: {
        position: 'absolute',
        top: 18,
        left: 15,
        width: 14,
        height: 14
    }

}
