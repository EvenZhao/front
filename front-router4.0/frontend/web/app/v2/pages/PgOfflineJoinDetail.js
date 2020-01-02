import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import QRCode from 'qrcode.react'

var width = window.screen.width
var height = window.innerHeight
var borderWidth = height*(541/667)- 341
var codeWith = borderWidth - 20


function funcUrl(name,value,type){
    var loca = window.location;
    var baseUrl = type==undefined ? loca.origin + loca.pathname + "?" : "";
    var query = loca.search.substr(1);
    // 如果没有传参,就返回 search 值 不包含问号
    if (name==undefined) { return query }
    // 如果没有传值,就返回要查询的参数的值
    if (value==undefined){
        var val = query.match(new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"));
        return val!=null ? decodeURI(val[2]) : null;
    };
    var url;
    if (query=="") {
        // 如果没有 search 值,则返回追加了参数的 url
        url = baseUrl + name + "=" + value;
    }else{
        // 如果没有 search 值,则在其中修改对应的值,并且去重,最后返回 url
        var obj = {};
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        obj[name] = value;
        url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
    };
    return url;
}

class PgOfflineJoinDetail extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
			value: this.props.match.params.checkcode,
			size: codeWith,
			fgColor: '#000000',
			bgColor: '#ffffff',
			level: 'M',
			offlineInfo:{},
			codeDetail:{},
			tiXing: true,//是否提醒
		};

	}

	_handlecodeDetail(re){
		console.log('_handlecodeDetail----------',re);
		var result = re.result || {}
		this.setState({
			offlineInfo: result.offlineInfo || {},
			codeDetail: result.codeDetail
		})
	}
  componentWillMount() {

  }

	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-参课详情');
		this._getcodeDetail = EventCenter.on("codeDetailDone", this._handlecodeDetail.bind(this))

		Dispatcher.dispatch({
			actionType: 'codeDetail',
			resource_id: this.props.match.params.id,
			checkcode: this.props.match.params.checkcode,
		})
		var isApp = funcUrl()
		if (isApp == 'isApp=true' || isApp) {
			this.setState({
				tiXing: false
			})
		}
	}
	componentWillUnmount() {
		this._getcodeDetail.remove()
	}

	render(){
		var offlineInfo = this.state.offlineInfo || {}
		var address = offlineInfo.address || {}
		var codeDetail = this.state.codeDetail || {}
		var status_text
		var status_image
		var status_block = 'none'
		var text_line = {} //是否失效的显示状态
		var data_time
		if (codeDetail.status == 5) {
			status_text = '签到成功'
			status_image = '/img/v2/offlineReserve/joinSuccess@2x.png'
			status_block = 'block'
			text_line = {
				textDecoration:'line-through'
			}
		}else if (codeDetail.status == 6) {
			status_text = '未参课'
			status_image = '/img/v2/offlineReserve/noJoin@2x.png'
			status_block = 'block'
			text_line = {
				textDecoration:'line-through'
			}
		}
		var start_date = new Date(offlineInfo.start_time || 0).format("yyyy-MM-dd")
		var start_time = new Date(offlineInfo.start_time || 0).format("hh:mm");
		var end_time = new Date(offlineInfo.end_time || 0).format("hh:mm");
		var end_date = new Date(offlineInfo.end_time || 0).format("MM-dd")

		if (offlineInfo.isSameDay) {
			data_time = start_date +' '+ start_time +'-'+ end_time
		}else {
			data_time = start_date +' 至 '+end_date +' '+ start_time
		}
    return(
			<div style={{...styles.div}}>
        <div style={{...styles.secondDiv}}>
					<div style={{...styles.bgImage}}>
	          <div style={{textAlign:'center',}}>
	            <span style={{fontSize:16,color:'#000000'}}>铂略线下课参课券</span>
	          </div>
	          <div style={{textAlign:'center',marginTop:5}}>
	            <span style={{fontSize:11,color:'#666666'}}>
								<span style={{color:'#e0e0e0'}}>—— </span>
									 请向工作人员出示进行签到
								<span style={{color:'#e0e0e0'}}> ——</span>
							</span>
	          </div>
	          <div style={{...styles.recode}}>
							<div style={{...styles.recodeDiv}}>
								<QRCode
									value={this.state.value}
									size={this.state.size}
									fgColor={this.state.fgColor}
									bgColor={this.state.bgColor}
									level={this.state.level}
								 />
								 <div style={{...styles.codezzc,zIndex:9998,display: status_block}}></div>
								 <div style={{...styles.status_text,zIndex:9999,display: status_block}}>
										 <img src={Dm.getUrl_img(status_image)} height="40" width="40"/>
										 <div style={{marginTop:13}} >
											 <span style={{fontSize:18,color:'#ffffff'}}>{status_text}</span>
										 </div>
								 </div>
							</div>

						</div>
	          <div style={{textAlign:'center'}}>
	            <span style={{...text_line,fontSize:16,color:'#f37633'}}>券号 {this.props.match.params.checkcode}</span>
	          </div>
	          <div style={{marginLeft:21}}>
							<Link to={`${__rootDir}/lesson/offline/${offlineInfo.id}`}>
								<div style={{float:'left',}}>
									<span style={{fontSize:12,color:'#333333'}}>{offlineInfo.title}</span>
								</div>
								<div style={{float:'right',marginRight:14}}>
									<img src={Dm.getUrl_img('/img/v2/icons/more.png')} height="13" width="7" style={{position:'absolute',right:14}}/>
								</div>
								<div dangerouslySetInnerHTML={{__html: ('&nbsp')}}></div>
							</Link>
	          </div>
	          <div style={{marginLeft:21}}>
	            <span style={{fontSize:11,color:'#999999'}}>举办时间<span style={{marginLeft:15}}>{data_time}</span></span>
              <span style={{fontSize:11,color:'#999999',marginLeft:10}}>({start_time}签到)</span>
	          </div>
	          <div style={{marginLeft:21}}>
							<span style={{fontSize:11,color:'#999999',marginRight:15}}>举办地址</span>
							<div>
                {address.cityname}&nbsp;{address.address}
                <div>{address.site}&nbsp;{address.detail_place}</div>
              </div>
	          </div>
	          <div style={{marginLeft:21,marginBottom:6}}>
	            <span style={{fontSize:11,color:'#2196F3'}}>
								<span style={{fontSize:11,color:'#999999'}}>客服电话 </span>
								{offlineInfo.tel}
							</span>
	          </div>
						<div style={{...styles.line,}}></div>
	          <div style={{marginLeft:21}}>
	            <span style={{fontSize:11,color:'#999999'}}>参课人员  {codeDetail.name}</span>
	          </div>
	          <div style={{marginLeft:21}}>
	            <span style={{fontSize:11,color:'#999999'}}>手机号码  {codeDetail.phone}</span>
	          </div>
	          <div style={{marginLeft:21}}>
	            <span style={{fontSize:11,color:'#999999'}}>电子邮箱  {codeDetail.email}</span>
	          </div>
					</div>
					<div style={{...styles.foot,width:width*(358/375),paddingTop:22}}>
            <Link  to={`${__rootDir}/`}>
  						<span style={{fontSize:14,color:'#2196F3',}}>更多精彩线下课尽在铂略咨询</span>
            </Link>
					</div>
        </div>
				{
					this.state.tiXing ?
						<div style={{...styles.bottom}}>
							<div style={{...styles.top}}>
								<img src={Dm.getUrl_img('/img/v2/offlineReserve/offline_tixin@2x.png')} height="15" width="15" style={{marginTop:16,marginLeft:14}}/>
								<span style={{fontSize:14,color:'#333333',marginLeft:4,marginTop:14}}>开课提醒</span>
							</div>
							<div style={{...styles.top,justifyContent:'flex-end',}}>
								<span style={{fontSize:14,color:'#333333',marginTop:14,marginRight:14}}>一天前</span>
							</div>
						</div>
						: null
				}
			</div>
    )
  }
}

var styles = {
  div:{
    width: width,
    height: height,
		// backgroundColor:'#FFFFFF'
    backgroundImage: 'url('+Dm.getUrl_img('/img/v2/offlineReserve/backGroudImage@2x.png')+')',
		backgroundSize: '100%',
		backgroundAttachment: 'fixed',
		paddingTop: 10
  },
	secondDiv:{
		width:width*(358/375),
		height:height*(541/667),
		marginLeft:(width- width*(358/375))/2,
		// backgroundSize:'cover',
		position:'relative',
		// marginBottom:15
	},
	bgImage:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/offlineReserve/top2@2x.png')+')',
		backgroundSize:'100%',
		backgroundSize:'cover',
		// backgroundAttachment:'fixed',
		backgroundRepeat:'no-repeat',
		paddingTop:23,
	},
	foot:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/offlineReserve/foot2@2x.png')+')',
		backgroundSize:'100%',
		// backgroundAttachment:'fixed',
		textAlign:'center',
		height:72,
		width:358,
		backgroundRepeat:'no-repeat'
		// position:'absolute',
		// bottom:22,
	},
	recode:{
		width:borderWidth,
		height:borderWidth,
		border:'0.5px solid #d4d4d4',
		marginLeft:(width*(358/375)-borderWidth)/2,
		position:'relative',
		marginTop:5
	},
	recodeDiv:{
		width:codeWith,
		height:codeWith,
		marginLeft:10,
		marginTop:10
	},
	bottom:{
		width:width*(358/375),
		height:45,
		backgroundColor:'#FFFFFF',
		marginLeft:(width- width*(358/375))/2,
		borderRadius:'4px',
		marginTop:15,
		flex:1,
		display: 'flex',
		position:'relative',
		top:15
		// lineHeight:1
	},
	top:{
		flex:1,
		flexDirection:'row',
		display: 'flex'
	},
	codezzc:{
		height: codeWith,
		width: codeWith,
		position: 'absolute',
		opacity: 0.7,
		backgroundColor:'#000000',
		// marginTop:10,
		top:10
	},
	status_text:{
		height: codeWith,
		width: codeWith,
		position: 'absolute',
		top:10,
		textAlign:'center',
		paddingTop:(codeWith-71)/2,
	},
	line:{
		width: width*(358/375)-48,
		height:1,
		borderBottomStyle:'dotted',
		borderBottomWidth:0.5,
		borderBottomColor:'#BDBDBD',
		marginLeft:24,
		marginTop:18,
		position:'absolute',
		bottom: (height*(541/667)) * (60/541),
		zIndex:9999999999
	},
	line:{
		width: width-72,
		height: 1,
		backgroundColor: '#DBDBDB',
		marginLeft: 21,
	},
}

export default PgOfflineJoinDetail;
