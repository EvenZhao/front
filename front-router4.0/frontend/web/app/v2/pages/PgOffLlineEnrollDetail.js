import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import { stat } from 'fs';

var width = window.screen.width
var height = window.innerHeight
var codeHeight = height * (155/667)
//验证字符串是否是数字
function checkNumber(theObj) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}

class PgOffLlineEnrollDetail extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
			enrollDetail: [],
			offlineInfo: [],
			myEnrollLabelType: [],
			isMainHolder: false,
      req_err:false,
		};

	}
	_handlemyEnrollDetail(re) {
    console.log('==_handlemyEnrollDetail===',re);
    if(re.err || !re.result){
      this.setState({
        req_err:true,
      })
      return ;
    }
		var result = re.result || {}
    if (result.enrollDetail.code) {
      this.props.history.replace({pathname:`${__rootDir}/PgOfflineJoinCodeDetail/${result.enrollDetail.code}`, query: null, hash: null, state:null})
    }else if (result.enrollDetail.checkcode) {
			this.props.history.replace({pathname:`${__rootDir}/PgOfflineJoinDetail/${result.offlineInfo.id}/${result.enrollDetail.checkcode}`, query: null, hash: null, state:null})
		}
		this.setState({
			enrollDetail: result.enrollDetail,
			offlineInfo: result.offlineInfo || {},
		})
	}
	_handlemyEnrollLabelType(re){
    console.log('_handlemyEnrollLabelType===',re);
		this.setState({
			myEnrollLabelType: re.result || []
		})
	}
  componentWillMount() {

  }

	componentDidMount() {
    console.log('this.props.location.state',this.props.location.state);
    if(this.props.match.params && this.props.match.params._id){
      EventCenter.emit("SET_TITLE",'铂略财课-参课详情');
    }else {
      EventCenter.emit("SET_TITLE",'铂略财课-报名详情');
    }
		this._getmyEnrollDetail = EventCenter.on("myEnrollDetailDone", this._handlemyEnrollDetail.bind(this))
		this._getmyEnrollLabelType = EventCenter.on("myEnrollLabelTypeDone", this._handlemyEnrollLabelType.bind(this))
    //_id企业参课  id：线下课报名
    if(this.props.match.params && this.props.match.params._id){
        console.log('_id----0000',this.props.location.state);
        Dispatcher.dispatch({
  				actionType: 'myEnrollDetail',
  				_id: this.props.match.params._id,
  			})

      	this.setState({
  				isMainHolder: true
  			})

    }else {
      console.log('id----22222',this.props.location.state);

      Dispatcher.dispatch({
				actionType: 'myEnrollDetail',
				id: this.props.match.params.id,
			})
    }

		// if (checkNumber(this.props.match.params.id)) {
		// 	Dispatcher.dispatch({
		// 		actionType: 'myEnrollDetail',
		// 		id: this.props.match.params.id,
		// 	})
		// }else {
		// 	Dispatcher.dispatch({
		// 		actionType: 'myEnrollDetail',
		// 		_id: this.props.match.params.id,
		// 	})
		// 	this.setState({
		// 		isMainHolder: true
		// 	})
		// }

		//myEnrollLabelType 预约筛选样式 / 文字
		Dispatcher.dispatch({
			actionType: 'myEnrollLabelType',
		})
	}
  gotoEnroll(re){
    if (re.code) {
      this.props.history.replace({pathname:`${__rootDir}/PgOfflineJoinCodeDetail/${re.code}`, query: null, hash: null, state:null})
    }else {
      this.props.history.replace({pathname:`${__rootDir}/PgOfflineJoinDetail/${this.state.offlineInfo.id}/${re.checkcode}`, query: null, hash: null, state:null})
    }
  }
	componentWillUnmount() {
		this._getmyEnrollDetail.remove()
		this._getmyEnrollLabelType.remove()
	}
  _gotoDetail(){
    this.props.history.push({pathname: `${__rootDir}/lesson/offline/${this.state.offlineInfo.id}`})
  }
	handerMainHolderEnrollDetail(){
		if (this.state.enrollDetail.length < 1) {
			return
		}
		var enrollDetail = this.state.enrollDetail.map((item,index)=>{
			var myEnrollLabelType = this.state.myEnrollLabelType //预约筛选样式
			var status = item.status
			var status_color //状态颜色
			var status_text //状态值
			var checkCodeColor
			for (var i = 0; i < myEnrollLabelType.length; i++) {
				if (status == myEnrollLabelType[i].id) {
					status_text = myEnrollLabelType[i].text
					status_color = myEnrollLabelType[i].color
				}
        // if (status_text == '报名关闭' && item.errMsg) {
        //   status_text = status_text + ':' + item.errMsg
        // }
      }
      
      var code_str;

      if(status == 5){
        //已参课
        checkCodeColor = {
					color:'#999999',
					textDecoration:'line-through'
        }
      }
      else if(status == 6){
        //未参课
        code_str='(失效)'
        checkCodeColor = {
					color:'#999999',
					textDecoration:'line-through'
        }
      }else{
        checkCodeColor ={
					color:'#f37633',
				}
      }

			// if (status == 3) {
			// 	checkCodeColor ={
			// 		color:'#f37633',
			// 	}
			// }else {
			// 	checkCodeColor = {
			// 		color:'#999999',
			// 		textDecoration:'line-through'
      //   }
      // }
			return(
        <div onClick={this.gotoEnroll.bind(this,item)} style={{...styles.checkCode,position:'relative'}} key={index}>{/**参课人员 个人账户或会员账户*/}
					<div style={{...styles.content,marginTop:11}}>
						<div style={{...styles.info}}>
							<div style={{...styles.top}}>
								<span style={{fontSize:16,color:'#333333',marginLeft:12,marginTop:12}}>{item.name}</span>
							</div>
              {
                item.is_invited ?
                <div style={{...styles.top,justifyContent:'flex-end'}}>
                    <span style={{fontSize:12,color:'#999',marginTop:16,marginRight:12}}>报名人:{item.enrollAccount}</span>
                  </div>
                : null
              }

						</div>
						<div style={{position:'absolute',top:codeHeight * (37/155)}}>
							<span style={{...styles.contentInfo,fontSize:12,color:'#666666',}}>手机号码
                <span style={{color:'#333333'}}> {item.phone}</span>
              </span>
						</div>
						<div style={{position:'absolute',top: codeHeight * (54/155)}}>
							<span style={{...styles.contentInfo,fontSize:12,color:'#666666',}}>电子邮箱
              <span style={{color:'#333333'}}> {item.email}</span></span>
						</div>
            <div style={{...styles.line_line}}></div>
						<div style={{marginTop:16,position:'absolute',top:codeHeight * (79/155)}}>
							<span style={{...styles.contentInfo,fontSize:14,...checkCodeColor}}>券号 {item.checkcode}{code_str}</span>
						</div>
						<div style={{position:'absolute',bottom:codeHeight * (10/155),right:0}}>
							<span style={{fontSize:14,color:status_color,marginRight:18}}>{status_text}</span>
						</div>
					</div>
				</div>
			)
		})
    console.log('------------mmmm', enrollDetail);
		return enrollDetail
	}
	handleEnrollDetail(){
		var enrollDetail = this.state.enrollDetail
		var myEnrollLabelType = this.state.myEnrollLabelType //预约筛选样式
		var status = enrollDetail.status
		var status_color //状态颜色
		var status_text //状态值
		for (var i = 0; i < myEnrollLabelType.length; i++) {
			if (status == myEnrollLabelType[i].id) {
				status_text = myEnrollLabelType[i].text
				status_color = myEnrollLabelType[i].color
			}
		}
    if (status_text == '报名关闭' && enrollDetail.errMsg) {
      status_text = (
        <div>{status_text}：<span style={{color:'#333'}}>{enrollDetail.errMsg}</span></div>
      )
    }

		return(
			<div>
				<div style={{...styles.content,marginTop:11,backgroundColor: '#ffffff',width:width-24,paddingBottom:6}}>
					<div style={{...styles.info}}>
						<div style={{...styles.top}}>
							<span style={{fontSize:16,color:'#333333',marginLeft:12,marginTop:12}}>{enrollDetail.name}</span>
						</div>
            {
              enrollDetail.is_invited ?
              <div style={{...styles.top,justifyContent:'flex-end'}}>
                <span style={{fontSize:12,color:'#999',marginTop:16,marginRight:12}}>报名人:{enrollDetail.enrollAccount}</span>
              </div>
              :
              null
            }

					</div>
					<div style={{...styles.line,height:1,marginTop:10}}></div>
					<div style={{}}>
						<span style={{...styles.contentInfo,fontSize:12,color:'#666666',}}>手机号码 {enrollDetail.phone}</span>
					</div>
					<div style={{}}>
						<span style={{...styles.contentInfo,fontSize:12,color:'#666666',}}>电子邮箱 {enrollDetail.email}</span>
					</div>
					<div style={{flex:1,flexDirection:'row',display: 'flex',justifyContent:'flex-end'}}>
						<span style={{fontSize:14,color:status_color,marginRight:18}}>{status_text}</span>
					</div>
				</div>
			</div>
		)
	}

  //导航
  gotoMap(add){
    window.location.href = 'http://api.map.baidu.com/marker?location='+add.map_y+','+add.map_x+'&title=课程地址&content='+add.site+'&output=html'
  }
  //联系客服
	_ApplyVoucher(){
    if(isWeiXin){
      this.props.history.push({pathname: `${__rootDir}/freeInvited`})
    }else {
      window.location.href='https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

	render(){
		var offlineInfo = this.state.offlineInfo
		var address = offlineInfo.address || {}
		var enrollDetail
		var data_time

    //判断是企业参课还是线下课报名
    if(this.props.match.params && this.props.match.params._id){
      enrollDetail =  this.handerMainHolderEnrollDetail()
    }else {
      enrollDetail =  this.handleEnrollDetail()
    }
		// if (this.state.isMainHolder) {
		// 	enrollDetail =  this.handerMainHolderEnrollDetail()
		// }else {
		// 	enrollDetail =  this.handleEnrollDetail()
		// }
		var start_date = new Date(offlineInfo.start_time || 0).format("yyyy-MM-dd")
		var start_time = new Date(offlineInfo.start_time || 0).format("hh:mm");
		var end_time = new Date(offlineInfo.end_time || 0).format("hh:mm");
		var end_date = new Date(offlineInfo.end_time || 0).format("MM-dd")

		if (offlineInfo.isSameDay) {
			data_time = start_date +' '+ start_time +'-'+ end_time
		}else {
			data_time = start_date +' 至 '+end_date
		}
    var herf = 'tel://'+offlineInfo.contacts_phone
    var herftel = 'tel://'+offlineInfo.tel

    var bottom_text = ''

    if(this.props.match.params && this.props.match.params._id){
      if(this.state.offlineInfo.staff_name && this.state.offlineInfo.tel){
        bottom_text =(
          <div>
            <div style={{fontSize:11,color:'#999'}}>如有疑问请联系铂略产品顾问
              <span style={{fontSize:11,color:'#333'}}>{this.state.offlineInfo.staff_name}</span>
              ，或联系铂略客服。
            </div>
            {/*
            <div>
              <span style={{fontSize:11,color:'#999'}}>客服热线
                <span style={{fontSize:11,color:'#333'}}>
                  <a style={{color:'#2196f3'}} href={herftel}>
                    {this.state.offlineInfo.tel}
                  </a>
                </span>
              </span>
            </div>
            */}
          </div>
        )
      }
      else if (this.state.offlineInfo.staff_name && (this.state.offlineInfo.tel == '' || this.state.offlineInfo.tel == null))
      {
        bottom_text =(
          <div style={{fontSize:11,color:'#999'}}>如有疑问请联系铂略产品顾问
            <span style={{fontSize:11,color:'#333'}}>{this.state.offlineInfo.staff_name}</span>
            ，或联系铂略客服。
          </div>
        )
      }
     else if ((this.state.offlineInfo.staff_name == '' || this.state.offlineInfo.staff_name == null) && this.state.offlineInfo.tel)
     {
      bottom_text =(
        <div>
          <div style={{fontSize:11,color:'#999'}}>
            如有疑问请联系铂略客服.
          </div>
        {/*
          <span style={{fontSize:11,color:'#999'}}>客服热线
            <span style={{fontSize:11,color:'#2196F3'}}>
              <a style={{color:'#2196f3'}} href={herftel}>
                {this.state.offlineInfo.tel}
              </a>
            </span>
          </span>
          */}
        </div>
       )
      }
      else {
        bottom_text = (
          <span style={{fontSize:11,color:'#999'}}>
            如有疑问请联系铂略客服。
          </span>
        )
      }
    }
    else {
      if(this.state.enrollDetail.mainHolderName && this.state.offlineInfo.staff_name){
          bottom_text =(
            <span style={{fontSize:11,color:'#999'}}>
              如有疑问请联系贵公司
              <span style={{fontSize:11,color:'#333'}}>{this.state.enrollDetail.mainHolderName}</span>
              或铂略产品顾问
              <span style={{fontSize:11,color:'#333'}}>{this.state.offlineInfo.staff_name}</span>
              ，或联系铂略客服。
            </span>
          )
        }
        else if(this.state.offlineInfo.staff_name && (this.state.enrollDetail.mainHolderName == '' || this.state.enrollDetail.mainHolderName == null))
        {
            bottom_text = (
              <span style={{fontSize:11,color:'#999'}}>
                如有疑问请联系铂略产品顾问<span style={{color:'#333'}}>{this.state.offlineInfo.staff_name}</span>，或联系铂略客服。
              </span>
            )
        }
        else if(this.state.enrollDetail.mainHolderName && (this.state.offlineInfo.staff_name =='' || this.state.offlineInfo.staff_name == null))
        {
          bottom_text = (
            <span style={{fontSize:11,color:'#999'}}>
              如有疑问请联系贵公司<span style={{color:'#333'}}>{this.state.enrollDetail.mainHolderName}</span>，或联系铂略客服。
            </span>
          )
        }
        else{
            bottom_text = (
              <span style={{fontSize:11,color:'#999'}}>
                如有疑问请联系铂略客服。
              </span>
            )
        }
    }

    if (this.state.req_err) {
        return (
            <div style={{textAlign:'center', backgroundColor:'#fff',height:window.innerHeight }}>
                <div style={{paddingTop:100}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/under_maintenance.png')} width="120" height="115"  style={{marginTop:20,marginLeft:12}}/>
                </div>

                <div style={{fontSize:12,color:'#999',marginTop:20}}>无法获取数据</div>
            </div>
        )
    }

    return(
		<div style={{...styles.div}}>
      <div style={{width:devWidth,height:devHeight-56,overflowY:'auto'}}>
				<div style={{...styles.info}}>
					<div style={{...styles.top}}>
						<img src={Dm.getUrl_img('/img/v2/offlineReserve/offline@2x.png')} height="18" width="23" style={{marginTop:20,marginLeft:12}}/>
						<span style={{fontSize:16,color:'#333333',marginLeft:4,marginTop:17}}>线下课信息</span>
					</div>
					<div style={{...styles.top,justifyContent:'flex-end',}} onClick={this._gotoDetail.bind(this)}>
						<span style={{fontSize:12,color:'#333333',marginTop:21,marginRight:12}}>查看详情</span>
					</div>
				</div>
				<div style={{...styles.content,marginTop:11,backgroundColor: '#ffffff',width:width-24}}>
					<div style={{...styles.contentDiv}} onClick={this._gotoDetail.bind(this)}>
						<span style={{fontSize:16,color:'#000000'}}>{offlineInfo.title} </span>
					</div>
					<div style={{...styles.contentDiv,paddingTop:0,display:'flex'}}>
            <div style={{width:60}}><span style={{fontSize:14,color:'#999999',}}>举办时间</span></div>
            <div style={{width:devWidth-140,marginLeft:15}}><span style={{fontSize:14,color:'rgb(51,51,51,0.87)'}}>{data_time}</span><span style={{fontSize:14,color:'#999',marginLeft:10}}>({start_time}签到)</span></div>
					</div>
          <div style={{...styles.contentDiv,paddingTop:0,display:'flex',position:'relative'}} onClick={this.gotoMap.bind(this,address)}>
            <div style={{width:60}}><span style={{fontSize:14,color:'#999999',}}>举办地址</span></div>
            <div style={{width:devWidth-140,marginLeft:15}}>
              <span style={{fontSize:14,color:'#333333'}}>{address.provincename ||''}&nbsp;{address.cityname||''}&nbsp;{address.address||''}</span>
              <div>
                <span style={{fontSize:12,color:'#999'}}>{address.site}&nbsp;{address.detail_place ? address.detail_place :'' }</span>
              </div>
            </div>
            <img src={Dm.getUrl_img('/img/v2/icons/more.png')} width="8" height="14"  style={{position:'absolute',right:-5,top:8,}}/>
          </div>
          {
            this.state.isMainHolder ?
            <div>
              { offlineInfo.contacts_phone && offlineInfo.contacts ?
                <div style={{...styles.contacts,}}>
                  <span style={{fontSize:12,color:'#c0c0c0',marginLeft:20,}}>会场联系人</span>
                  <span style={{fontSize:16,color:'#2196f3',marginLeft:10}}><a style={{color:'#2196f3'}} href={herf}>{offlineInfo.contacts_phone}</a></span>
                  <span style={{fontSize:12,color:'#999999'}}>({offlineInfo.contacts})</span>
                </div>
                :
                <div style={{...styles.contacts,}}>
                  <span style={{fontSize:12,color:'#c0c0c0',marginLeft:20,}}>客服热线</span>
                  <span style={{fontSize:16,color:'#2196f3',marginLeft:10}}><a style={{color:'#2196f3'}} href={herftel}>{offlineInfo.tel}</a></span>
                </div>
              }
            </div>
            :
            <div style={{...styles.contacts,paddingTop:0,display:'flex'}}>
              <div style={{marginLeft:20,}}><span style={{fontSize:14,color:'#999999',}}>客服热线</span></div>
              <div style={{width:devWidth-140,marginLeft:15}}>
                <span style={{fontSize:16,color:'#2196f3'}}>
                  <a style={{color:'#2196f3'}} href={herftel}>{offlineInfo.tel}</a>
                </span>
              </div>
            </div>
          }
          {/**
            <div style={{...styles.contentDiv}}>
              <img src={Dm.getUrl_img('/img/v2/offlineReserve/offline_iphone@2x.png')} height="13" width="15" style={{}}/>
              <span style={{fontSize:12,color:'#333333',marginLeft:9}}>电话</span>
              <span style={{fontSize:12,color:'#2196F3',}}> {offlineInfo.tel}</span>
            </div>
            */}
				</div>
				{/**参课人员 个人账户或会员账户*/}
				{
					this.state.isMainHolder ?
					<div style={{marginTop:26,width:width}}>
						<img src={Dm.getUrl_img('/img/v2/offlineReserve/offline_person@2x.png')} height="18" width="18" style={{marginRight:7,marginLeft:12,float:'left',marginTop:3}}/>
						<span style={{fontSize:16,color:'#000000'}}>参课明细({this.state.enrollDetail.length || 0})</span>
						<div style={{width:width-24,marginLeft:12,marginTop:14}} >
							<span style={{fontSize:11,color:'#999999'}}>*请通知参课人员携带自身参课券至会场，并出示给工作人员进行签到。</span>
						</div>
					</div>
					:
					<div style={{marginTop:26,width:width}}>
						<img src={Dm.getUrl_img('/img/v2/offlineReserve/offline_person@2x.png')} height="18" width="18" style={{marginRight:7,marginLeft:12,float:'left',marginTop:3}}/>
						<span style={{fontSize:16,color:'#000000'}}>参课人员</span>
					</div>
				}

				{/**参课详情*/}
				{enrollDetail}
				{
					this.state.isMainHolder ?
					null
          :
					<div style={{...styles.info,width:width-24,backgroundColor:'#ffffff',height:45,marginTop:15,marginLeft:12,display:'none'}}>
						<div style={{...styles.top}}>
							<img src={Dm.getUrl_img('/img/v2/offlineReserve/offline_tixin@2x.png')} height="15" width="15" style={{marginTop:14,marginLeft:14}}/>
							<span style={{fontSize:14,color:'#333333',marginLeft:12,marginTop:12}}>开课提醒</span>
						</div>
						<div style={{...styles.top,justifyContent:'flex-end',}}>
							<span style={{fontSize:14,color:'#333333',marginTop:12,marginRight:12}}>一天前</span>
						</div>
					</div>
        }
        {this.props.match.params && this.props.match.params._id ?
        null
        :
        <div style={{...styles.kefu}} onClick={this._ApplyVoucher.bind(this)}></div>
        }
        
        <div style={{...styles.bottom_fixed,textAlign:'center'}}>
          {bottom_text}
          <div style={{textAlign:'center'}}>
            <span style={{fontSize:11,color:'#999'}}>客服热线
              <a style={{color:'#2196f3',fontSize:11}} href={herftel}>
                {this.state.offlineInfo.tel}
              </a>
            </span>
          </div>
        </div>
      </div>
			</div>
    )
  }
}

var styles = {
  div:{
    width: width,
    height: innerHeight,
    overflowY:'auto',
    backgroundColor:'#f4f4f4',

  },
  info:{
    display: 'flex',
		flex:1,
  },
	top:{
		flex:1,
		flexDirection:'row',
		display: 'flex'
	},
  content:{
    // backgroundColor: '#ffffff',
    borderRadius: '4px',
		// width: width-24,
		marginLeft: 12
  },
	contentInfo:{
		marginLeft:12,
		// marginTop:10,
		// marginBottom:10
	},
	contentDiv:{
		paddingTop:10,
		paddingBottom:10,
    width: devWidth-64,
    marginLeft: 20,
	},
	line:{
		width:width-48,
		marginLeft:12,
		backgroundColor:'#fff',
		height:1,
    borderBottom:'solid 0.5px #D8D8D8',
	},
	checkCode:{
		width: width * (360/375),
		height: height * (155/667),
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/offlineReserve/checkcode.png')+')',
		backgroundSize:'cover',
		marginLeft:(width - width * (360/375))/2
		// backgroundAttachment:'fixed',
	},
  line_line:{
    width: width*(360/375)-48,
    height:1,
    borderBottomStyle:'dotted',
    borderBottomWidth:0.5,
    borderBottomColor:'#BDBDBD',
    marginLeft:12,
    // marginTop:18,
    position:'absolute',
    top:codeHeight * (90/155)
  },
  contacts:{
    width:devWidth-24,
    height:45,
    backgroundColor:'#f4f8fb',
    borderRadius:'0px 0px 4px 4px',
    lineHeight:2.5,
  },
  bottom_fixed:{
    backgroundColor:'#f4f4f4',
    textAlign:'center',
    width:devWidth,
    position:'fixed',
    zIndex:999,
    lineHeight:'18px',
    left:0,
    bottom:0,
    padding:'10px 0',
    height:36
  },
  kefu:{
		width: 70,
		height: 50,
		position:'absolute',
		right: 0,
		bottom:70,
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/audit/lianxikefu@2x.png')+')',
		backgroundSize:'cover'
	},
}

export default PgOffLlineEnrollDetail;
