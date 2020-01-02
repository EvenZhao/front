var maskStyle = {
  msk:{
    width: devWidth,
		height: devHeight,
		backgroundColor:'#000000',
		position:'absolute',
		zIndex: 998,
		opacity:0.2,
		top:0,
		textAlign:'center',
  },
  white_alert:{
    width:devWidth-100,
    height:150,
    backgroundColor:'#fff',
    borderRadius:12,
    position:'absolute',
    zIndex:999,
    top:180,
    left:50,
    textAlign:'center',
  },
  alert_bottom:{
    position:'absolute',
    zIndex:201,
    bottom:0,
    left:0,
    width:devWidth-100,
    height:42,
    borderTopStyle:'solid',
    borderTopWidth:1,
    borderTopColor:'#d4d4d4',
    display:'flex',
    flex:1,
  },
}

export default maskStyle;
