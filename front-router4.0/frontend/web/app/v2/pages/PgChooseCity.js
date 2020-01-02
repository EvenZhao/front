import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

var addressComponents = {}

var addressIcon //定义定位动画

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function DataLength(fData)
{
    var intLength=0
    for (var i=0;i<fData.length;i++)
    {
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
            intLength=intLength+2
        else
            intLength=intLength+1
    }
    return intLength
}

class PgChooseCity extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      SubSites: [{name:'全国站',defaultCity:'全国站'}],
      addressComponents: this.props.location.state.addressComponents || {},
      address: this.props.location.state.address || '全国站',
			isShow: false,
			alertTitle:'',
			citys:'',
			addressNameData: [], //历史访问城市
			addressIconWidth:12, //定位图标的宽度
			addressIconHeight:14,//定位图标的高度
			defaultCity:'',
			alertTitleSecond:''
		};

	}
	_handlegetaddComp(re){
    // console.log('_handlegetaddComp',re);
		 addressComponents= re || {}
		var result =  this.state.SubSites || []
		var baiduCity = addressComponents.city //获取百度返回的城市
		var baiduProvince = addressComponents.province //获取百度返回的省
		if (baiduCity.charAt(baiduCity.length - 1)=='市') {//判断如果百度返回的市后面有市则去掉
			baiduCity = baiduCity.substring(0,baiduCity.length-1)
		}
		if (baiduProvince.charAt(baiduProvince.length - 1)=='省') {//判断百度返回的省后面有省则去掉
			baiduProvince = baiduProvince.substring(0,baiduProvince.length-1)
		}
    if (baiduProvince.charAt(baiduProvince.length - 1)=='市') {//判断百度返回的省后面有省则去掉
      baiduProvince = baiduProvince.substring(0,baiduProvince.length-1)
    }
    baiduCity = baiduCity +'站'
    // console.log('result-----------',result);
		localStorage.setItem("dWTime", Date.now())
		for (var key of result) { //把接口中城市取出来循环对比
			var name = key.name || [] //定义需要匹配城市数组
			var province = key.province || '' //定义需要匹配的省
			var defaultCity = key.defaultCity || ''
			if (province ==  baiduProvince || baiduCity == name) {
        if (this.state.address !== name) {
          var title = '您目前正在'+name+'所覆盖区域,'
          var secondTitle = '是否切换至'+name+'？'
          this.setState({
            alertTitle: title,
            alertTitleSecond:secondTitle,
            isShow: true,
            citys: name,
            defaultCity: defaultCity
          })
        }else {
          this.setState({
            addressIconWidth: 12,
            addressIconHeight: 14,
          })
          clearInterval(addressIcon)
          // this.props.history.push({pathname: `${__rootDir}/`, query: null,state: {}})
        }
				// this.setState({
				// 	address: name,
				// 	addressIconWidth: 12,
				// 	addressIconHeight: 14,
				// 	defaultCity: defaultCity
				// },()=>{
				// 	this.addHistoryData()
				// 	localStorage.setItem("addressName",name) //修改最后定位的城市
				// 	localStorage.setItem("citydefaultCity",defaultCity)
				// })
				clearInterval(addressIcon)
				return
			}
		}
	}
	goTolocation(){
		var cityNum = 0
		addressIcon = setInterval(()=>{//定位如果没有完成 图标的动画
			this.changeAddressIcon() //图标动画的效果
			if (cityNum == 10) {
				this.setState({
					addressIconWidth: 12,
					addressIconHeight: 14,
				})
				isCityReaold = true
				clearInterval(addressIcon)
			}
			cityNum = cityNum + 1
		}, 500);
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(116.331398,39.897445);
		map.centerAndZoom(point,12);
		var geoc = new BMap.Geocoder();
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			var pt = r.point
			geoc.getLocation(pt, function(rs){
				var addComp = rs.addressComponents;
				EventCenter.emit("getaddComp",addComp)
				addressComponents = addComp
				// console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
		});
		},{enableHighAccuracy: true})
	}

	checkoutCity(re,defaultCity){
    var citys = re || ''
    var title
    var secondTitle
    if (citys.charAt(citys.length - 1)=='站') {//判断如果百度返回的市后面有站则去掉
      citys = citys.substring(0,citys.length-1)
    }
    this.setState({
      isShow: false,
      address: citys,
    },()=>{
      this.addHistoryData()
      var ZdCity = this.state.address + '站'
      localStorage.setItem("addressName",ZdCity) //修改最后定位的城市
      // localStorage.setItem("citydefaultCity",this.state.defaultCity)
      if(defaultCity =='全国站'){
        defaultCity =''
      }
      localStorage.setItem("citydefaultCity",defaultCity)

      localStorage.setItem("dWTime", Date.now())
      // console.log('addressName.......',localStorage.getItem("addressName"));
      // console.log('this.state.defaultCity==',this.state.defaultCity);
      // Dispatcher.dispatch({
      //   actionType: 'index',
      //   cityName:encodeURI(this.state.defaultCity)
      // })

      console.log('defaultCity==',defaultCity);

      // this.props.history.go(-1)
      this.props.history.push({pathname:`${__rootDir}/PgHomeIndex`});
    })

		// if (citys !== this.state.address) {
		// 	title = '您目前正在'+this.state.address+'所覆盖区域,'
		// 	secondTitle = '是否切换至'+citys+'站？'
		// 	this.setState({
		// 		alertTitle: title,
		// 		alertTitleSecond:secondTitle,
		// 		isShow: true,
		// 		citys: citys,
		// 		defaultCity: defaultCity
		// 	})
		// }
	}
	countersign(re){//确认方法
		// console.log('countersign',this.state.citys);
		this.setState({
			isShow: false,
			address: this.state.citys
		},()=>{
			this.addHistoryData()
			var ZdCity = this.state.address
			localStorage.setItem("addressName",ZdCity) //修改最后定位的城市
			localStorage.setItem("citydefaultCity",this.state.defaultCity)
			localStorage.setItem("dWTime", Date.now())
			// console.log('addressName.......',localStorage.getItem("addressName"));
			this.props.history.go(-1)
		})

	}
	addHistoryData(){
    var address = this.state.address
    if (address.charAt(address.length - 1)=='站') {//判断百度返回的省后面有省则去掉
      address = address.substring(0,address.length-1)
    }
    address = address + '站'
		if (this.state.addressNameData.length < 5) {
			this.state.addressNameData.push(address)
		}else {
      for (var i = 0; i < this.state.addressNameData.length; i++) {
        if (this.state.addressNameData[i] == address) {
          this.state.addressNameData.remove(i)
          this.state.addressNameData.push(address)
          return
        }
      }
      this.state.addressNameData.remove(0)
      this.state.addressNameData.push(address)
    }
		var unique = {};//去掉数组中相同的值
		this.state.addressNameData.forEach(function(gpa){ unique[ JSON.stringify(gpa) ] = gpa });
		this.state.addressNameData = Object.keys(unique).map(function(u){return JSON.parse(u) });
		localStorage.setItem("addressNameData", JSON.stringify(this.state.addressNameData));
	}

	cancel(){//取消方法
		this.setState({
			isShow: false
		})
	}
	_handlegetSubSitesDone(re){
    console.log('_handlegetSubSitesDone==',re);
		var result = re.result || []
		// console.log('_handlegetSubSitesDone',re);

		this.setState({
			SubSites: this.state.SubSites.concat(result)
		})
	}
	changeAddressIcon(){
		if (this.state.addressIconWidth == 6 || this.state.addressIconHeight == 7) {
			this.setState({
				addressIconWidth: 12,
				addressIconHeight: 14,
			})
		}else {
			this.setState({
				addressIconWidth: 6,
				addressIconHeight: 7,
			})
		}
	}
	componentWillMount() {
		Dispatcher.dispatch({//发送请求获取定位城市
			actionType: 'getSubSites',
			choose: true,
		})
	}
	componentDidMount() {
		var addressNameData = localStorage.getItem("addressNameData")
		if (addressNameData === null) {
			//  return;
		 }else {
			 var json = JSON.parse(addressNameData);
			 this.setState({
				 addressNameData: json
			 })
		 }

    EventCenter.emit("SET_TITLE",'铂略财课-选择站点')
		this._getaddComp = EventCenter.on('getaddComp',this._handlegetaddComp.bind(this))
		this._getgetSubSites = EventCenter.on('getSubSitesChooseDone',this._handlegetSubSitesDone.bind(this))


	}
	componentWillUnmount() {
		this._getaddComp.remove()
		this._getgetSubSites.remove()
		clearInterval(addressIcon)
	}

	render(){
    var citys = this.state.SubSites.map((item,index)=>{
      return(
        <div style={{...styles.citys}} key={index} onClick={this.checkoutCity.bind(this,item.name,item.defaultCity)}>
          <span style={{...styles.citysName}}>
            {item.name}
          </span>
        </div>
      )
    })
		var historyCity = this.state.addressNameData.map((item,index)=>{
			var font_color = '#333333'
			var border = '1px solid #E5E5E5';
			if (this.state.address == item) {
				font_color = '#2196f3'
				border='1px solid #2196f3';
			}
			var itempp = DataLength(item)
			var itemCount
			var	itembuttonWidth = 70
			if (itempp > 6) {
					itemCount = (itempp-6)
					itembuttonWidth =itembuttonWidth + (itemCount * 6)
			}
			return(
				<div onClick={this.checkoutCity.bind(this,item)} style={{...styles.buttonCity,width:itembuttonWidth,marginLeft:12,float:'left',border:border}} key={index}>
					<span style={{fontSize:12,color:font_color}}>{item}</span>
				</div>
			)
		})
		var address = this.state.address || '全国站'
		var pp = DataLength(address)
		var newCount
		var	buttonWidth = 70
		var alertTitleWidth = 270
		var alertSecondWidth = 242
		if (pp > 6) {
				newCount = (pp-6)
				buttonWidth =buttonWidth + (newCount * 6)
				alertTitleWidth = alertTitleWidth + (newCount * 6)
				alertSecondWidth = alertSecondWidth + (newCount * 6)
		}
    return(
			<div style={{...styles.mainDiv}}>
        <div style={{...styles.firstDiv,}}>
          <div style={{...styles.nowCityDiv}}>
						<div style={{marginLeft:12}}>
							<span style={{fontSize:12,color:'#999999'}}>当前定位站点</span>
						</div>
						<div style={{...styles.buttonCity,width:buttonWidth,marginLeft:12,float:'left'}}>
							<span style={{fontSize:12,color:'#333333'}}>{this.state.address}</span>
						</div>
						<div style={{float:'right',marginRight:18}} onClick={this.goTolocation.bind(this)}>
							<div style={{width:12,height:15,marginRight:6,marginTop:12,float:'left'}}>
								<img src={Dm.getUrl_img('/img/v2/icons/blueAddress@2x.png')} width={this.state.addressIconWidth} height={this.state.addressIconHeight}/>
							</div>
							<span style={{fontSize:12,color:'#2196f3',position:'relative',top:9}}>GPS定位站点</span>
						</div>
          </div>
					<div style={{height:this.state.addressNameData.length>1 ? 'auto':66,overflow:'hidden',paddingBottom:10,}}>
						<div style={{marginLeft:12}}>
							<span style={{fontSize:12,color:'#999999'}}>历史访问站点</span>
						</div>
						{historyCity}
					</div>
        </div>
        <div>
          {citys}
        </div>
				<div id="allmap"></div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<div style={{...styles.alert,width:alertTitleWidth,left:(devWidth-alertTitleWidth)/2,display:this.state.isShow ?'block':'none'}}>
					<div style={{...styles.alertFirstDiv}}>
						<div style={{width:alertSecondWidth,marginLeft:14,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
							<span style={{fontSize:16,color:'#030303',}}>
								{this.state.alertTitle}
							</span>
							<div>
								<span>
									{this.state.alertTitleSecond}
								</span>
							</div>
						</div>
					</div>
					<div>
						<div style={{...styles.alertSecond,width:134}} onClick={this.cancel.bind(this)}>
							<span style={{fontSize:17,color:'#2196f3'}}>取消</span>
						</div>
						<div style={{...styles.alertSecond,border:'none'}} onClick={this.countersign.bind(this)}>
							<span style={{fontSize:17,color:'#2196f3'}}>确定</span>
						</div>
					</div>
				</div>
			</div>
    )
  }
}

var styles = {
  mainDiv:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#ffffff',
    overflowX:'hidden',
    overflowY:'scroll'
  },
  firstDiv:{
    width: devWidth,
    backgroundColor:'#FAFAFA'
  },
  nowCityDiv:{
    width:devWidth,
    height:74,
		borderBottomWidth:1,
		borderBottomColor:'#D8D8D8',
		borderBottomStyle:'solid',
  },
  citys:{
    height:50,
    width: devWidth,
    lineHeight:3,
    borderBottomWidth:1,
    borderBottomColor:'#f3f3f3',
    borderBottomStyle:'solid',
  },
  citysName:{
    color:'#333333',
    fontSize:14,
    marginLeft:14,
    // marginTop: 18
  },
	buttonCity:{
		// width:70,
		height:25,
		border:'1px solid #E5E5E5',
		borderRadius:'100px',
		// opacity:0.5
		textAlign:'center',
		marginTop: 9,
		// padding:6
	},
	alert:{
		width:270,
		height:131,
		backgroundColor:'#ffffff',
		borderRadius:'12px',
		position:'absolute',
		top: (devHeight - 131)/2,
		zIndex:999,
		// left: (devWidth-270)/2
	},
	alertFirstDiv:{
		// width:270,
		height:84,
		borderBottomWidth:0.5,
		borderBottomColor:'#D4D4D4',
		borderBottomStyle:'solid',
		// padding:'20px 14px 0px 14px'
	},
	alertSecond:{
		width:135,
		height:45,
		textAlign:'center',
		borderRightWidth:1,
		borderRightColor:'#D4D4D4',
		borderRightStyle:'solid',
		float:'left',
		lineHeight:3
	},
	zzc:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#cccccc',
		position:'absolute',
		opacity: 0.5,
		zIndex: 998,
		top:0,
	},
}

export default PgChooseCity;
