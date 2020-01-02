import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';

import { Link } from 'react-router-dom';

import Common from '../Common';

class HomeOnlineItem extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
    }
  }
  render() {
    let w_width = devWidth
    let w_height = devHeight
    let width;
    if (w_width <= 320) {
      width=136
    }else {
      width=devWidth*0.44
    }
    var OnlineLessons = this.props.data.map((item, index) => {
      var right;
      if (index == 0) {
        right=15
      }else {
        right = 0
      }
      return(
        <Link to={`${__rootDir}/lesson/online/${item.id}`} key={index}>
          <div style={{width:width,float:'left',marginRight:right,paddingTop:12}} key={index}>
            <div style={{width:width,height:104}}>
              <img src={item.brief_image} height="104" width={width}/>
            </div>
            <div style={{...styles.LineClamp,fontSize:14,color:'#333333',height:36,lineHeight:'18px', width:width-2,WebkitLineClamp:2}}>
              {item.title}
            </div>
          </div>
        </Link>
      )
    });
    return(
      <div>
        {OnlineLessons}
      </div>
    )
  }
}

var styles = {
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    // WebkitLineClamp: 1,
  }
}

export default HomeOnlineItem;
