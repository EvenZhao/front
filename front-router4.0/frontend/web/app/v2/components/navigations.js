import React from 'react';

class navigations extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }

    render() {
        return (
            <div style={{ ...styles.nav, ...styles.relatv, display: this.props.isShow ? 'block' : 'none' }}>
                <span style={{ ...styles.abs, ...styles.nav__back }} onClick={this.props.backFlag ? this._close.bind(this) : this._goBack.bind(this)}><img height="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAsCAYAAAB7aah+AAAABGdBTUEAALGPC/xhBQAAAQhJREFUWAnV19kNgzAMBmDSjpE1GIDNSjdr35mDNSh/K6wgcvl6qKWghMMffoozDP8c4zjOGGkN93RhMQewbdtjzzXFGMO6ri/kNYUSBLkRhIXfWn/NIJQ0hPC80UoxqSFHWnVFLQTVLMsyq6BeBFWJIQ4ihriICJIgbEiKsCAN0g1pkS7IAmlCVkgVskSKkDWShTyQC+SFnCBPhCBvBJDJxodErfj2DGgg0EjsL0+FD2jvLzxv3qbmxBsjCL/kiZ0gT+wCeWFZyAMrQtZYFbLEmpAV1gVZYN2QFmNBGowNSTERJMHEEBdTQRxMDfVg+2HsbQLVsOPEZwblsAPBM5dAs4PhkryV9ANO+jBuBAE9dgAAAABJRU5ErkJggg==" alt="" /></span>
                <div style={{ ...styles.nav__tit }}>{this.props.titles}</div>
            </div>
        )
    }
    _close() {
        //移除线下课报名本地存储数据
        localStorage.removeItem('initData')
        localStorage.removeItem('times')
        localStorage.removeItem('addCompanyUserList')
        localStorage.clear();
        if (headersDatas && headersDatas.bolueclient == 'ios') {
            // 写入返回按钮，用于ios
            window.webkit.messageHandlers.close.postMessage('1')
        }else{
            Android && Android.close()
        }
    }
    _goBack() {
        if (headersDatas && headersDatas.bolueclient == 'ios') {
            // 写入返回按钮，用于ios
            window.webkit.messageHandlers.goBack.postMessage('1')
        }else{
            Android && Android.goBack()
        }
    }
}
var styles = {
    "abs": {
        "position": "absolute",
        "zIndex": 2
    },
    "nav": {
        "display": "none",
        "width": "100%",
        "height": "39px",
        "backgroundColor": "#fff",
        "color": "#333",
        "fontSize": "16px",
        "lineHeight": "39px",
        "borderBottom": '0.5px solid #e9e9e9',
    },
    "nav__back": {
        "padding": "5px 0 0 10px",
        "width": "60px",
        "top": "0",
        "left": "0"
    },
    "nav__tit": {
        "overflow": "hidden",
        "textOverflow": "ellipsis",
        "whiteSpace": "nowrap",
        "textAlign": "center",
        "padding": "0 10%",
        "width": '80%',
        "height": '100%'
    },
}
export default navigations;