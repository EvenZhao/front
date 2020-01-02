import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'


var countdown
var startX
var startY


//返回角度
function GetSlideAngle(dx, dy) {
		return Math.atan2(dy, dx) * 180 / Math.PI;
}


//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
		var dy = startY - endY;
		var dx = endX - startX;
		var result = 0;

		//如果滑动距离太短
		if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
				return result;
		}

		var angle = GetSlideAngle(dx, dy);
		if(angle >= -45 && angle < 45) {
				result = 4;
		}else if (angle >= 45 && angle < 135) {
				result = 1;
		}else if (angle >= -135 && angle < -45) {
				result = 2;
		}
		else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
				result = 3;
		}

		return result;
}


class Carousel extends React.Component {
	constructor(props) {
    super(props);
    // this.data = ['1','2','3',]
		this.state = {
        displayNum: 0,//当然默认显示图片为0
				CarouselTop: this.props.CarouselTop || 0
		};

	}


  componentWillMount() {

  }

	componentDidMount() {
		clearInterval(countdown)
     countdown = setInterval(()=>{
       if (this.state.displayNum < this.props.CarouselData.length-1) {//定时器循环轮播图
         this.setState({
           displayNum: this.state.displayNum+1
         })
       }else {
         this.setState({
           displayNum: 0
         })
       }
     }, 3000);
	}
	componentWillUnmount() {
		clearInterval(countdown); //离开页面的时候把定时器关掉

	}
	onClickChange(re){
		this.setState({
			displayNum: re,
		})
	}
	onTouchStart(ev){//触屏开始事件
		startX = ev.touches[0].pageX;
		 startY = ev.touches[0].pageY;
	}
	onTouchEnd(ev){//触屏结束事件
	var endX
	var endY
	endX = ev.changedTouches[0].pageX;
	endY = ev.changedTouches[0].pageY;
	 var direction = GetSlideDirection(startX, startY, endX, endY);
	 switch(direction) {
		case 0:
				// alert("没滑动");
				break;
		case 1:
				console.log("向上");
				break;
		case 2:
				console.log("向下");
				break;
		case 3:
				// console.log('向左');
				if (this.state.displayNum==this.props.CarouselData.length-1) {
					this.setState({
						displayNum: 0,
					})
				}else {
					this.setState({
						displayNum: this.state.displayNum+1,
					})
				}
				break;
		case 4:
				// console.log('向右');
				if (this.state.displayNum==0) {
					this.setState({
						displayNum: this.props.CarouselData.length-1,
					})
				}else {
					this.setState({
						displayNum: this.state.displayNum-1,
					})
				}
				break;
		default:
	}

}
	render(){
      var Carousel =this.props.CarouselData.map((item,index)=>{//根据数组循环轮播图
				return(
					<div style={{...styles.imageDiv,display:(this.state.displayNum==index) ? 'block':'none'}} key={index}>
					{
						item.url ?
							<a href={item.url}>
								<img src={item.image} height="200" width={window.screen.width}/>
							</a>
						:
							<img src={item.image} height="200" width={window.screen.width}/>
					}

					</div>
				)
      })
			var displayIndex = this.props.CarouselData.map((item,index)=>{//可点击的按钮

				var mgLeft = 6 //间距
				if(index==0){ //判断可点坐标的位置 第一个的初始位置
					// var indexWidth =this.props.CarouselData.length * 16 //获取坐标的位数乘以坐标的宽度
					var indexWidth = (this.props.CarouselData.length-1)*6 + 16
					var toatalWidth = (this.props.CarouselData.length-1)*6 + indexWidth  //坐标的宽度加上间距
					mgLeft = (window.screen.width -toatalWidth )/2
					// console.log('mgLeft',mgLeft);
				}
				// var bgColor= '#FFFFFF'
				var icon_width = 6;
				var border_radius = '100%'
				if (index==this.state.displayNum) {
					// if (this.props.isNerYear > 0) {
					// 	// bgColor='#E81A2A'
					// 	icon_width = 6;
					// 	border_radius = '100%';
					// }else {
					// 	// bgColor='#2196f3'
					// 	icon_width = 16;
					// 	border_radius = '100px';
					// }
					icon_width = 16;
					border_radius = '100px';
				}
				return(
					<div style={{...styles.indexNum,width:icon_width,borderRadius:border_radius,marginLeft:mgLeft}} key={index} onClick={this.onClickChange.bind(this,index)}></div>
				)
			})
			// 轮播图分页器背景
			var bgWidth = (this.props.CarouselData.length-1)*6 + 16 + (this.props.CarouselData.length-1)*6

    return(
			<div style={{...styles.div}}
				ref={(lessonList) => this.lessonList = lessonList}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}
			>
          {Carousel}
					{/*
						<div style={{...styles.indexDiv,display:this.props.CarouselDisplay,}}>
							{displayIndex}
						</div>
						*/}
					<div style={{...styles.indexDiv}}>
						{displayIndex}
					</div>

					{/* <div style={{...styles.picBg,width:bgWidth,padding:'0 15px',left:(window.screen.width-bgWidth-30)/2}}>
					</div> */}
			</div>
    )
  }
}

var styles = {
  div:{
    width: window.screen.width,
    height:200,
		position:'relative'
  },
	imageDiv:{//图片DIV
		width: window.screen.width,
		height: 200
	},
	indexDiv:{
		width:window.screen.width,
		textAlign:'center',
		position:'absolute',
		top:182,
		zIndex:99
	},
	picBg:{
		backgroundColor:'#000',
		borderRadius:100,
		height:14,
		opacity:0.4,
		position:'absolute',
		top:178,
		zIndex:1
	},
	indexNum:{//轮播图点击按钮
		width:6,
		height:6,
		backgroundColor:'#878787',
		opacity:0.8,
		float:'left',
		borderRadius:'100%'
	}
	
	
}

export default Carousel;
