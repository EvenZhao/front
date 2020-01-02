import React from 'react';
import Dm from '../util/DmURL';
class navigations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: this.props.page || 2,
            dataList: this.props.dataList || [],
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
        dataList: nextProps.dataList,
        })
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }

    render() {
        var LIST = this.state.dataList.map((item, index) => {
            var _ls =  (index == this.state.dataList.length - 1) ? styles.li_last : {};
            return (
                <li key={index} style={{ ...styles.li, ..._ls}}>
                    <img style={{ ...styles.li_ico}} src={Dm.getUrl_img('/img/v2/PhoneAnswer/' + (item.isCallIn == 1 ? 'in.png' : 'out.png'))}/>
                    <div style={{ ...styles.li_time, ...item.call_status == 1 ? styles.red : ''}}>{item.call_start_time}</div>
                    <div style={{ ...styles.li_status, ...item.call_status == 1 ? styles.red : ''}}>
                        {
                            item.answerer_type == 1 && this.state.page == 1 ? '转接至客服'
                            : item.call_status == 0 ? '实际未拨出'
                            : item.call_status == 1 ? '未接通'
                            : item.call_status == 2 ? item.call_used_time 
                            : ''
                        }
                    </div>
                    <div style={{ ...styles.clearfix}}></div>
                </li>
            )
        });
        return (
            <div>
                <div style={{ ...styles.h3}}>通话记录</div>
                <ul style={{ ...styles.pageList}}>{LIST}</ul>
            </div>
        )
    }
    
}
var styles = {
    h3: {
        margin: '20px 25px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#000',
        lineHeight: '20px'
    },
    pageList: {
        background: '#fff',
        borderRadius: '8px',
        margin: '0 10px',
        padding: '0 20px',
        boxShadow: '0 2px 20px 0 #D1D1D1'
    },
    li: {
        padding: '20px 0',
        borderBottom: '1px solid #E4E6EF',
        lineHeight: '20px'
    },
    li_last: {
        borderBottom:0
    },
    li_ico: {
        width: '15px',
        height: '15px',
        display: 'inline-block',
        verticalAlign: 'middle',
        float: 'left'
    },
    li_time: {
        fontSize: '14px',
        color: '#999',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: '26px',
        float: 'left'
    },
    li_status: {
        fontSize: '14px',
        color: '#333',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: '26px',
        float: 'right'
    },
    clearfix: {
      display: 'block',
      fontSize: '0',
      content: "\" \"",
      clear: 'both',
      height: '0',
      lineHeight: '0'
    },
    red: {
        color: '#E43636'
    }
}
export default navigations;