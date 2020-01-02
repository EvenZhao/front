import React from 'react';
/**
 * 选择答疑方向弹窗
 * from 1: 新问题答疑  2:继续当前问题答疑
 */
export default class ZixunAlert extends React.Component {

    constructor(props) {
        super(props);



        // this.callDirections = [{ name: '税务方向', value: 1 }, { name: '财务方向', value: 0 }]
        this.callDirections = this.props.callDirections;
        this.datas2 = [{ name: '当前问题继续答疑', value: 3 }, { name: '新问题答疑', value: 4 }]
        this.state = {
            from: this.props.from,
            callDirection:this.callDirections.length>0?this.callDirections[0].value:1,
            datas2Value: this.props.from == 2?3:4,
        }
    }

    render() {
        return (
            <div style={styles.div_container}>
                <div style={styles.div_bg} onClick={() => {
                    this.props.dismiss();
                }} />
                <div style={styles.div_bottom}>
                    <div style={styles.div_navi}>
                        <div style={styles.div_naviCancel} onClick={() => {
                            this.props.dismiss();
                        }}>
                            取消
                        </div>
                        <div style={styles.div_naviConfirm} onClick={() => {
                            this.props.dismiss();
                            this.props.confirm(this.state.callDirection,this.state.datas2Value ==4?true:false);
                        }}>
                            确定
                        </div>
                    </div>
                    {/* 再次呼叫 当前问题继续答疑 */}
                    {this.state.from == 2 ?
                        <div style={styles.div_1}>
                            <span style={styles.span_1}>请选择</span>
                            <div style={styles.div_1_1}>
                                {this.datas2.map((item, i) => {
                                    return (
                                        <div style={{
                                            ...this.state.datas2Value == item.value ? styles.div_btn_check : styles.div_btn_nocheck, ...styles.div_btn,
                                        }} key={i} onClick={() => {
                                            this.setState({ datas2Value: item.value })
                                        }}>
                                            {item.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div> : null}
                    {this.state.from == 2 ?
                        <div style={styles.div_line} /> : null}
                    {/* //选择所要答疑的专业方向 */}
                    {this.state.from == 2 && this.state.datas2Value == 3 ? null :
                        <div style={styles.div_1}>
                            <span style={styles.span_1}>选择要答疑的专业方向</span>
                            <div style={styles.div_1_1}>
                                {this.callDirections.map((item, i) => {
                                    return (
                                        <div style={{
                                            ...styles.div_btn, ...this.state.callDirection == item.value ? styles.div_btn_check : styles.div_btn_nocheck,
                                        }} key={i} onClick={() => {
                                            this.setState({ callDirection: item.value })
                                        }}>
                                            {item.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>}
                </div>
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
        zIndex:999999
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
        width: devWidth,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'absolute',
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
        height: 160,
        background: '#ffffff'
    },
    span_1: {
        fontSize: 16,
        color: '#333333',
        marginTop: 30,
        marginLeft: 34,
    },
    div_1_1: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    div_btn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        height: 30,
        borderRadius: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        fontSize: 14,
        marginRight: 15
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
    }

}
