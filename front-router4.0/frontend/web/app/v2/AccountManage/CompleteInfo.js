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
import Dm from '../util/DmURL'
import Common from '../Common';
import funcs from '../util/funcs'
import ResultAlert from '../components/ResultAlert'


var countdown;
var routerType = false

class CompleteInfo extends React.Component {
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
			email:'',
			position: '',
			nick_name:'',
			user:{},
			display:'none',
			context:'',
			type: '',
			photoUrl:'',
			//弹框提示信息
      alert_display:'none',
      alert_title:'',
      isShow:false,
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
		};
	}
  _onSet
	Name(e){
    e.preventDefault();
    var v = e.target.value.trim();
    this.setState({
      name: v
    })
  }
	_onChangeInputName(e){
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			name: v,
		})
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
			var postfix = postfixArr[postfixArr.length-1].toLowerCase();
			console.log('postfix',postfix);
			//若上传图片后缀不为png或jpg或上传大小大于1MB则禁止上传同时发出警告
			if(postfix !== 'png' && postfix !== 'jpg' && postfix !== 'jpeg'){//暂时先去掉|| fileSize > 3*1024*1024
					// jQuery(".err_image").css('display','inline-block');
					console.log('图片格式或者大小不合适');
					// alert('图片有问题')
					return;
			}else{
					// jQuery(".err_image").css('display','none');
					console.log('合格没有问题');
			}
			if(docObj.files && docObj.files[0])
			{
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
					Dispatcher.dispatch({
							actionType: 'updateAccountPhoto',
							file: files
					});
			}
			else
			{
			//图片异常的捕捉，防止用户修改后缀来伪造图片
			//  alert('imgObjPreview.style.display = none');
					imgObjPreview.style.display = 'none';
			}
			return true;
	}
	_onChangeUpdatePosition(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.phone && v.length > 0) {
			this.setState({
				position: v,
			})
		}else {
			this.setState({
				position: v,
			})
		}
	}
	_onChangeInputEmail(e){
			e.preventDefault();
			var v = e.target.value.trim();
			if(this.state.email && v.length>0){
				this.setState({
					email:v,
				})
			}
			else {
				this.setState({
					email:v,
				})
			}
	}

	_onChangeInputCompany(e){
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			company: v,
		})
	}

	_handleupdateAccountPhotoDone(re){


		if(re.err){
			this.setState({
        alert_display:'block',
        alert_title:re.err,
        isShow:false,
        errStatus:0,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              alert_display:'none',
            })
        }.bind(this), 1500);
      })
			return false;
		}
		if(re.result && re.result.sSuccess){
			this.setState({
				photoUrl:re.result.photo,
			})
		}

	}
	_handleupdAccountBasicInfoDone(re){

		if (re.err) {
			this.setState({
				display:'block',
				context: re.err
			})
			countdown = setInterval(function(){
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}.bind(this), 1500);
			return false;
		}

		if(re.result && routerType){
			this.props.history.push(`${__rootDir}/PgCenter`);
		}
	}
	_handlegetUserAccountDone(re){
		console.log('_handlegetUserAccountDone',re);
		if (re && re.user) {
			var user = re.user
			var name
			if (completeFlag) {
				name = completeName
			}else {
				name = user.name || ''
			}
			var company
			if(companyFlag){
				company = inputCompany;
			}else {
				company = user.company || '';
			}
			console.log('===user==',user);
			localStorage.setItem("weixinUser", JSON.stringify(user));
			this.setState({
				// user: re.user || {},
				// name: name,
			  // company: user.company || '',
				position: user.position || '',
				nick_name: user.nick_name || '',
				type: user.type || '',
				photoUrl:user.user_image,
			})
		}
	}

	_submit(){

		if(this.state.name ==''){
			this.setState({
				display:'block',
				context: '请输入姓名'
			})
			countdown = setInterval(function(){
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}.bind(this), 1500);
			return false;
		}

		// if(this.state.email){
		// 	if (!isEmailAvailable(this.state.email)){
		// 		//邮箱格式错误
		// 		this.setState({
		// 			display:'block',
		// 			context: '邮箱格式错误'
		// 		})
		// 		countdown = setInterval(function(){
		// 				clearInterval(countdown);
		// 				this.setState({
		// 						display: 'none'
		// 				});
		// 		}.bind(this), 1500);
		// 		return false;
		// 	}
		// }
		// else {
		// 	this.setState({
		// 		display:'block',
		// 		context: '请输入邮箱'
		// 	})
		// 	countdown = setInterval(function(){
		// 			clearInterval(countdown);
		// 			this.setState({
		// 					display: 'none'
		// 			});
		// 	}.bind(this), 1500);
		// 	return false;
		// }

		if(this.state.company == ''){

			this.setState({
				display:'block',
				context: '请输入公司'
			})
			countdown = setInterval(function(){
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}.bind(this), 1500);
			return false;
		}

		if(this.state.position == ''){
			this.setState({
				display:'block',
				context: '请选择职位'
			})
			countdown = setInterval(function(){
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}.bind(this), 1500);
			return false;
		}

	routerType = true
	var	_name = this.state.name || '';
	var	_email = this.state.email || '';
	var	_company = this.state.company || '';

		Dispatcher.dispatch({
			actionType: 'updAccountBasicInfo',
			name: _name,
			company: _company,
		});
	}

	componentWillMount() {
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-补全信息')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		if (completeFlag) {
			this.setState({
				name: completeName
			})
			completeFlag = false
		}

		if(companyFlag){
			this.setState({
				company:inputCompany,
			})
			companyFlag = false;
		}

		this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this))
		this._getupdAccountBasicInfoDone = EventCenter.on('updAccountBasicInfoDone', this._handleupdAccountBasicInfoDone.bind(this))
		this._getupdateAccountPhotoDone = EventCenter.on('updateAccountPhotoDone', this._handleupdateAccountPhotoDone.bind(this))
	}
	componentWillUnmount() {
		this._getUserAccountDone.remove()
		this._getupdAccountBasicInfoDone.remove()
		this._getupdateAccountPhotoDone.remove()
		completeName = this.state.name
		inputCompany = this.state.company
		clearInterval(countdown)
	}

	render(){
		var content= {
			top:100,
			context:this.state.context,
			display:this.state.display,
		}

		let alertProps ={
      alert_display:this.state.alert_display,
      alert_title:this.state.err,
      isShow:this.state.isShow,
      errStatus:this.state.errStatus
    }

		return (
			<div style={{...styles.container}}>
			<ResultAlert {...alertProps}/>
			<div style={{backgroundColor:'#fff'}}>
        <div style={{...styles.div_box,marginTop:10,}}>
          <div style={{...styles.middle}}>
            <div style={{float: 'left',fontSize:15,color:'#666666'}}><span>头像</span></div>
						<div style={{...styles.imageDiv}}>
							<img id="myImage" style={{borderRadius: 35}} src={this.state.photoUrl} height="44" width="44"/>
						</div>
						<div style={{...styles.more}}>
							<img src={Dm.getUrl_img('/img/v2/icons/more.png')}/>
						</div>
						<input id="doc" style={{...styles.imageInput}} type="file" accept="image/jpg, image/png, image/jpeg"  onChange={this._onImageChange}/>
          </div>
        </div>

				</div>
				<div style={{backgroundColor:'#fff',marginTop:15}}>
				<Link to={{pathname:`${__rootDir}/PgSetNickname`,query: null, hash: null, state:{key:'completeInfo'}}}>
	        <div style={{...styles.div_box,}}>
	          <div style={{...styles.titlediv,fontSize:15,color:'#666666'}}>昵称</div>
						<div style={{float:'right',marginRight:12,marginLeft:12}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
						<div style={{float:'right',right:26}}>
							<span style={{fontSize:12,color:'#666666',}}>{this.state.nick_name || '请输入您的昵称'}</span>
						</div>
	        </div>
				</Link>
				<div style={{...styles.div_box, }}>
					<div style={{...styles.titlediv,fontSize:15,color:'#666666'}}>姓名</div>
					<div style={{position:'absolute',right:12}}>
						<input style={{...styles.inputText}} type="text" value={this.state.name} placeholder="请输入您的姓名" onChange={this._onChangeInputName.bind(this)}/>
					</div>
				</div>
				<div style={{...styles.div_box,display:'none' }}>
					<div style={{...styles.titlediv,fontSize:15,color:'#666666'}}>邮箱</div>
					<div style={{position:'absolute',right:12}}>
						<input style={{...styles.inputText}} type="text" value={this.state.email} placeholder="请输入邮箱"  onChange={this._onChangeInputEmail.bind(this)}/>
					</div>
				</div>
				<div style={{...styles.div_box,}}>
					<div style={{...styles.titlediv,fontSize:15,color:'#666666'}}>公司</div>
					<div style={{position:'absolute',right:12}}>
						<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder="请输入您的公司"  onChange={this._onChangeInputCompany.bind(this)}/>
					</div>
				</div>
				</div>
					<Link to={{pathname:`${__rootDir}/PgPositionList`,query: null, hash: null, state:{key:'completeInfo'}}}>
						<div style={{...styles.div}}>
							<div style={{...styles.titlediv,fontSize:15,color:'#666666'}}>职位</div>
							<div style={{float:'right',marginRight:12,marginLeft:12}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
							<div style={{float:'right',right:26}}>
								<span style={{fontSize:12,color:'#666666',}}>{this.state.position || '请输入您的职位'}</span>
							</div>
						</div>
					</Link>
					<div style={{...styles.div,marginTop:20,textAlign:'center',color:Common.Activity_Text}} onClick={this._submit.bind(this)}>
							提交
					</div>
					<Link to={`${__rootDir}/PgCenter`}>
						<div style={{marginTop:20,width:window.screen.width,textAlign:'center',fontSize:14,color:'#666'}}>下次补全，跳过</div>
					</Link>
				<PromptBox {...content}/>
			</div>
		);
	}
}

var styles = {
  container:{

    height:'100%',
    width:'100%',
  },
  div:{
    height: '50px',
    width: window.screen.width-15,
		backgroundColor:'#fff',
    lineHeight:3,
		paddingLeft:15,
  },
	div_box:{
		height: '50px',
    width: window.screen.width-15,
		marginLeft:15,
		backgroundColor:'#fff',
    lineHeight:3,
		borderBottomWidth:1,
		borderBottomColor:'#f4f4f4',
		borderBottomStyle:'solid',
	},
  titlediv:{
    fontSize: 15,
    marginLeft: 12,
    float: 'left',
  },
  middle:{
    marginLeft:15,
  },
  imageDiv:{
    height: 44,
    width: 44,
    // borderRadius: 35,
    // backgroundColor:'blue',
    // marginLeft: 18,
    marginRight: 13,
    float:'left',
    marginTop:2,
    position: 'absolute',
    right: 20,
  },
	more:{
		float: 'left',
		position: 'absolute',
		right: 12,
		// marginTop: 12,
	},
  inputText:{
    textAlign:'right',
    fontSize:12,
    color:'#666666',
		width:window.screen.width-80,
    // width:'80%',
		border:0
  },
	imageInput:{
		border:0,
		position:'absolute',
		width:window.screen.width -25,
		left:12,
		top: 20,
    opacity: 0
	}
};
export default CompleteInfo;
