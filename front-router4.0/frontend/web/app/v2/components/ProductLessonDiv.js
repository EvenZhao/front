import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from '../pages/ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class ProductLessonDiv extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
		
		}
	}

	componentWillReceiveProps(nextProps){
		
  }


	render() {
		
		var lesson_list = this.props.data.map((item, index) => {
			let w_width = devWidth
			let w_height = devHeight
			var duration = item.duration ? item.duration.toFixed(1) : 0
			var free;
			var padT;
			var padB;
			var test;
			var width;
			var height;
			if (index == 0) {
				padT = 15,
					padB = 15
			} else {
				padT = 0,
					padB = 15
			}
			if (w_width != 375) {
				width = (w_width / 375) * 127
				height = 80
			} else {
				width = 127
				height = 80
			}
			return (
				<Link to={`${__rootDir}/productDetail/${item.id}`} key={index}>
					<div style={{ ...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height }} ref={(lesson) => this.lesson = lesson}>
						<img style={{ ...styles.lessonPng, width: width, height: height, marginRight: 15, marginLeft: 12 }} src={item.default_image} />
						<div style={{ float: 'left', width: devWidth - (width + 15 + 12) }}>
							<div style={{ ...styles.span, fontSize: 14, width: devWidth - 156, height: 40 }}>
								{item.title}
							</div>
							<div style={{ ...styles.price }}>
								{this.props.vipPriceFlag == 1 ?
									<div style={{ display: 'inline-block' }}>
										<img src={Dm.getUrl_img('/img/v2/icons/productVIP.png')} style={{ width: 26, height: 15, float: 'left',marginRight:2, marginTop: 3 }} />
										<span style={{ color: '#666' }}>优惠价格</span>￥<span style={{ fontSize: 14 }}>0</span>
										<span style={styles.singlePrice}>专题价格￥{item.singlePrice}</span>
									</div>
									:
									<div style={{ display: 'inline-block' }}>
										<span style={{ color: '#666' }}>优惠价格</span>￥<span style={{ fontSize: 14 }}>{item.price}</span>
										<span style={styles.singlePrice}>专题价格￥{item.singlePrice}</span>
									</div>
								}
							</div>
							<div style={{ marginTop: 5, }}>
								<div style={{ width: (devWidth - 156) / 2, float: 'left' }}>
									<span style={{ ...styles.lessonTime }}><img src={Dm.getUrl_img('/img/v2/icons/product_level@2x.png')} style={{ width: 15, height: 15 }} /></span>
									<span style={{ ...styles.lessonTime }}>{item.level_num}阶段</span>
								</div>
							</div>
						</div>
					</div>
				</Link>
			)
		});
		return (
			<div>
				{lesson_list}
			</div>
		)
	}
}

var styles = {
	span: {
		fontSize: 14,
		color: '#333',
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px'
	},
	list: {
		// height: 667,
		overflow: 'scroll',
	},
	lessonDiv: {
		height: 80,
		backgroundColor: '#fff',
		paddingTop: 15,
		position: 'relative'
	},
	lessonPng: {
		width: 127,
		height: 80,
		// border: '1px solid',
		marginLeft: 12,
		marginRight: 12,
		float: 'left',
	},
	isFree: {
		fontSize: 11,
		color: "#2196f3",
		border: '1px solid',
		borderColor: '#2196f3',
		borderRadius: '4px',
		float: 'left',
		marginRight: 9,
		paddingLeft: 5,
		paddingRight: 5,
	},
	timePng: {
		width: 14,
		height: 14,
		float: 'left',
		border: '1px solid',
		marginRight: 7,
	},
	lessonTime: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
		marginRight: 14,
	},
	line: {
		float: 'left',
		lineHeight: '14px',
		color: '#e5e5e5',
		height: 11,
		width: 1,

	},
	chapter: {
		fontSize: 12,
		color: '#999',
		float: 'left',
		lineHeight: '16px',
		marginLeft: 14,
		marginTop: 3,
	},
	isTest: {
		fontSize: 11,
		color: '#666',
		lineHeight: '13px',
		padding: 1,
		borderRadius: 4,
		float: 'left',
		border: '1px solid #e5e5e5',
		marginLeft: 7,
	},
	price: {
		color: '#f37633',
		fontSize: 12,
	},
	singlePrice: {
		textDecoration: 'line-through',
		color: '#D1D1D1',
		fontSize: 11,
		marginLeft: 6
	}
}

export default ProductLessonDiv;
