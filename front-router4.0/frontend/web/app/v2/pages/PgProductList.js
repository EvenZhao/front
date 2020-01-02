/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
//import ProductTop from '../components/ProductTop'
import PgProductListFilter from './PgProductListFilter'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import ProductLessonDiv from '../components/ProductLessonDiv';
import FullLoading from '../components/FullLoading';
import Loading from '../components/Loading';
import Dm from '../util/DmURL'

function isInteger(obj) { //判断是否为整数
	return parseInt(obj, 10) === obj
}

class PgProductList extends React.Component {
	constructor(props) {
		super(props);
		this.wx_config_share_home = {
			title: '专题课-铂略咨询',
			desc: '铂略碎片化体系财税课程，全新体验，猛戳进入！	',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};

		this.id = ''
		this.data = []
		this.state = {
			listHeight: devHeight - 46,
			data: [],
			loadLength: '',
			isLoading: true,
			isShow: false,
			isOver: false,
			vipPriceFlag: null,
		};
	}

	_labelScorll() {
		if ((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) < document.documentElement.clientHeight) {
			if (this.state.loadLength < 15) {
				this.setState({
					isShow: false,
					isOver: true,
				})
				return
			} else if (this.state.loadLength == 0 || this.state.data.length == 0) {
				this.setState({
					isShow: false,
				})
			} else {
				this.setState({
					isShow: true,
					isOver: false
				}, () => {
					this._loadOnlineMore()
				})
			}
		}
	}

	_loadOnlineMore() {
		if (this.state.data.length > 0) {
			var status = {}
			status = {
				skip: this.state.data.length,
				limit: 15
			}

			const les_status = { ...status }
			Dispatcher.dispatch({
				actionType: 'OnProductListLoadMore',
				les_status
			})
		} else {
			return
		}
	}


	_handleOnProductListLoadMoreDone(re) {

		this.setState({
			data: this.state.data.concat(re.result),
			loadLength: re.result.length,
		}, () => {
			this.backNotload = {
				label: backNotloadLabel,
				list: this.state.data || []
			}
		})
		backNotload = this.backNotload
	}

	_handleOnProductListDone(re) {
		console.log('ProductListDone==', re);

		this.setState({
			// data: this.state.data.concat(re.result),
			data: re.result.length > 0 ? re.result : [],
			loadLength: re.result.length,
			isLoading: false,
			isShow: false,
			vipPriceFlag: re.user.vipPriceFlag
		})
		this.backNotload = {
			label: backNotloadLabel,
			list: re.result.length > 0 ? re.result : []
		}
		backNotload = this.backNotload
	}

	componentWillMount() {

	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-专题课')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		if (backNotloadIndex == 'PgProductDetail') {
			this.setState({
				data: backNotload.list,
				isLoading: false,
				loadLength: (isInteger(backNotload.list.length / 15) || (backNotload.list.length / 15) > 0) ? backNotload.list.length : 0
			})
			setTimeout(() => {
				this.lessonList.scrollTop = backNotloadTop;
			}, 50)
			// backNotload = ''
		}
		this._getOnProductListDone = EventCenter.on('OnProductListDone', this._handleOnProductListDone.bind(this))
		this._OnProductListLoadMoreDone = EventCenter.on('OnProductListLoadMoreDone', this._handleOnProductListLoadMoreDone.bind(this))
	}
	componentWillUnmount() {
		this._OnProductListLoadMoreDone.remove()
		this._getOnProductListDone.remove()
		backNotloadTop = this.lessonList.scrollTop
	}
	render() {
		let les = {
			les: this.props.match.params.type
		}
		let props = {
			data: this.state.data,
			vipPriceFlag: this.state.vipPriceFlag
		}
		//  console.log('this.state.data==',this.state.data);
		var lessonDiv = <ProductLessonDiv {...props} />
		return (
			<div style={{ backgroundColor: '#fff' }} ref={(lessonDiv) => this.lessonDiv = lessonDiv}>
				<FullLoading isShow={this.state.isLoading} />
				<PgProductListFilter {...les} />


				<div style={{ display: this.state.data.length == 0 ? 'block' : 'none', marginTop: 20, height: this.state.listHeight }} onTouchEnd={() => { EventCenter.emit("labelUp") }}>
					<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={{ width: 280, height: 190, marginLeft: devWidth / 2 - 140, marginTop: 20 }} />
					<div style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>暂无相关数据~</div>
				</div>
				<div style={{ ...styles.list, height: this.state.listHeight, display: this.state.data.length < 1 ? 'none' : 'block' }} ref={(lessonList) => this.lessonList = lessonList} onTouchEnd={() => {
					EventCenter.emit("labelUp")
					this._labelScorll()
				}}>
					{lessonDiv}
					<div style={{ height: 40, display: this.state.isOver == true && this.state.isShow == false && this.state.data.length > 0 ? 'block' : 'none', textAlign: 'center' }}>共{this.state.data.length}条</div>
					<Loading isShow={this.state.isShow} />
				</div>
			</div>
		);
	}
}

var styles = {
	list: {
		// height: 667,
		overflow: 'scroll',
		backgroundColor: '#fff'
	},
};

export default PgProductList;
