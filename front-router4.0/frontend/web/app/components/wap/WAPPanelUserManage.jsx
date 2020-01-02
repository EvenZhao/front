var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var WapStore = require('../../stores/WapStore');
var ActionTypes = WapStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');

var testnick_name = /^.{0,12}$/g;
var testname = /^.{0,12}$/g;
var testposition = /^.{0,20}$/g;
var testcompany = /^.{0,20}$/g;

var WAPPanelUserManage = React.createClass({
    propTypes: {
        //data数据为userinfo内个人数据
       data : React.PropTypes.object,
        //log数据为login内登录状态
       login: React.PropTypes.object
    },
    getInitialState: function(){
        //用户数据
        var use = this.props.data;
        //登录状态
        // var login = this.props.login;
        return ({
            // files: use.user_image,
            logout: false,
            nick_name: use.nick_name,
            valid_nick_name: true,
            name: use.name,
            valid_name: true,
            company: use.company,
            valid_company: true,
            position: use.position,
            valid_position: true,
            err_message: ''
        });
    },

    //更换头像
    _onImageChange: function (e) {
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
        var postfix = fileName.split(".")[1].toLowerCase();
        console.log('postfix',postfix);
        //若上传图片后缀不为png或jpg或上传大小大于1MB则禁止上传同时发出警告
        if(postfix !== 'png' && postfix !== 'jpg' && postfix !== 'jpeg' || fileSize > 3*1024*1024){
            jQuery(".err_image").css('display','inline-block');
            return;
        }else{
            jQuery(".err_image").css('display','none');
        }
        if(docObj.files && docObj.files[0])
        {
            //火狐下，直接设img属性
            imgObjPreview.style.width = '70px';
            imgObjPreview.style.height = '70px';

            // imgObjPreviewSearchBar.style.width = '30px';
            // imgObjPreviewSearchBar.style.height = '30px';
            // imgObjPreview.src = docObj.files[0].getAsDataURL();
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            //本地图片替换   关键关键关键
            // imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            // imgObjPreviewSearchBar.src = window.URL.createObjectURL(docObj.files[0]);
            Dispatcher.dispatch({
                actionType: WapStore.ActionTypes.CHANGE_USERIMAGE,
                files: files
            });
        }
        else
        {
        //图片异常的捕捉，防止用户修改后缀来伪造图片
            imgObjPreview.style.display = 'none';
        }
        return true;
    },

    //昵称
    _onNickNameChange: function(e){
        e.preventDefault();
        //定位input框中的值
        var v = e.target.value;
        this.setState({
            nick_name: v,
            valid_nick_name: v.length === 0 || v.search(testnick_name) > -1
        }, function(){
            //若输入值为空则警告
            if (this.state.nick_name === ''){
                jQuery(".err_content").css('display','inline-block');
            //重新输入内容提示消失
            }else{
                jQuery(".err_content").css('display','none');
            }
        });
    },
    //姓名
    _onNameChange: function(e){
        e.preventDefault();
        //定位input框中的值
        var v = e.target.value;
        this.setState({
            name: v,
            valid_name: v.length === 0 || v.search(testname) > -1
        }, function(){
            //若输入值为空则警告
            if (this.state.name === ''){
                jQuery(".err_content").css('display','inline-block');
            //重新输入内容提示消失
            }else{
                jQuery(".err_content").css('display','none');
            }
        });
        // }
    },
    //公司
    _onCompanyChange: function(e){
        e.preventDefault();
        //定位input框中的值
        var v = e.target.value;
        this.setState({
            company: v,
            valid_company: v.length === 0 || v.search(testcompany) > -1
        }, function(){
            //若输入值为空则警告
            if (this.state.company === ''){
                jQuery(".err_content").css('display','inline-block');
            //重新输入内容提示消失
            }else{
                jQuery(".err_content").css('display','none');
            }
        });
    },
    //职业
    _onPositionChange: function(e){
        e.preventDefault();
        //定位input框中的值
        var v = e.target.value;
        this.setState({
            position: v,
            valid_position: v.length === 0 || v.search(testposition) > -1
        }, function(){
            //若输入值为空则警告
            if (this.state.position === ''){
                jQuery(".err_content").css('display','inline-block');
            //重新输入内容提示消失
            }else{
                jQuery(".err_content").css('display','none');
            }
        });
    },
    //跳转修改密码页面
    _onChangePassword: function(e){
        //查询是否登录状态
        var user = this.props.login || [];
            console.log('user.is_logined',user.is_logined);
            //登录即跳转密码修改页面
            if (user && user.is_logined) {
                console.log('已经在登陆状态，需要进入会员中心');
                Dispatcher.dispatch({
                    actionType: ActionTypes.GET_PASSWORD
                });
            //否则返回登录页面
            }
            // else{
            //     console.log('_userCenter');
            //     WapStore.emit(Events.WAP_UNLOGIN_DONE);
            // }
    },
    //提交用户信息更改内容
    _onENROLL: function(e){
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.CHANGE_USERINFO,
                nick_name: this.state.nick_name,
                name: this.state.name,
                company: this.state.company,
                position: this.state.position
        });
    },
    //个人信息为空，取消焦点警告移除
    _onBlurMessage: function(e){
        e.preventDefault();
        if(this.state.nick_name === '' || this.state.name === '' || this.state.company === '' || this.state.position === ''){
            jQuery(".err_content").css('display','none');
            // this._onNoneMessage();
        }
    },
    //注销
    _onLogOut: function(){
        window.location.hash = 'LOG_OUT';
        localStorage.removeItem('user');
        localStorage.removeItem('user_image');
        this.setState({logout: true}, function(){
            Dispatcher.dispatch({
                actionType: WapStore.ActionTypes.LOG_OUT
            });
        })
    },
    //点击箭头响应input type='file'
    _onClick: function(e){
        // e.preventDefault();
        var file = document.getElementById('doc');
        file.click();
        jQuery('.err_content').css('display','none');
    },
    //当得到个人信息焦点时，图片错误警告移除
    _onChangeMessage: function(e){
        jQuery('.err_image').css('display','none');
    },
    // _onNoneMessage: function(){
    //     if(this.state.nick_name === ''){
    //         $("#nick_name").val(this.props.data.nick_name);
    //     }else if(this.state.name === ''){
    //         $("#name").val(this.props.data.name);
    //     }else if(this.state.company === ''){
    //         $("#company").val(this.props.data.company);
    //     }else if(this.state.position === ''){
    //         $("#position").val(this.props.data.position);
    //     }
    // },
    componentDidMount: function() {
        console.log('did mount');
    },
    componentWillUnmount: function() {
        if(!this.state.logout) this._onENROLL();
    },
    render: function(){
        return (
            <div className="wap-user-manage">
                    <div className="err_image alert-danger" role="alert">上传失败,图片格式仅支持png与jpg且大小不可超过3MB</div>
                    <div className="err_content alert-danger" role="alert">更新失败,您的个人信息不能为空</div>
                <div className="wap-manage-second">
                    <div className="img-div" onClick={this._onClick}>
                        <input type="file" id="doc" className='userinfo-input' accept="image/jpg, image/png, image/jpeg" ref="fileInput" onChange={this._onImageChange}/>
                        <img className="user-img" id="myImage" ref="user_image" src={this.props.data.user_image}/>
                        <span className="nickname-span">修改头像</span>
                        <span className="exit-user-img" ><img src="../img/more_list.png" height="18px" width="14px"/></span>
                        <div className="button-div"></div>
                    </div>
                        <div>昵称<input id="nick_name" className='userinfo-span' ref='nick_name' value={this.state.nick_name} onBlur={this._onBlurMessage} onFocus={this._onChangeMessage} onChange={this._onNickNameChange}/></div>
                        <div>姓名<input id="name" className="userinfo-span" ref='name' value={this.state.name} onBlur={this._onBlurMessage} onFocus={this._onChangeMessage} onChange={this._onNameChange}/></div>
                        <div>公司<input id="company" className="userinfo-span" ref='company' value={this.state.company} onBlur={this._onBlurMessage} onFocus={this._onChangeMessage} onChange={this._onCompanyChange}/></div>
                        <div>职位<input id="position" className="userinfo-span" ref='position' value={this.state.position} onBlur={this._onBlurMessage} onFocus={this._onChangeMessage} onChange={this._onPositionChange}/></div>
                        </div>
                <div className="wap-manage-thrid" onClick={this._onChangePassword}>
                    <span>修改密码</span>
                    <span className="exit-user-img"><a onClick={this._onChangePassword}><img src="../img/more_list.png" height="18px" width="14px"/></a></span>
                    <div  className="button-div"></div>
                </div>
                <div className="logout">
                    <button type="button" onClick={this._onLogOut} className="btn btn-danger">注销</button>
                </div>
            </div>
        );
    }
});
module.exports = WAPPanelUserManage;
