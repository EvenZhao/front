import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import async from 'async'
import Common from '../Common';


class PgOfflineListFilter extends React.Component {
	constructor(props) {
    super(props);


    this.label = [{label_id: '', label_name: '全部课程体系'}];
    this.type = [{id: 2, type: '所有状态'}, {id: 0, type: '即将开始'}, {id: 1, type: '往期回顾'}]
		//默认城市
		var citydefaultCity = localStorage.getItem("citydefaultCity");
		this.state = {
      label_up: false,
      city_up: false,
      type_up: false,
      label_name: '全部课程体系',
      type_name: '所有状态',
			city_name: citydefaultCity,
      city_id: '',
      label_id: '',
      type_id: 2,
      label: this.label,
      city: [],
			//开课选中的城市id
			checkedCityIds:[],
			//选中的城市id
			city_ids:'',
			//是否显示遮罩层
			mask_display:'none',
			// cityData:[],
			// isShow:false,
			selected_city:[],
			initCity:[]
		};
		//存储所有城市
		this.city = [];
		this.cityStr =''
	}

	_labelUp() {
		this.setState({
			label_up: false,
      city_up: false,
      type_up: false,
		})
	}

	componentWillMount() {

		Dispatcher.dispatch({
			actionType: 'FetchLableList',
			type: 'offline'
		})
		this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
		this._labelUp = EventCenter.on('labelUp', this._labelUp.bind(this))
	}

	componentDidMount() {

	}

  componentWillUnmount() {
    this._getLabelList.remove()
		this._labelUp.remove()
  }

	//获取线下课城市和对应的课程列表
  _handleFetchLableListDone(result) {
		var {err,result} = result;
		if(err){
			return;
		}
		this.city = this.city.concat(result.city);
		var _selectedCity=this._filterCity(this.city);

		var _cityName = ''
		if(_selectedCity.length > 1){
			_cityName = '多个城市'
		}
		else{
			if(_selectedCity.length == 0){
				_cityName = '举办城市'
			}
			else if (_selectedCity.length == 1) {
				_cityName = _selectedCity[0].city_name;
			}
		}
		var cityIds = ''
		if(result.checkedCityIds.length > 1){
			cityIds = result.checkedCityIds.join(',');
		}
		else if (result.checkedCityIds.length == 1) {
			cityIds = result.checkedCityIds[0];
		}

    this.setState({
			label: this.label.concat(result.label),
      city: this.city,
			selected_city:_selectedCity,
			checkedCityIds:result.checkedCityIds,
			city_ids:cityIds,
			city_name:_cityName,
		})

		var	status = {
			label_id: this.state.label_id,
			teacher_id: '',
			city_id: cityIds,
			status: this.state.type_id,
			limit: 15,
			skip: 0
		}
		Dispatcher.dispatch({
			actionType: 'OfflineList',
			status
		})
  }

	//筛选被选中的城市
	_filterCity(_citys){
		var _selectedCity = _citys.filter(function(item,index){
					return item.checkedCity;
		})
		return _selectedCity;
	}

  //展开筛选
  clickLabel(label) {
		this.setState({
			mask_display:'none',
		})
    if(label == 'label') {
			if(!this.state.label_up == false){
				this.setState({
	        label_up: !this.state.label_up,
	        city_up: false,
	        type_up: false,
					mask_display:'none',
	      })
			}else {
				this.setState({
	        label_up: !this.state.label_up,
	        city_up: false,
	        type_up: false,
					mask_display:'block',
	      })
			}

    } else if(label == 'city') {
			if(!this.state.city_up == false){
				this.setState({
	        city_up: !this.state.city_up,
					label_up: false,
	        type_up: false,
					mask_display:'none',
	      })
			}else {
				//生成一个新的数组
				var data = this.state.selected_city.concat();
				this.setState({
	        city_up: !this.state.city_up,
	        type_up: false,
					label_up: false,
					mask_display:'block',
					initCity:data
	      })
			}

    } else if(label == 'type') {
			if(!this.state.type_up == false){
				this.setState({
	        label_up: false,
	        city_up: false,
	        type_up: !this.state.type_up,
					mask_display:'none',
	      })
			}else {
				this.setState({
	        label_up: false,
	        city_up: false,
	        type_up: !this.state.type_up,
					mask_display:'block',
	      })
			}
    }
  }

	//城市筛选(选中、取消更新状态)
	_onOptionsSelected(item, index){
		 var isCheck = false;
		 this.state.initCity.map((i,idx)=>{
			 if(i.city_name == item.city_name) {
				 isCheck = true;
				 this.state.initCity.splice(this.state.initCity.indexOf(i),1);
				 return;
			 }
		 })
		 if(!isCheck) {
			 this.state.initCity.push(item);
		 }
		 this.setState({
				 initCity: this.state.initCity,
		 });
	}

  //选择筛选展开列表
  //关闭筛选
  clickTab(idx, type) {
    var status = {}
    if(type == 'label') {//课程体系筛选逻辑处理
      this.setState({
        label_name: this.state.label[idx].label_name,
        label_id: this.state.label[idx].label_id,
        label_up: false,
				mask_display:'none',
      }, () => {
        var status = {
          label_id: this.state.label_id,
          teacher_id: '',
          city_id: this.state.city_ids,
          status: this.state.type_id,
          limit: 15,
          skip: 0
        }
        Dispatcher.dispatch({
          actionType: 'OfflineList',
          status
        })
      })
    } else if(type == 'city') {//城市筛选逻辑处理

			// if(this.state.city[idx].checkedCity){
			// 	this.state.city[idx].checkedCity = false;
			// }
			// else {
			// 	this.state.city[idx].checkedCity = true;
			// }
			// this.city = this.state.city;
      // this.setState({
			// 	city:this.city
      //   city_ids: this.state.city[idx].city_id,
			// 	city_ids: this.city[idx].city_id,
			// })

    }
		else if(type == 'type') {
      this.setState({
        type_name: this.type[idx].type,
        type_id: this.type[idx].id,
        type_up: false,
				mask_display:'none',
      }, () => {
      var status = {
					label_id: this.state.label_id,
          teacher_id: '',
          city_id: this.state.city_ids,
          status: this.state.type_id,
          limit: 15,
          skip: 0
        }
        Dispatcher.dispatch({
          actionType: 'OfflineList',
          status
        })
      })
    }
  }

	//重置站点城市，默认显示全国范围的课程
	_reset(){
		this.state.selected_city = [{city_name:"举办城市",city_id:""}]
		var _cityName = '举办城市';
		var status = {
			label_id: this.state.label_id,
			teacher_id: '',
			city_id: '',
			status: this.state.type_id,
			limit: 15,
			skip: 0
		}
		Dispatcher.dispatch({
			actionType: 'OfflineList',
			status
		})
		this.setState({
			city_name:_cityName,
			city_ids:'',
			mask_display:'none',
			city_up:false
		})
	}

	//确定设置当前选中的站点
	_confirmSite(){
		var _cityName = ''
		var _cityId =''
		this.state.selected_city = this.state.initCity
		this.state.selected_city.map((item,index)=>{
			if(item.city_name =='举办城市'){
				this.state.selected_city.splice(index,1);
			}
		})

		if(this.state.selected_city.length == 0){
			this.state.selected_city = [{city_name:"举办城市",city_id:""}]
		}

		if(this.state.selected_city.length > 1){
			_cityName = '多个城市'
			var temp = []
			this.state.selected_city.map((item,index)=>{
				temp.push(item.city_id);
			})
			_cityId = temp.join(',')
		}
		else{
			if (this.state.selected_city.length == 1) {
				_cityName = this.state.selected_city[0].city_name;
				_cityId = this.state.selected_city[0].city_id;
			}
		}
		var status = {
			label_id: this.state.label_id,
			teacher_id: '',
			city_id: _cityId,
			status: this.state.type_id,
			limit: 15,
			skip: 0
		}
		Dispatcher.dispatch({
			actionType: 'OfflineList',
			status
		})

		this.setState({
			city_name:_cityName,
			city_ids:_cityId,
			mask_display:'none',
			city_up:false
		})
	}

	render(){

    var labelName = this.state.label.map((item, index) => {
      return(
        <div key={index} style={{display: this.state.label_up ? 'block' : 'none', height: 40, width: devWidth, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
        <div style={{marginLeft: 12, lineHeight: '39px', color: item.label_name == this.state.label_name ? '#2196f3' : '#333'}}
        onClick={() => {
          this.clickTab(index, 'label')
        }}
        >{item.label_name}</div>
        <hr style={{width: devWidth, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
      )
    })

    var allCity = this.state.city.map((item, index) => {
			var text_color='#333';
			var border_color='solid 1px #e8e5e5';
			this.state.initCity.map((i,idx)=>{
				if(item.city_name == i.city_name){
					text_color ='#2196f3'
					border_color ='solid 1px #2196f3'
				}
			})
      return(
        <div key={index} style={{display: this.state.city_up ? 'inline-block' : 'none', color: '#333', fontSize: 14}}>
					<div style={{...styles.cityLabel, color: text_color,border:border_color}}
						onClick={() => {

							this._onOptionsSelected(item,index)
            }}>
						{item.city_name}
					</div>
        </div>
      )
    })

    var isHot = this.type.map((item, index) => {
      return(
        <div key={index} style={{display: this.state.type_up ? 'block' : 'none', height: 40, width: devWidth, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
          <div style={{marginLeft: 12, lineHeight: '39px', color: item.type == this.state.type_name ? '#2196f3' : '#333'}}
            onClick={() => {
              this.clickTab(index, 'type')
            }}
          >{item.type}</div>
          <hr style={{width: window.screen.width, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
      )
    })

		return (
      <div>
        <div style={{...styles.tab}}>
					<div onClick={() => {this.clickLabel('city')}} style={{display: 'flex', flexFlow: 'row', flexGrow: 1, justifyContent: 'center'}}>
						<div style={{...styles.LineClamp,width:90,textAlign:'center', color: this.state.city_name !== '举办城市' ? '#2196f3' : '#333',}}>{this.state.city_name}</div>
						<img src={this.state.city_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png') } style={{...styles.triangle}}/>
					</div>
          <div style={{...styles.hr, marginLeft: 0}}></div>
					<div onClick={() => {this.clickLabel('label')}} style={{display: 'flex', flexFlow: 'row', flexGrow: 1, justifyContent: 'center'}}>
            <div style={{color: this.state.label_id !== '' ? '#2196f3' : '#333'}}>{this.state.label_name}</div>
            <img src={this.state.label_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          <div style={{...styles.hr, marginLeft: 0}}></div>
          <div onClick={() => {this.clickLabel('type')}} style={{display: 'flex', flexFlow: 'row', flexGrow: 1, justifyContent: 'center'}}>
            <div style={{color: this.state.type_id !== 2 ? '#2196f3' : '#333'}}>{this.state.type_name}</div>
            <img src={this.state.type_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
        </div>
        <hr style={{border: 'none', height: 1, width: window.screen.width, backgroundColor: '#f6f6f6'}}/>
        <div style={{display: 'flex', flexFlow: 'column', width: window.screen.width, position: 'absolute', zIndex: 999}}>
				{/*<div style={{backgroundColor: '#f4f4f4', display: this.state.city_up ? 'block' : 'none'}}>
					<div style={{color: '#999', marginTop: 16, marginLeft: 11, fontSize: 12}}>当前定位城市</div>
					<div style={{color: '#333', marginTop: 12, marginLeft: 11, fontSize: 12, float: 'left', marginBottom: 11, backgroundColor: '#fff', width: 70, height: 25, lineHeight: '25px', border: '1px solid #e8e5e5', textAlign: 'center', borderRadius: 100}}>上海</div>
					<div style={{color: '#2196f3', fontSize: 12, float: 'right', marginTop: 20, marginRight: 18}}>GPS重新定位</div>
				</div>*/}
				<div style={{backgroundColor: '#f4f4f4', display: this.state.city_up ? 'block' : 'none'}}>
    			{/*<div style={{color: '#999', marginTop: 16, marginLeft: 11, fontSize: 12, marginBottom: 10}}>热门城市</div>*/}
					<div style={{marginTop: '15px',backgroundColor:'#f4f4f4', display:this.state.mask_display}}>
						{allCity}
						<div style={styles.cityBox}>
							<div style={styles.reset} onClick={this._reset.bind(this)}>重置</div>
							<div style={{...styles.reset,backgroundColor:'#2196f3',color:'#fff'}} onClick={this._confirmSite.bind(this)}>确认</div>
						</div>
					</div>
				</div>
					{labelName}
          {isHot}
        </div>
				<div onClick={this._hide.bind(this)} style={{...styles.mask,display:this.state.mask_display,}}></div>
      </div>
		)
	}

	_hide(){

		this.setState({
			mask_display:'none',
			label_up: false,
      city_up: false,
      type_up: false,
			// city:this.city
		})

	}

}

var styles = {
  tab: {
    width: devWidth,
    backgroundColor: '#f4f8fb',
    height: 45,
    fontFamily:"微软雅黑",
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
	mask:{
		width: devWidth,
		height: devHeight,
		backgroundColor: '#000',
		opacity: 0.3,
		position: 'absolute',
		zIndex: 998,
	},
	cityLabel:{
		marginBottom: 12,
		fontSize: 12,
		marginLeft: (devWidth-280)/5,
		backgroundColor: '#fff',
		width: 70,
		height: 25,
		lineHeight: '25px',
		border: '1px solid #e8e5e5',
		textAlign: 'center',
		borderRadius: 100
	},
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
	},
	cityBox:{
		display:'flex',
		flexDirection:'row',
		width:devWidth,
		height:45,
		marginTop:10,
		borderTop:'solid 1px #e5e5e5',
	},
	reset:{
		backgroundColor:'#f4f4f4',
		color:'#333',
		fontSize:16,
		display:'flex',
		flexDirection:'row',
		width:devWidth/2,
		justifyContent:'center',
		alignItems:'center'
	}
}

export default PgOfflineListFilter;
