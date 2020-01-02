import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import util from 'util';
var f = util.format;



class LiveDocVideo extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      isPlaying: false,
      isShowAd: false,
      onlineVplayer: null,
      // playerplaceholder_id: Date.now(),
      video: {},
      img: '',
      type: '',
      isFree: false,
      start: null,
      end: null
		};
  }

    componentDidMount() {
      console.log('sdsgdjsjhdjsjdhjhjh');
    }

		componentWillUnMount() {
			// console.log(this.placeholder.dangerouslySetInnerHTML)
      this.placeholder.dangerouslySetInnerHTML = ''

    }
    render() {
			var p ={
					"width": 800,
					"height":600,
					"ppt":[true|false],
					"doc":"测试文档",
					"title":"第一页"
					}
      var ownerid
      // console.log(this.props)
      if(this.props.ownerid) {
        ownerid = this.props.ownerid.split("join-")[1]
				// console.log(ownerid)
      }
      return(
        <div style={{...styles.top_img, display: this.props.isPlay ? 'inline-block' : 'none'}} ref={(r) => {this.placeholder}} dangerouslySetInnerHTML={
					{
						__html: f(
							'<gs:doc site="linked-f.gensee.com" ctx="webcast" ownerid="%s" lang="zh_CN" bar="true"></gs:doc>',
							ownerid,
						)
					}
				}
				>
				</div>
      )
    }
}

var styles = {
  top_img: {
		width: '100%',
		zIndex: 2,
		height: 236,
		position: 'relative',
    top: 100
	},
};
export default LiveDocVideo;
