import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import async from 'async'
import Common from '../Common';

class MyQaListFilter extends React.Component {
    constructor(props) {
        super(props);

        //上方标签
        this.wx_config_share_home = {
            title: '铂略咨询-财税领域实战培训供应商',
            desc: '企业财务管理培训,财务培训课程,税务培训课程',
            link: document.location.href + '',
            imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
            type: 'link'
        };

        this.label = [{ label_id: null, name: '全部话题' }];

        this.newList = [{ id: 1, type: '最热' }, { id: 0, type: '最新' }, { id: 2, type: '待回答' }];

        this.isStatus = [{ id: 0, type: '全部类型' }, { id: 1, type: '普通问题' }, { id: 2, type: '电话预约专家诊断问题' }]

        this.backNotloadLabel = {
            chooseLabel: {
                label_name: '',
                idx: '',
                item_left: '',
                idx_left: '',
                item_right: '',
                idx_right: ''
            }
        } //用于保存返回页面时标签的状态值 标签数组

        this.state = {
            label_up: false,
            newList_up: false,
            status_up: false,
            label_name: '全部话题',
            newList_name: '最热',
            status_name: '全部类型',
            label_id: '',
            newList_id: 1, //(0：最新 / 1：最热)
            status_id: 2, //(0：已回答 / 1：待回答 / 2：所有状态)
            label: this.label,
            //是否显示遮罩层
            mask_display: 'none',
            question_type: 0,
        };
    }

    _labelUp() {
        this.setState({
            label_up: false,
            newList_up: false,
            status_up: false,
        })
    }
    _handleMyPersonalizedMore(re) {
        console.log('_handleMyPersonalizedMore', re);
        var status = {
            topic_id: this.state.label_id,
            not_answer: this.state.status_id,
            type: this.state.newList_id,
            question_type: this.state.question_type,
            limit: 15,
            skip: re,
            LoadMore: true
        }
        const les_status = { ...status }
        Dispatcher.dispatch({
            actionType: 'myPersonalRecommend',
            les_status
        })
    }
    componentDidMount() {
        //全部话题标签
        Dispatcher.dispatch({
            actionType: 'QuestionLabel',
            personal: 1,
        })
        var status = {
            type: 1, //(0：最新 / 1：最热)
            topic_id: null, //(不传或null则为全部话题)
            not_answer: 2, //(0：已回答 / 1：待回答 / 2：所有状态)
            limit: 15, //
            question_type: 0,
            skip: 0, //数据过滤条数
        }
        const les_status = { ...status }
        Dispatcher.dispatch({
            actionType: 'myPersonalRecommend',
            les_status
        })


        this._QuestionLabel = EventCenter.on('QuestionLabelDone', this._handleQuestionLabelDone.bind(this));

        this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
        this._labelUp = EventCenter.on('labelUp', this._labelUp.bind(this))
        this._MyPersonalizedMore = EventCenter.on("MyPersonalizedMore", this._handleMyPersonalizedMore.bind(this))
    }

    componentWillUnmount() {
        this._getLabelList.remove()
        this._labelUp.remove()
        this._QuestionLabel.remove()
        this._MyPersonalizedMore.remove()
    }

    _handleFetchLableListDone(re) {


    }

    _handleQuestionLabelDone(re) {
        if (re) {
            this.setState({
                label: this.label.concat(re.result)
            })
        }
    }

    //选择其中一个筛选条件
    //展开筛选
    clickLabel(label) {
        // this.setState({
        //  mask_display:'block',
        // })
        if (label == 'label') {
            if (!this.state.label_up == false) {
                this.setState({
                    label_up: !this.state.label_up,
                    newList_up: false,
                    status_up: false,
                    mask_display: 'none',
                })
            } else {
                this.setState({
                    label_up: !this.state.label_up,
                    newList_up: false,
                    status_up: false,
                    mask_display: 'block',
                })
            }
        } else if (label == 'newList') {
            if (!this.state.newList_up == false) {
                this.setState({
                    label_up: false,
                    newList_up: !this.state.newList_up,
                    status_up: false,
                    mask_display: 'none',
                })
            } else {
                this.setState({
                    label_up: false,
                    newList_up: !this.state.newList_up,
                    status_up: false,
                    mask_display: 'block',
                })
            }

        } else if (label == 'isStatus') {
            if (!this.state.status_up == false) {
                this.setState({
                    label_up: false,
                    newList_up: false,
                    status_up: !this.state.status_up,
                    mask_display: 'none',
                })
            } else {
                this.setState({
                    label_up: false,
                    newList_up: false,
                    status_up: !this.state.status_up,
                    mask_display: 'block',
                })
            }

        }
    }

    //选择筛选展开列表
    //关闭筛选
    clickTab(idx, type) {
        // console.log('clickTab===',idx+'d-----'+type);
        var status = {}
        if (type == 'label') {
            this.setState({
                label_name: this.state.label[idx].name,
                label_id: this.state.label[idx].id,
                label_up: false,
                status_id: 2,
                mask_display: 'none',
            }, () => {
                status = {
                    topic_id: this.state.label_id,
                    not_answer: this.state.status_id,
                    type: this.state.newList_id,
                    question_type: this.state.question_type,
                    limit: 15,
                    skip: 0
                }
                const les_status = { ...status }
                Dispatcher.dispatch({
                    actionType: 'myPersonalRecommend',
                    les_status
                })
            })
        } else if (type == 'newList') {
            if (idx !== 2) {
                this.setState({
                    newList_name: this.newList[idx].type,
                    newList_id: this.newList[idx].id,
                    newList_up: false,
                    status_id: 2,
                    mask_display: 'none',
                }, () => {
                    status = {
                        topic_id: this.state.label_id,
                        not_answer: this.state.status_id,
                        type: this.state.newList_id,
                        question_type: this.state.question_type,
                        limit: 15,
                        skip: 0
                    }
                    const les_status = { ...status }
                    Dispatcher.dispatch({
                        actionType: 'myPersonalRecommend',
                        les_status
                    })
                })
            } else {
                this.setState({
                    newList_name: this.newList[idx].type,
                    newList_id: 2,
                    status_id: 1,
                    newList_up: false,
                    mask_display: 'none',
                }, () => {
                    status = {
                        topic_id: this.state.label_id,
                        not_answer: this.state.status_id,
                        type: this.state.newList_id,
                        question_type: this.state.question_type,
                        limit: 15,
                        skip: 0
                    }
                    const les_status = { ...status }
                    Dispatcher.dispatch({
                        actionType: 'myPersonalRecommend',
                        les_status
                    })
                })
            }
        } else if (type == 'price') {
            this.setState({
                status_name: this.isStatus[idx].type,
                // status_id: this.isStatus[idx].id,
                question_type: this.isStatus[idx].id,
                status_up: false,
                status_id: 2,
                mask_display: 'none',
            }, () => {
                status = {
                    topic_id: this.state.label_id,
                    not_answer: this.state.status_id,
                    type: this.state.newList_id,
                    question_type: this.state.question_type,
                    limit: 15,
                    skip: 0
                }
                const les_status = { ...status }
                Dispatcher.dispatch({
                    actionType: 'myPersonalRecommend',
                    les_status
                })
            })
        }
    }

    render() {
        var labelName = this.state.label.map((item, index) => {
            return (
                <div key={index} style={{...styles.labelNameDiv,display: this.state.label_up ? 'block' : 'none',borderColor: item.name == this.state.label_name ? '#2196f3' : '#E8E5E5'}}>
        <div style={{marginLeft: 16, marginRight:16, lineHeight: 2, color: item.name == this.state.label_name ? '#2196f3' : '#333'}}
        onClick={() => {this.clickTab(index, 'label')}}>{item.name}</div>
        </div>
            )
        })

        var isFree = this.newList.map((item, index) => {
            return (
                <div key={index} style={{display: this.state.newList_up ? 'block' : 'none', height: 40, width: window.screen.width, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
          <div style={{marginLeft: 12, lineHeight: '39px', color: item.type == this.state.newList_name && index != 0 ? '#2196f3' : '#333'}}
            onClick={() => {
              this.clickTab(index, 'newList')
            }}
          >{item.type}</div>
          <hr style={{width: window.screen.width, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
            )
        })

        var isHot = this.isStatus.map((item, index) => {
            return (
                <div key={index} style={{display: this.state.status_up ? 'block' : 'none', height: 40, width: window.screen.width, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
          <div style={{marginLeft: 12, lineHeight: '39px', color: item.type == this.state.status_name && index != 0 ? '#2196f3' : '#333'}}
            onClick={() => {
              this.clickTab(index, 'price')
            }}
          >{item.type}</div>
          <hr style={{width: window.screen.width, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
            )
        })
        return (
            <div>
        <div style={{...styles.tab}}>
          <div onClick={() => {this.clickLabel('label')}} style={{display: 'flex', flexFlow: 'row',flexGrow: 1,width: '30%'}}>
            <div style={{marginLeft: this.state.label_name.length > 6 ? 12 : 30, color: !this.state.label_id ? '#333' : '#2196f3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{this.state.label_name}</div>
            <img src={this.state.label_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          <div style={{...styles.hr, marginLeft: this.state.label_name.length > 7 ? 15 : 30}}></div>
          <div onClick={() => {this.clickLabel('newList')}} style={{display: 'flex', flexFlow: 'row',flexGrow: 1,width: '22%'}}>
            <div style={{marginLeft: 18, color: this.state.newList_id == 1 ? '#333' : '#2196f3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{this.state.newList_name}</div>
            <img src={this.state.newList_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          <div style={{...styles.hr, marginLeft: 13}}></div>
          <div onClick={() => {this.clickLabel('isStatus')}} style={{display: 'flex', flexFlow: 'row',flexGrow: 1,width: '30%'}}>
            <div style={{marginLeft: 30, color: this.state.question_type == 0 ? '#333333' : '#2196f3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{this.state.status_name}</div>
            <img src={this.state.status_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
        </div>
        <hr style={{border: 'none', height: 1, width: window.screen.width, backgroundColor: '#f6f6f6'}}/>
        <div style={{display: 'flex', flexFlow: 'column', width: window.screen.width, position: 'absolute', zIndex: 999}}>
          {isFree}
          {isHot}
        </div>
        <div style={{...styles.labelDiv,display: this.state.label_up ? 'block' : 'none',}}>
          {labelName}
          <div style={{clear: 'both'}}></div>
          <div style={{width:devWidth,marginTop:20,display:'flex',flexDirection:'row',height:20,justifyContent:'center',alignItems:'center'}}>
            <Link to={`${__rootDir}/TopicCenter`}>
              <img src={Dm.getUrl_img('/img/v2/icons/myQaListFilter@2x.png')} style={{height: 17,width: 14,marginRight:8 }}/>
              <span style={{fontSize:12,color:"#2196f3"}}>编辑我关注的话题</span>
            </Link>
          </div>
        </div>
        <div onClick={this._hide.bind(this)} style={{...styles.mask,display:this.state.mask_display,}}></div>
      </div>
        )
    }

    _hide() {
        this.setState({
            mask_display: 'none',
            label_up: false,
            newList_up: false,
            status_up: false,
        })
    }

}

var styles = {
    tab: {
        width: devWidth,
        backgroundColor: '#f4f8fb',
        height: 45,
        fontFamily: "微软雅黑",
        lineHeight: '45px',
        fontSize: 14,
        color: '#333',
        display: 'flex',
        flexFlow: 'row'
    },
    triangle: {
        height: 6,
        width: 8,
        position: 'relative',
        top: 19,
        marginLeft: 10
    },
    hr: {
        backgroundColor: '#eaeaea',
        height: 20,
        width: 1,
        marginLeft: 10,
        position: 'relative',
        top: 11
    },
    mask: {
        width: devWidth,
        height: devHeight,
        backgroundColor: '#000',
        opacity: 0.2,
        position: 'absolute',
        zIndex: 998,
    },
    labelNameDiv: {
        height: 25,
        color: '#333',
        fontSize: 14,
        backgroundColor: '#ffffff',
        float: 'left',
        border: '1px solid',
        borderRadius: '100px',
        textAlign: 'center',
        marginLeft: 15,
        marginTop: 16
        // width:'auto'
    },
    labelDiv: {
        width: devWidth,
        position: 'absolute',
        zIndex: 999,
        // height: 170,
        paddingBottom:20,
        maxHeight:window.innerHeight-200,
        backgroundColor: '#F4F4F4',
    }
}

export default MyQaListFilter;