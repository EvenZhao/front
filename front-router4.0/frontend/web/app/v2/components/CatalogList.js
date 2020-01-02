import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common'

class CatalogList extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      select: [],
			catalogId: '',
			index: 0,
			catalogNum:0,
		};

    this.select = []

  }

    _select(id, video) {
  		var selected = []
			selected.push(id)
  		this.setState({
  			select: selected
  		}, () => {
				EventCenter.emit("ChooseCatalog", video)
			})
  	}
		// NextCatalogList(video){
		// 	if (NextCatalogList.length > 0 ) {
		// 		var next = video.catalogIdx || 0
    //
		// 	}
		// }
		_handleGetCatalogDetail(re) {
				console.log('_handleGetCatalogDetail',re);
				NextCatalogList = re.catalog || []
			if(re && re.catalog) {
				var catalogIdx
				var selectCatalogId
				var selectVideo
				if(localStorage.getItem('CatalogIdx')) {
					catalogIdx = parseInt(localStorage.getItem('CatalogIdx')) + 1
				} else if(parseInt(localStorage.getItem('CatalogIdx')) + 1 == re.catalog.length) {
					catalogIdx = parseInt(localStorage.getItem('CatalogIdx'))
				} else if(!parseInt(localStorage.getItem('CatalogIdx'))) {
					catalogIdx = this.props.catalogIdx
				}
				localStorage.removeItem('CatalogIdx')
				
				//判断章节序号是否是最后一个
				parseInt(catalogIdx) + 1 > re.catalog.length ? catalogIdx = re.catalog.length-1 : null
				this.setState({
					catalogId: selectCatalogId,
					index: catalogIdx
				}, () => {
					selectCatalogId = re.catalog[this.state.index].video.catalog_id
					selectVideo = Object.assign(re.catalog[this.state.index].video, {isFree: re.catalog[this.state.index].isFree, exam: re.catalog[this.state.index].exam, catalogIdx: 0})
					this._select(selectCatalogId, selectVideo)
				})
			}
		}

		componentDidMount() {
			this._getCatalog = EventCenter.on('getCatalogDetail', this._handleGetCatalogDetail.bind(this))

		}

		componentWillUnmount() {
			this._getCatalog.remove()
		}

		//显示弹框
		_showAlert(){
			EventCenter.emit("isAddShow")
		}

    render() {
			if(this.props.catalog) {
				console.log("ca===",this.props.catalog)
				var menu = this.props.catalog.map((item, index) => {
	  			item.select
	  			var dis
					var isLocked
	  			if(item.exam === 1) {
	  				dis = 'inline-block'
	  			} else {
	  				dis = 'none'
	  			}
	  			// if(item.catalog_id == this.select) {
					// 	item.select = true
	  			// } else {
	  			// 	item.select = false
	  			// }
					if(this.state.select.indexOf(item.catalog_id) > -1) {
						item.select = true
					} else {
						item.select = false
					}

					if(this.props.authority == true) {
						isLocked = 'none'
					} else {
						if(item.isFree == true) {
							isLocked = 'none'
						} else {
							isLocked = 'flex'
						}
					}

					var videoData = Object.assign(item.video, {isFree: item.isFree, exam: item.exam, catalogIdx: index, catalogTitle: item.title})
	  			return(
	  				<div key={index}>
	  					<div style={{...styles.memuDiv}}>
	  						<div style={{...styles.num}}>{index+1}</div>
								<img src={Dm.getUrl_img(`/img/v2/icons/password@2x.png`)} style={{width: 12, height: 17, marginRight: 8, display: isLocked}} onClick={this._showAlert.bind(this)}/>
	  						<div style={{...styles.lesTitle, color: item.select ? '#999' : '#333'}} onClick={() => {this._select(item.catalog_id, videoData)}}>{item.title}<span style={{...styles.isTest, display: dis}}>测</span></div>
	  						<div style={{...styles.lesTime, width: 47}}>{item.duration}</div>
	  					</div>
	  					<div style={{...styles.lesCotent, display: item.select ? 'inline-block' : 'none'}}>{item.content == '' ? '暂无简介。' : item.content}</div>
	  				</div>
	  			)
	  		})
			} else {
				var menu = ''
			}

      return(
        <div>
          {menu}
        </div>
      )
    }
	}

var styles = {
  memuDiv: {
		paddingLeft: 12,
		paddingRight: 12,
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 15
	},
  num: {
		fontSize: 13,
		lineHeight: '18px',
		width: 18,
		height: 18,
		borderRadius: 50,
		marginRight: 9,
		color: '#333',
		backgroundColor: '#e6e6e6',
		textAlign: 'center'
	},
  lesTitle: {
		fontSize: 13,
		color: '#333',
		flex: 1,
		wordBreak: 'break-word'
	},
  lesTime: {
		color: '#999',
		fontSize: 11,
		textAlign: 'end',
		marginLeft: 10
	},
  lesCotent: {
		marginBottom: 15,
		marginLeft: 38,
		marginRight: 28,
		backgroundColor: '#f2fafa',
		padding: 8,
		fontSize:13,
		color: '#999'
	},
	isTest: {
		width: 14,
		height: 14,
		fontSize: 11,
		color: '#666',
		lineHeight: '16px',
		padding: 1,
		borderRadius: 4,
		border: '1px solid #e5e5e5',
		marginLeft: 7,
	},
	white_alert:{
		width:devWidth-100,
		height:130,
		backgroundColor:Common.Bg_White,
		borderRadius:12,
		position:'absolute',
		zIndex:1000,
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

export default CatalogList;
