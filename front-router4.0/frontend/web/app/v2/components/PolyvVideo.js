/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import assign from 'object-assign'

var pl

class PolyvVideo extends React.Component {
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
		this.start_time = 0

	}

	_resumePlayer(){
		pl.j2s_resumeVideo();
	}
	componentDidMount() {
    this.e_InitPolyvPlayer = EventCenter.on("InitPolyvPlayer", this._init_online_player.bind(this))
		this.e_resumePlayer = EventCenter.on("resumePlayer", this._resumePlayer.bind(this))
	}

	componentWillUnmount() {
    this.e_InitPolyvPlayer.remove()
		this.e_resumePlayer.remove()
		AddLearnRecordLeave()//离开页面时调用此方法
	}

  _init_online_player(){
    var video = this.props.video
		var accountId = ''
		if (!isApple) { //如果不是IOS把用户ID 赋值
			accountId = this.props.accountId
		}
    if( (video.type === 'online_info' || (video.type === 'live_info' && video.live_status == 2))
      && (video.isFree || video.authority)){
        if(video && video.sign) {
          this.setState({
            isPlaying: true
          },() => {
            try {
              // ReactDOM.unmountComponentAtNode(this.placeholder)
              pl && pl.destroy()
               pl = polyvObject(`#${video.sign}`).videoPlayer(
                            {
                            'width': this.props.width || '100%',
                            'height': this.props.height || 236,
                            'vid': video.vid,
                            'ts': '' + video.ts || '',
                            'sign': video.sign || '',
                            'flashvars':
                            Object.assign(
                              {
                                'autoplay': '1',
                              },
                              video.start ? {'watchStartTime': '' + video.start } : {},
                              video.end ? {'watchEndTime': '' + video.end } : {},
                              {
                                'srt_caption_txt_height': 0, 'srt_caption_txt_size': 14, 'srt_caption_txt_color': '0xFCAB50', 'srt_caption_txt_font':'MicrosoftYaHei-Bold', 'srt_caption_txt_letterspacing': 0.1, 'srt_caption_txt_filter': 'on', 'srt_caption_txt_filter_color': '0x080808', 'srt_caption_txt_filter_alpha': 1, 'srt_caption_txt_filter_blurx': 2, 'srt_caption_txt_filter_blury': 2
                              },
                            ),
														'session_id' : accountId
                            }
                          );

              pl.s2j_onPlayerInitOver = function(){
                pl.j2s_resumeVideo()
              }
              pl.s2j_onPlayStart = function(){
                  // this._play_online();

              }.bind(this);
              pl.s2j_onVideoPause = function(){
								// alert('s2j_onVideoPause')
								EventCenter.emit('AddLearnRecord', Object.assign({}, {end_time: pl.j2s_getCurrentTime(), start_time: this.start_time, catalog_id: video.catalog_id}))
                  this.setState({
                    isShowAd: true
                  });
              }.bind(this);
              pl.s2j_onVideoPlay = function(){
									this.start_time = pl.j2s_getCurrentTime()
                  this.setState({
                    isShowAd: false
                  });
									AddLearnRecordLeave = () => { //定义APP需要的全局函数
										EventCenter.emit('AddLearnRecord', Object.assign({}, {end_time: pl.j2s_getCurrentTime(), start_time: this.start_time, catalog_id: video.catalog_id}))
		                  this.setState({
		                    isShowAd: true
		                  });
								  }
              }.bind(this);
							pl.s2j_onPlayOver = function() {
								//试题
								if(video.exam == 0) {
									return
								} else if(video.exam == 1) {
									EventCenter.emit('JumpToExam', video)
									// this.props.history.push({pathname: '/exam/'+video.resource_id+'/'+video.catalog_id+'', query: null, hash: null, state: {catalogIdx: video.catalogIdx}})
								}
							}.bind(this);

              this.setState({
                onlineVplayer: pl
              });
            } catch(ex) {

            }
          });
      }
    }
  }

	render(){
    let video = this.props.videoShow ? <div style={styles.top_img} id={this.props.video.sign || 'placeholder'} ref={(r) => {this.placeholder = r}}/> : ''
		return (
      <div>
        {video}
        {/*{this.props.video.sign}*/}
        {/*<img src={this.state.img} style={{...styles.top_img, display: this.state.onlineVplayer ? 'none': 'block'}}/>*/}
      </div>
		);
	}
}

var styles = {
  top_img: {
		width: '100%',
		height: 236,
		position: 'relative',
    top: 0
	},
};
export default PolyvVideo;
