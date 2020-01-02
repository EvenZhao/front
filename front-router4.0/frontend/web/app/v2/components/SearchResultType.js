import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class SearchResultType extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
      phone: '',
		};

	}

  componentWillMount() {

  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render(){
		var image;
		var type;
		var width
		var height
		switch (this.props.type || '') {
			case 'online':
				image = '/img/v2/icons/video-red@2x.png'
				type ='视频课'
				width = 22
				height = 16
			break;
			case 'live':
				image = '/img/v2/icons/live@2x.png'
				type ='直播课'
				width = 23
				height = 23
			break;
			case 'product':
				image = '/img/v2/icons/product@2x.png'
				type ='专题课'
				width = 23
				height = 23
			break;
			case 'offline':
				image = '/img/v2/icons/offline@2x.png'
				type ='线下课'
				width = 23
				height = 23
			break;
			case 'question':
				image = '/img/v2/icons/search_qa@2x.png'
				type ='问答'
				width = 23
				height = 22
			break;
			default:image = '/img/v2/icons/video-red@2x.png'

		}
    return(
      <div style={{...styles.div}}>
        <div style={{float:'left',marginRight:12, height: 0, marginTop: 2}}>
          <img src={Dm.getUrl_img(image)} width={width} height={height}/>
        </div>
        <div style={{float:'left',marginRight:12}}>
          <span style={{fontSize:14,color:'#333333'}}>{type}</span>
        </div>
        <div style={{...styles.contDiv}}>
          <span style={{fontSize:12,color:'#d7d7d7'}}>{this.props.total_count || 0}</span>
        </div>
        <div></div>
      </div>
    )
  }
}

var styles = {
  div:{
    marginTop:12,
    width:window.screen.width-24,
    marginLeft:12,
    marginTop:12,
    height:24,
  },
  contDiv:{
    float:'left',
    paddingLeft:8,
    paddingRight:8,
    borderRadius:10,
    border:'1px solid',
    borderColor:'#d7d7d7',
    lineHeight:'12px',
    marginTop:4
  }
}

export default SearchResultType;
