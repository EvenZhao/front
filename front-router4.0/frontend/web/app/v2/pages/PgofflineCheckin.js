/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react'

var countdown;

function utf16to8(str) {//在二维码编码前把字符串转换成UTF-8
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
    } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    }
    }
    return out;
}

function searchParse(){
  var resultObj = {};
  var search = window.location.search;
  if(search && search.length > 1){
    var search = search.substring(1);
    var items = search.split('&');
    for(var index = 0 ; index < items.length ; index++ ){
      if(! items[index]){
        continue;
      }
    var kv = items[index].split('=');
      resultObj[kv[0]] = typeof kv[1] === "undefined" ? "":kv[1];
    }
  }
  return resultObj;
}

var search = searchParse('checkcode').checkcode
// console.log('dkhskjdkshdskhdjskj',URLDecoder.decode(search, "UTF-8"));

class PgofflineCheckin extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
      value: utf16to8(search),
       size: 200,
       fgColor: '#000000',
       bgColor: '#ffffff',
       level: 'M',
		};
	}

	componentWillMount() {

	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-线下课签到二维码生成页面')
	}
	componentWillUnmount() {
	}
	render(){
		return (
      <div style={{...styles.container}}>
        <div style={{...styles.code}}>
          <QRCode
            value={this.state.value}
            size={this.state.size}
            fgColor={this.state.fgColor}
            bgColor={this.state.bgColor}
            level={this.state.level}
           />
         </div>
       </div>
		);
	}
}
var styles = {
  container:{
    backgroundColor: '#f4f4f4',
    height: devHeight,
    width: devWidth,
  },
  code:{
    position:'relative',
    top:(devHeight-200)/2,
    left:(devWidth-200)/2
  }
};
export default PgofflineCheckin;
