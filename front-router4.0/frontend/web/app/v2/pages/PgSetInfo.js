/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import PromptBox from '../components/PromptBox';
import GenderList from '../components/GenderList';
import Dm from '../util/DmURL'

var countdown;

class PgSetInfo extends React.Component {
	constructor(props) {
		super(props);
		this.wx_config_share_home = {
			title: '设置-铂略咨询',
			desc: '铂略咨询-财税领域实战培训供应商',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.state = {
			title: 'PgHome',
			name: '',
			company: '',
			position: '',
			nick_name: '',
			user: {},
			display: 'none',
			context: '',
			type: '',
			positionId: '',
			isShow: false,
			//false:不保密；true:保密
			isSecret: true,
			//设性别对外保密
			sexText: '',
			//1男性，2女性
			gender: null,
		};
	}
	_onSet
	Name(e) {
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			name: v
		})
	}
	_onChangeUpdateName(e) {
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.name && v.length > 0) {
			this.setState({
				name: v,
			})
		} else {
			this.setState({
				name: v,
			})
		}
	}
	//更换头像
	_onImageChange(e) {
		e.preventDefault();
		//定位操作位置，获取文件List
		var target = e.target;
		var files = target.files;
		//定位input
		var docObj = document.getElementById("doc");
		//拿取图片信息
		var imgObjPreview = document.getElementById("myImage");
		// var imgObjPreviewSearchBar = document.getElementById("searchImage");
		//图片内容
		var fileContent = files[0];
		var fileSize = fileContent.size;
		var fileName = fileContent.name;
		//图片后缀
		var postfixArr = fileName.split(".")
		var postfix = postfixArr[postfixArr.length - 1].toLowerCase();

		//若上传图片后缀不为png或jpg或上传大小大于1MB则禁止上传同时发出警告
		if (postfix !== 'png' && postfix !== 'jpg' && postfix !== 'jpeg') {//暂时先去掉|| fileSize > 3*1024*1024
			// jQuery(".err_image").css('display','inline-block');
			console.log('图片格式或者大小不合适');
			// alert('图片有问题')
			return;
		} else {
			// jQuery(".err_image").css('display','none');
			console.log('合格没有问题');
		}
		if (docObj.files && docObj.files[0]) {
			//火狐下，直接设img属性
			imgObjPreview.style.width = '44px';
			imgObjPreview.style.height = '44px';

			// imgObjPreviewSearchBar.style.width = '30px';
			// imgObjPreviewSearchBar.style.height = '30px';
			// imgObjPreview.src = docObj.files[0].getAsDataURL();
			//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
			//本地图片替换   关键关键关键
			imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
			// imgObjPreviewSearchBar.src = window.URL.createObjectURL(docObj.files[0]);
			console.log('files', docObj.files[0]);
			Dispatcher.dispatch({
				actionType: 'updateAccountPhoto',
				file: files
			});
		}
		else {
			//图片异常的捕捉，防止用户修改后缀来伪造图片
			//  alert('imgObjPreview.style.display = none');
			imgObjPreview.style.display = 'none';
		}
		return true;
	}
	_onChangeUpdatePosition(e) {
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.phone && v.length > 0) {
			this.setState({
				position: v,
			})
		} else {
			this.setState({
				position: '',
			})
		}
	}
	_onChangeUpdateCompany(e) {
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			company: v,
		})
	}
	_updAccountBasicInfo(re) {

		if (re == 1) {
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'updAccountBasicInfo',
				name: this.state.name,
			})
		} else if (re == 2) {
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'updAccountBasicInfo',
				company: this.state.company,
			})
		}
	}
	_handleupdateAccountPhotoDone(re) {
	}
	_handleupdAccountBasicInfoDone(re) {
		if (re.err) {
			this.setState({
				display: 'block',
				context: re.err
			})
			countdown = setInterval(()=> {
				clearInterval(countdown);
				this.setState({
					display: 'none'
				});
			}, 1500);
			return false;
		}
		if (re && re.user) {
			// var user = re.user || {}
			// if (user.isSuccess) {
			// 	this.setState({
			// 		display:'block',
			// 		context: '修改成功'
			// 	})
			// 	countdown = setInterval(function(){
			// 		clearInterval(countdown);
			// 		this.setState({
			// 				display: 'none'
			// 		});
			// 		// window.history.back()
			// 	}.bind(this), 1500);
			// 	return false;
			// }
		}
	}
	_handlegetUserAccountDone(re) {
		// alert('_handlegetUserAccountDone')
		console.log('_handlegetUserAccountDone', re);
		if (re && re.user) {
			var user = re.user
			localStorage.setItem("weixinUser", JSON.stringify(user));
			this.setState({
				user: re.user || {},
				name: user.name || '',
				company: user.company || '',
				position: user.position || '',
				nick_name: user.nick_name || '',
				type: user.type || '',
				positionId: user.positionId,
				gender: re.user && re.user.gender ? re.user.gender : null,
				isSecret: re.user.genderSecrecy,
				sexText: re.user.genderSecrecy ? '(性别对外保密)' : ''
			})
		}
	}
	componentWillMount() {
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-个人资料')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this))
		this._getupdAccountBasicInfoDone = EventCenter.on('updAccountBasicInfoDone', this._handleupdAccountBasicInfoDone.bind(this))
		this._getupdateAccountPhotoDone = EventCenter.on('updateAccountPhotoDone', this._handleupdateAccountPhotoDone.bind(this))

	}
	componentWillUnmount() {
		this._getUserAccountDone.remove()
		this._getupdAccountBasicInfoDone.remove()
		this._getupdateAccountPhotoDone.remove()
	}
	// _goPosition(re){
	// 	this.props.history.push({
	// 	  pathname: '/PgPositionList',
	// 	  query: { modal: true },
	// 	  state: { fromDashboard: true }
	// 	})
	//
	// }

	//关闭性别列表弹框
	_hideAlert() {
		this.setState({
			isShow: false
		})
	}

	//显示性别列表
	_choiceGender() {
		this.setState({
			isShow: true,
		})
	}

	//确定
	_confirm(re) {
		var { genderType, isSecret } = re;
		var _sex = '';

		if (isSecret) {
			_sex = '(性别对外保密)'
		}
		this.setState({
			gender: genderType,
			sexText: _sex,
			isShow: false,
			isSecret: isSecret,
		}, () => {
			//修改性别是否保密
			var _genderSecrecy;
			if (this.state.isSecret) {
				_genderSecrecy = 1;
			}
			else {
				_genderSecrecy = 0;
			}
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'updAccountBasicInfo',
				gender: this.state.gender,
				genderSecrecy: _genderSecrecy,
			})
		})
	}

	//性别是否保密
	_set(isSecret) {
		this.setState({
			isSecret: isSecret,
		})
	}

	render() {
		var content = {
			top: 100,
			context: this.state.context,
			display: this.state.display,
		}

		var _gender = '';
		if (this.state.gender == 1) {
			_gender = '男'
		}
		else if (this.state.gender == 2) {
			_gender = '女'
		}



		return (
			<div style={{ ...styles.container }}>
				<div style={{ backgroundColor: '#fff' }}>
					<div style={{ ...styles.div_box, marginTop: 17 }}>
						<div style={{ ...styles.middle }}>
							<div style={{ ...styles.titlediv, float: 'left', }}><span>头像</span></div>
							<div style={{ ...styles.imageDiv }}>
								<img id="myImage" style={{ borderRadius: 35 }} src={this.state.user.user_image} height="44" width="44" />
							</div>
							<div style={{ ...styles.more }}>
								<img src={Dm.getUrl_img('/img/v2/icons/more.png')} />
							</div>
							<input id="doc" style={{ ...styles.imageInput }} type="file" accept="image/jpg, image/png, image/jpeg" onChange={this._onImageChange} />
						</div>
					</div>
				</div>
				<div style={{ backgroundColor: '#fff' }}>
					<Link to={`${__rootDir}/PgSetNickname`}>
						<div style={{ ...styles.div_box, marginTop: 15 }}>
							<div style={{ ...styles.titlediv, }}>昵称</div>
							<div style={styles.rightText}>
								<img src={Dm.getUrl_img('/img/v2/icons/more.png')} width={8} height={14} />
							</div>
							<div style={{ float: 'right', right: 26 }}>
								<span style={{ fontSize: 14, color: '#666666', }}>{this.state.nick_name || '请输入您的昵称'}</span>
							</div>
						</div>
					</Link>
					{
						this.state.type == 1 ?
							<div style={{ ...styles.div_box, }}>
								<div style={{ ...styles.titlediv, }}>姓名</div>
								<div style={{ position: 'absolute', right: 39 }}>
									<span style={{ fontSize: 14, color: '#333' }}>{this.state.name}</span>
								</div>
							</div>
							:
							<div style={{ ...styles.div_box, }}>
								<div style={{ ...styles.titlediv, color: '#666666' }}>姓名</div>
								<div style={{ position: 'absolute', right: 39 }}>
									<input style={{ ...styles.inputText }} type="text" value={this.state.name} placeholder="请输入您的姓名" onBlur={this._updAccountBasicInfo.bind(this, 1)} onChange={this._onChangeUpdateName.bind(this)} />
								</div>
							</div>
					}

					<div style={{ ...styles.div_box }} onClick={this._choiceGender.bind(this)}>
						<div style={{ ...styles.titlediv, }}>性别</div>
						<div style={{ ...styles.rightText }}>
							<img src={Dm.getUrl_img('/img/v2/icons/more.png')} width={8} height={14} />
						</div>
						<div style={{ float: 'right', fontSize: 14, color: 'rgb(153, 153, 153)', marginTop: 5 }}>
							{_gender ?
								<div>
									<span style={{ color: '#333' }}>{_gender}</span>
									<span style={{ marginLeft: 10, display: this.state.sexText ? 'inline' : 'none' }}>{this.state.sexText}</span>
								</div>
								:
								<div>请选择性别</div>
							}
						</div>
					</div>

					{
						this.state.type == 1 ?
							<div style={{ ...styles.div_box, }}>
								<div style={{ ...styles.titlediv, }}>公司</div>
								<div style={{ position: 'absolute', right: 39 }}>
									{this.state.company ?
										<span style={{ fontSize: 14, color: '#333' }}>{this.state.company}</span>
										:
										<input style={{ ...styles.inputText }} type="text" value={this.state.company} placeholder="请输入您的公司" onBlur={this._updAccountBasicInfo.bind(this, 2)} onChange={this._onChangeUpdateCompany.bind(this)} />
									}
								</div>
							</div>
							:
							<div style={{ ...styles.div_box, }}>
								<div style={{ ...styles.titlediv, }}>公司</div>
								<div style={{ position: 'absolute', right: 39 }}>
									<input style={{ ...styles.inputText }} type="text" value={this.state.company} placeholder="请输入您的公司" onBlur={this._updAccountBasicInfo.bind(this, 2)} onChange={this._onChangeUpdateCompany.bind(this)} />
								</div>
							</div>
					}
				</div>
				{
					this.state.type == 1 && (this.state.position || this.state.positionId !== null) ?
						<div style={{ ...styles.div }}>
							<div style={{ ...styles.titlediv, }}>职位</div>
							{/* <div style={styles.rightText}>
								<img src={Dm.getUrl_img('/img/v2/icons/more.png')} />
							</div> */}
							<div style={{ float: 'right', marginRight: 39 }}>
								{this.state.position ?
									<span style={{ fontSize:14,color:'#333' }}>
										{this.state.position}
									</span>
									:
									<span style={{ fontSize: 14, color: '#999999', }}>
										{'请输入您的职位'}
									</span>
								}

							</div>
						</div>
						:
						<Link to={{ pathname: `${__rootDir}/PgPositionList`, query: null, hash: null, state: { key: 'personal' } }}>
							<div style={{ ...styles.div }}>
								<div style={{ ...styles.titlediv, fontSize: 15, color: '#666666' }}>职位</div>
								<div style={styles.rightText}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
								<div style={{ float: 'right' }}>
									{this.state.position ?
										<span style={{ fontSize: 14,color:'#333' }}>{this.state.position}</span>
										:
										<span style={{ fontSize: 14, color: '#999', }}>{'请输入您的职位'}</span>
									}
								</div>
							</div>
						</Link>
				}
				<div style={{ ...styles.mask, display: this.state.isShow ? 'block' : 'none' }} onClick={this._hideAlert.bind(this)}></div>
				<GenderList
					isShow={this.state.isShow}
					gender={this.state.gender}
					isSecret={this.state.isSecret}
					confirm={this._confirm.bind(this)}
					set={this._set.bind(this)}
				/>
				<PromptBox {...content} />
			</div>
		);
	}
}
PgSetInfo.propTypes = {

};
PgSetInfo.defaultProps = {

};
var styles = {
	container: {

		height: '100%',
		width: '100%',
	},
	div: {
		height: '50px',
		width: window.screen.width - 15,
		backgroundColor: '#fff',
		lineHeight: 3,
		paddingLeft: 15,
	},
	div_box: {
		height: '50px',
		width: window.screen.width - 15,
		marginLeft: 15,
		backgroundColor: '#fff',
		lineHeight: 3,
		borderBottomWidth: 1,
		borderBottomColor: '#f4f4f4',
		borderBottomStyle: 'solid',
	},
	titlediv: {
		fontSize: 14,
		color: '#333',
		float: 'left',
	},
	middle: {
		// marginLeft: 15,
	},
	imageDiv: {
		height: 44,
		width: 44,
		// borderRadius: 35,
		// backgroundColor:'blue',
		// marginLeft: 18,
		marginRight: 13,
		float: 'left',
		marginTop: 2,
		position: 'absolute',
		right: 20,
	},
	more: {
		position: 'absolute',
		right: 16,
		top: 20,
	},
	inputText: {
		textAlign: 'right',
		fontSize: 14,
		color: '#333',
		width: window.screen.width - 90,
		height: 20,
		lineHeight: '18px',
		border: 0
	},
	imageInput: {
		border: 0,
		position: 'absolute',
		width: window.screen.width - 25,
		left: 12,
		top: 20,
		opacity: 0
	},
	mask: {
		width: window.screen.width,
		height: window.innerHeight,
		backgroundColor: '#000',
		opacity: 0.4,
		position: 'absolute',
		left: 0,
		top: 0,
		zIndex: 90
	},
	rightText: {
		float: 'right',
		marginRight: 16,
		marginLeft: 15,
		marginTop: 3
	}
};
export default PgSetInfo;
