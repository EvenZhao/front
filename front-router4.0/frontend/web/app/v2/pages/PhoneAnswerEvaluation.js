import Dispatcher from '../AppDispatcher';
import React from 'react';
import EventCenter from '../EventCenter';
import Dm from '../util/DmURL';
import NavigationS from '../components/navigations'
// 评价详情
class PhoneAnswerEvaluation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isok: this.props.location.state.isok || 0,
            content: this.props.location.state.content || ''
        }
    }
    componentWillMount() {
        EventCenter.emit("SET_TITLE", '评价详情');
        if(this.state.id){
            Dispatcher.dispatch({
                actionType: 'CallAnswerDetail',
                status: {
                    id: this.state.id, //会员电话答疑主数据ID(即答疑订单ID)
                }
            })
        }
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }
    
    render() {
        return (
            <div style={{ ...styles.p_pAnswerEv}}>
                <NavigationS isShow={true} titles={'评价详情'} backFlag={false} />
                <div style={{ ...styles.content}}>
                    <div style={{ float:'left',fontSize: '16px',color: '#333',fontWeight: '600'}}>是否已解决您的问题：</div>
                    <div style={{ float:'right',fontSize: '16px',color: '#333',fontWeight: '600'}}>
                        {this.state.isok == 1 ?
                            <div>
                                <img style={{ marginRight:'10px',height: '20px', width: '20px', verticalAlign: 'middle'}} src={Dm.getUrl_img('/img/v2/PhoneAnswer/isok.png')}/><span style={{ color: '#2196F3'}}>已解决</span>
                            </div>
                            : this.state.isok == 2 ?
                            <div>
                                <img style={{ marginRight:'10px',height: '20px', width: '20px', verticalAlign: 'middle'}} src={Dm.getUrl_img('/img/v2/PhoneAnswer/nook.png')}/><span style={{ color: '#F29700'}}>未解决</span>
                            </div>
                            : this.state.isok == 3 ?
                            <div>
                                <img style={{ marginRight:'10px',height: '20px', width: '20px', verticalAlign: 'middle'}} src={Dm.getUrl_img('/img/v2/PhoneAnswer/nook1.png')}/><span style={{ color: '#E43636'}}>仍需答疑</span>
                            </div>
                            : ''
                        }
                    </div>
                    <div style={{ clear: 'both', height: 0}}></div>
                    <div style={{ borderTop:'1px solid #E5E5E5',marginTop:'30px'}}>
                        { this.state.content ?
                            <div style={{ paddingTop:'17px',fontSize: '14px',color: '#666'}}>{this.state.content}</div>
                            : ''
                        }
                        <div style={{ margin: '10px 0 30px',padding: '16px 20px',fontSize: '12px',color: '#333',lineHeight: '14px',backgroundColor:'#F3F3F3'}}>
                            {this.state.isok == 1 ?
                                '官方回复：谢谢您对我们服务的认可。'
                            :   
                                '官方回复：抱歉影响您的体验，我们将尽快对服务进行优化'
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
var styles = {
    p_pAnswerEv:{
        background: '#fff',
        height: devHeight,
    },
    content:{
        padding: '29px 25px 9px',
        margin: '20px 12px 0',
        boxShadow: ' 0 2px 20px 0 rgba(212,212,212,0.50)',
        borderRadius: '4px',
    },
}
export default PhoneAnswerEvaluation;