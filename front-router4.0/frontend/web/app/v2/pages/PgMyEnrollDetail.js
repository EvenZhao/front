/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class PgMyEnrollDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			start_time: '',
			end_time: '',
			id: '',
			city: '',
			address: '',
			participants: [],
			enrollPerson: '',
			map_x: '',
			map_y: '',
			participantsByInviteeId: [],
			isSameDay: true,
			isMain: false,
		};
	}

	_handlemyEnrollDetail(re) {
		this.setState({
			title: re.result.title,
			start_time: re.result.start_time,
			end_time: re.result.end_time,
			id: re.result.id,
			city: re.result.city,
			address: re.result.address,
			participants: re.result.participants || [],
			enrollPerson: re.result.enrollPerson,
			map_x: re.result.map_x,
			map_y: re.result.map_y,
			participantsByInviteeId: re.result.participantsByInviteeId || [],
			isSameDay: re.result.isSameDay,
			isMain: re.user.isMain,
		})
	}
	_goParticipantsDetail(re) {
		this.props.history.push({ pathname: `${__rootDir}/PgEnrollPerson/${re}` })
	}
	_gotoDetail(re) {
		this.props.history.push({ pathname: `${__rootDir}/lesson/offline/${re}` })
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-报名详情')
		this._getmyEnrollDetail = EventCenter.on("myEnrollDetailDone", this._handlemyEnrollDetail.bind(this))
		Dispatcher.dispatch({
			actionType: 'myEnrollDetail',
			resource_id: this.props.match.params.id
		})
	}

	componentWillUnmount() {
		this._getmyEnrollDetail.remove()
	}

	render() {
		var participants = this.state.participants.map((item, index) => {
			return (
				<div style={{ ...styles.enrollPerson }} key={index} onClick={this._goParticipantsDetail.bind(this, item.enrollId)}>
					{
						this.state.isMain ?
							<div>
								<div style={{ ...styles.box }}>
									<div style={{ ...styles.people_info }}>{item.name}</div>
									<div style={{ ...styles.people_info }}>
										{item.phone}
									</div>
									<div style={{ ...styles.people_info, flex: 1.5 }}>
										{item.email}
									</div>
								</div>
							</div>
							:
							<div>
								<div style={{ width: window.screen.width - 24, height: 45, lineHeight: '45px', borderBottom: 'solid 1px #f3f3f3' }}>
									<span style={{ ...styles.people_info }}>{item.name}</span>
									<span style={{ ...styles.people_info }}>
										{item.position}
									</span>
									<span style={{ ...styles.people_info, textAlign: 'center' }}>
										{item.phone}
									</span>
								</div>
							</div>
					}
				</div>
			)
		})
		var participantsByInviteeId = this.state.participantsByInviteeId.map((item, index) => {
			return (

				<div key={index} style={{ ...styles.enrollPerson }} onClick={this._goParticipantsDetail.bind(this, item.enrollId)}>
					{
						this.state.isMain ?
							<div>
								<div style={{ ...styles.box }}>
									<span style={{ ...styles.people_info }}>{item.name}</span>
									<span style={{ ...styles.people_info }}>
										{item.phone}
									</span>
									<span style={{ ...styles.people_info }}>
										{item.email}
									</span>
								</div>
							</div>
							:
							<div>
								<div style={{ ...styles.box }}>
									<span style={{ ...styles.people_info }}>{item.name}</span>
									<span style={{ ...styles.people_info }}>
										{item.position}
									</span>
									<span style={{ ...styles.people_info, textAlign: 'center' }}>
										{item.phone}
									</span>
								</div>
							</div>
					}
				</div>
			)
		})
		return (
			<div style={{ height: window.innerHeight, width: window.screen.width }}>
				<div style={{ backgroundColor: '#fff', paddingLeft: 12 }}>
					<div style={{ ...styles.div, }} onClick={this._gotoDetail.bind(this, this.state.id)}>
						<div style={{ float: 'left', display: '-webkit-box', width: '80%', textOverflow: 'ellipsis', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>{this.state.title}</div>
						<div style={{ float: 'right', width: 9, height: 16, marginTop: 12 }}>
							<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{ float: 'right', width: 9, height: 16, marginRight: 12 }} />
						</div>
					</div>
					<hr style={{ border: 'none', height: 1, backgroundColor: '#f3f3f3', }} />
					<div style={{ ...styles.div }}>
						<img src={Dm.getUrl_img('/img/v2/icons/a_position@2x.png')} style={{ float: 'left', width: 13, height: 17, marginTop: 14 }} />
						<span style={{ marginLeft: 12, fontSize: 14 }}>时间:</span>
						<span style={{ fontSize: 14, marginLeft: 10 }}>{this.state.isSameDay ? new Date(this.state.start_time).format("yyyy-MM-dd") : new Date(this.state.start_time).format("yyyy-MM-dd") + " ~ " + new Date(this.state.end_time).format("MM-dd")}</span>
						{/*<span style={{fontSize: 14, marginLeft: 20}}>{new Date(this.state.start_time).format("hh:mm")}-</span>*/}
						{/*<span style={{fontSize: 14}}>{new Date(this.state.end_time).format("hh:mm")}</span>*/}
					</div>
					<hr style={{ border: 'none', height: 1, backgroundColor: '#f3f3f3', marginRight: 12, }} />
					<Link to={{ pathname: `${__rootDir}/map`, hash: null, query: null, state: { map_x: this.state.map_x, map_y: this.state.map_y } }}>
						<div style={{ ...styles.address_box }}>
							<img src={Dm.getUrl_img('/img/v2/icons/a_time@2x.png')} style={{ float: 'left', width: 15, height: 15, marginTop: 2, }} />
							<div style={{ ...styles.LineClamp, ...styles.address_text, }}>地址: {this.state.city + this.state.address || '具体会场待定'}</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{ float: 'right', width: 9, height: 16, marginTop: 2 }} />
						</div>
						<div style={{ clear: 'both' }}></div>
					</Link>
				</div>
				<div style={{ border: '1px solid #e5e5e5', borderLeft: 'none', borderRight: 'none', height: 20, backgroundColor: '#f4f4f4' }}></div>
				<div style={{ ...styles.participants, height: this.state.participants.length > 1 ? 185 : 110 }}>
					<div style={{ ...styles.div, marginLeft: 12 }}>
						<img src={Dm.getUrl_img('/img/v2/icons/people_info@2x.png')} style={{ float: 'left', width: 16, height: 16, marginTop: 14 }} />
						<span style={{ marginLeft: 12, fontSize: 14 }}>参课人员</span><span style={{ fontSize: 12, color: '#999' }}>({this.state.participants.length})</span>
						{
							this.state.participants.length > 3 ?
								<Link to={{
									pathname: `${__rootDir}/Participants`, hash: null, query: null,
									state: { participants: this.state.participants, participantsByInviteeId: this.state.participantsByInviteeId, isMain: this.state.isMain }
								}}>
									<div style={{ fontSize: 14, color: '#f37633', float: 'right', marginRight: 35, }}>查看名单</div>
								</Link>
								:
								null
						}
					</div>
					{participants}
				</div>
				<div style={{ ...styles.div, backgroundColor: '#fff', paddingRight: 30 }}>
					<span style={{ float: 'right', fontSize: 14, color: '#666' }}>报名人:{this.state.enrollPerson}</span>
				</div>
				{/*participantsByInviteeId*/}
				<div style={{ border: '1px solid #e5e5e5', borderLeft: 'none', borderRight: 'none', height: 20, backgroundColor: '#f4f4f4' }}></div>
				<div style={{ ...styles.div, backgroundColor: '#fff', padding: '0 12px' }}>
					<img src={Dm.getUrl_img('/img/v2/icons/remind@2x.png')} style={{ float: 'left', width: 16, height: 18, marginTop: 14 }} />
					<span style={{ marginLeft: 12, fontSize: 14 }}>提醒</span>
					<span style={{ float: 'right', fontSize: 14, color: '#999' }}>15分钟</span>
				</div>
			</div>
		)
	}
}

var styles = {
	div: {
		height: 45,
		lineHeight: '45px',
		color: '#333',
	},
	participants: {
		width: window.screen.width,
		backgroundColor: '#ffffff',
		height: 140,
		overflow: 'hidden',

	},
	enrollPerson: {
		width: window.screen.width - 24,
		height: '45px',
		lineHeight: '45px',
		paddingLeft: 12
	},
	address_box: {
		fontSize: 14,
		color: '#333',
		padding: '20px 0 10px 0',
		marginRight: 12,
		overflow: 'hidden',
	},
	address_text: {
		float: 'left',
		height: 45,
		lineHeight: '20px',
		width: window.screen.width - 62,
		marginLeft: 12,
	},
	LineClamp: {
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
	},
	people_info: {
		fontSize: 12,
		color: '#333',
		// display:'inline-block',
		// width:(window.screen.width-24)/3,
		height: 45,
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		justiyContent: 'center',
		alignItems: 'flex-start',
	},
	box: {
		width: window.screen.width - 24,
		height: 45,
		borderBottom: 'solid 1px #f3f3f3',
		display: 'flex',
		flexDirection: 'row',
		flex: 1,
	}
}

export default PgMyEnrollDetail;
