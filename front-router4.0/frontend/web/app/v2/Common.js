import React from 'react'

export const COLOR = {
  Black: '#333',
  Light_Black:'#000',
  Gray: '#666',
  Light_Gray:'#999',
  Bg_White:'#fff',
  Activity_Text:'#2196F3',
  OverColor:'#9AB2CF',
  CompleteColor:'#F69898',
  orange:'#f37633',
  red:'#FF0000',
  clear:{
    clear:'both',
    height:0,
    visibility:'hidden',
    content:'.',
    display:'block',
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    // WebkitLineClamp: 1,
  },
  alertDiv:{
		position:'absolute',
    zIndex:1000,
		top:170,
		backgroundColor:'#000',
		opacity:0.7,
		fontSize:15,
		color:'#ffffff',
		width:190,
		height:104,
		left: (window.screen.width-170)/2,
		textAlign:'center',
		borderRadius:10,
	},
  LDATE: "yyyy年MM月dd日",
  TMSTAMP: "yyyy-MM-dd hh:mm:ss.S",
  DATE_TIME: "yyyy-MM-dd hh:mm",
  YDATE: "yyyy-MM-dd",
  MDH_TIME: "MM月dd日 hh:mm",
  MD_TIME: "MM-dd hh:mm",
  DATE: "MM月dd日",
  TIME: "hh:mm",
}

/*屏幕的宽度、高度*/
global.devWidth = window.innerWidth;
global.devHeight = window.innerHeight;
window.onresize = function (argument) {
  global.devWidth = window.innerWidth;
  global.devHeight = window.innerHeight;
}
/*常用字号*/
global.Fnt_Small = 12;
global.Fnt_Normal = 14;
global.Fnt_Medium = 16;
global.Fnt_Large = 18;

//每次加载数据长度
global.Limit = 15;

//弹框提示信息成功或者失败所用图标
global.success_icon = 'success@2x.png';
global.failure_icon = 'failure@2x.png';
//弹框成功的时候图标的宽高都是suc_widthOrheight
global.suc_widthOrheight = 42;
//弹框显示错误信息时所用图标的宽与高
global.failure_width = 22;
global.failure_height = 23;



export default COLOR;
