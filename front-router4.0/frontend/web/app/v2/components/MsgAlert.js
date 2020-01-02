import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';

import Common from '../Common'

/**
  title:标题,
  content:内容,
  leftText:左边按钮文字,
  rightText:右边按钮文字,
  onClickLeft:左边按钮点击回调
  onClickRight:右边按钮点击回调
 */
export default class MsgAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            content: this.props.content,
            leftText: this.props.leftText,
            rightText: this.props.rightText,
        }

    }


    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
            content: nextProps.content,
            leftText: nextProps.leftText,
            rightText: nextProps.rightText,
        })
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div style={{ ...styles.white_alert, display: this.props.isShow ? 'block' : 'none' }}>
                <div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>{this.state.title}</div>
                <div style={{ color: '#333', fontSize: Fnt_Medium, whiteSpace: 'pre-wrap', padding: '10px 12px 20px' }}>{this.state.content}</div>
                <div style={styles.alert_bottom}>
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', borderRight: 'solid 1px #d4d4d4', fontSize: Fnt_Medium, color: '#666666' }}
                        onClick={() => {
                            if (this.props.onClickLeft != null) {
                                this.props.onClickLeft();
                            }
                        }}>{this.state.leftText}</div>
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: '#2196f3', fontWeight: 'bold' }}
                        onClick={() => {
                            if (this.props.onClickRight != null) {
                                this.props.onClickRight();
                            }
                        }}>{this.state.rightText}</div>
                </div>
            </div>
        )
    }
}
var styles = {
    white_alert: {
        width: devWidth - 60,
        height: 'auto',
        backgroundColor: Common.Bg_White,
        borderRadius: 12,
        position: 'absolute',
        zIndex: 1000,
        top: 180,
        left: 30,
        textAlign: 'center'
    },
    alert_bottom: {
        // position: 'absolute',
        // zIndex: 201,
        // bottom: 0,
        // left: 0,
        width: devWidth - 60,
        height: 40,
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#d4d4d4',
        display: 'flex',
        flex: 1,
    },
}
