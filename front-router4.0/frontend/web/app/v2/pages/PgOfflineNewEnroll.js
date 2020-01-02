import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'
import ResultAlert from '../components/ResultAlert'


var width = window.screen.width
var countdown;
var totalNum = 0;//剩余权益可报名的总人数
class PgOfflineNewEnroll extends React.Component {

  constructor(props) {
    super(props);
    this.focuscompanyUserList = []
    this.state={
      //是否关注
      isSearch: false,
      companyUserList:[],
      extendUsers:[],
      addCompanyUserList:[],
      focuscompanyUserList:[],
      checkNum: 0,//人数
      OfflineAut:{},
      freeNum:0,//免费席位
      authSingleCount:0,//单价
      isShowUsed:false,
      keyWord:'',
      searchValue:'搜索',
      authTotalCount:'',
      authFlag:'',
      usedNum:0,
      authUnit: false, //如True 为点数 false 次数
      authUnitStatus:'false',
      phone:'',
      email:'',

      //弹框提示信息
      alert_display:'none',
      alert_title:'',
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
      isShow:false,//是否显示弹框

      isPhone:false,
      isEmail:false,

      isAuthShow:false,//权益不足时弹出弹框
      outOfAuth:false,//是否超额，记录权益不足传给后台
      point:0,//剩余点数
      num:0,//剩余次数
      ids_array:[],//新增名单id
      remainSeats:true,//false:权益不足，true:可以报名
      msgInfo:'',//返回提示信息
      offlineNumIsFull:false,//true名额超额，false名额未超额
      title:'',//返回提示标题
      //是否付费主持卡人
      isPayed:false,
      //是否是免费课程
      isFree:false,
      authData:{}
    }

    this.currentIndex = 0;
    this.idx = 0;
    this.ids_array = [];
    this.addUserIndex = 0;
    this.addUserIdx = 0;
    this.list = [];
  }

  componentWillMount() {

console.log("componentWillMount")

    // this.timer = setTimeout(() => {
    //   Dispatcher.dispatch({
    //     actionType: 'getOfflineAuth',
    //     id: this.props.location.state.id
    //   })
    // }, 500)


  }

  _handlegetCompanyUsersDone(re){
    console.log('getCompanyUsersDone===',re);
    var result= re.result || {}
    this.setState({
      companyUserList: this.state.companyUserList.concat(result.companyUsers) || [],
      extendUsers: result.extendUsers
    },()=>{
      console.log('companyUserList==',this.state.companyUserList);
      var companyUserList = this.state.companyUserList || []
      for (var i = 0; i < companyUserList.length; i++) {
        var data = companyUserList[i].data
        var onlyData = []
        for (var t = 0; t < data.length; t++) {

          onlyData[t] = false
          this.ids_array.push(data[t].id);
        }
        this.focuscompanyUserList[i]=onlyData
      }
      if (this.focuscompanyUserList.length > 0) {
        var len = this.focuscompanyUserList[0].length
        if (this.focuscompanyUserList.length == this.state.companyUserList.length) {
          // offlineUsers[0][len] = true
          this.focuscompanyUserList = this.focuscompanyUserList
        }else {
          var data = this.state.companyUserList[0].data
          var onlyData = []
          for (var t = 0; t < data.length; t++) {

            onlyData[t] = false
            // this.ids_array.push(data[t].id);
          }
          var first = [onlyData]
          this.focuscompanyUserList = first.concat(this.focuscompanyUserList)
          this.focuscompanyUserList = this.focuscompanyUserList
        }

        this.setState({
          focuscompanyUserList: this.focuscompanyUserList,
        },()=>{
          var ids_array =[]
          // this.addUser(0,0)
          var num = 0
          var addCompanyUserList = []
          for (var i = 0; i < this.state.focuscompanyUserList.length; i++) {
            var data = this.state.focuscompanyUserList[i]
            for (var t = 0; t < data.length; t++) {
              if (data[t]) {

                if(this.state.companyUserList[i].data[t] && this.state.companyUserList[i].data[t].id){
                  ids_array.push(this.state.companyUserList[i].data[t].id)
                }else {
                  ids_array.push('')
                }


                addCompanyUserList.push(this.state.companyUserList[i].data[t])
                num = num + 1
              }
            }
          }
          if (this.state.freeNum) {//有免费名额的时候先用免费名额抵扣，扣除免费名额再扣点或者次
            num = num - this.state.freeNum
            if (num < 0) {
              num = 0
            }
          }
          this.setState({
            addCompanyUserList:addCompanyUserList,
            checkNum: num,
            usedNum: num * (this.state.authSingleCount )
          })
        })
      }else {
        this.setState({
          focuscompanyUserList: this.focuscompanyUserList,
        })
      }

    })
  }
  _handlegetOfflineAuthDone(re){
    console.log("_handlegetOfflineAuthDone");
    if (!re || re.err) {

      return false;
    }

    var result = re.result;
    if(result && result.data){

      this.setState({
        OfflineAut: result.data,
        freeNum: result.data.freeNum || 0,
        authSingleCount:result.data.authSingleCount || 0,//单价
        authTotalCount: result.data.authTotalCount || 0,
        authFlag: result.data.authFlag,
        point:result.data.point || 0,//剩余点数
        num:result.data.num || 0,//剩余次数
        remainSeats:result.data.remainSeats,
        msgInfo:re.result.msgInfo,//返回提示信息
        title:re.result.title,//返回提示标题
        offlineNumIsFull:re.result.offlineNumIsFull,
      },()=>{
        var freeNum = this.state.freeNum;//免费名额
        var authNum = 0;//剩余权益
          //remainSeats:true 可以报名，remainSeats:false 不可以报名，权益不足
        // var list = [];
        // var checkNum = 0;
        // var usedNum = 0;
        // var isShow = false;
        // var isPhone = false;
        // var isEmail = false

        if(!result.data.remainSeats){//不可以报名，权益不足
          this.focuscompanyUserList[this.addUserIndex][this.addUserIdx] = false;//取消选框
          this.setState({
            focuscompanyUserList: this.focuscompanyUserList,
            checkNum:this.state.checkNum -1,
            usedNum: (this.state.checkNum-1) * this.state.authSingleCount
          })
          }else {//有权益报名时，判断邮箱和手机号是否为空，并给出提示
            if(this.state.companyUserList[this.addUserIndex].data[this.addUserIdx].email == '' || this.state.companyUserList[this.addUserIndex].data[this.addUserIdx].email == null ){
               this.setState({
                 isShow:true,
                 isEmail:true,
                 usedNum: this.state.checkNum * this.state.authSingleCount
               })
             }
             if(this.state.companyUserList[this.addUserIndex].data[this.addUserIdx].phone == '' || this.state.companyUserList[this.addUserIndex].data[this.addUserIdx].phone == null ){
               this.setState({
                 isShow:true,
                 isPhone:true,
               })
             }
          }

          if(this.state.msgInfo){
            //pop()
            var addCompanyUserList = this.state.addCompanyUserList || []
            addCompanyUserList.pop()
            this.setState({
              isAuthShow:true,
              outOfAuth:true,
              addCompanyUserList: addCompanyUserList
            })
          }else {//勾选

          }

          if (this.state.authFlag == 5 || this.state.authFlag == 7) {//剩余点数
             this.setState({
               authUnit: true
             })
             authNum = this.state.point;
           }else if (this.state.authFlag == 6 || this.state.authFlag == 8) {//剩余次数
             this.setState({
               authUnit: false
             })
             authNum = this.state.num;
           }
           totalNum = freeNum + parseInt(authNum/this.state.authSingleCount);//免费名额+剩余点或者次除以单价 = 可选总人数
      })
    }
	}
  componentDidMount() {


    if (this.props.location.state.data) {//判断一下当前页面是不是从新增过来的
       this.list = this.list.concat(this.props.location.state.data)
      this.setState({
        companyUserList:this.list
      })
    }

    Dispatcher.dispatch({
      actionType: 'getCompanyUsers',
      resource_id: this.props.location.state.id,
    })

    Dispatcher.dispatch({
      actionType: 'getOfflineAuth',
      id: this.props.location.state.id,
      type : 'newEnroll'
    })

    EventCenter.emit("SET_TITLE",'铂略财课-线下课报名');
    //获取企业员工，用于线下课报名
    this._getgetCompanyUsersDone =EventCenter.on("getCompanyUsersDone",this._handlegetCompanyUsersDone.bind(this))
    //获取线下课报名权限
    this._OffgetOfflineAuth =EventCenter.on("getOfflineAuthNewEnrollDone",this._handlegetOfflineAuthDone.bind(this))

    }

  componentWillUnmount() {
    this._getgetCompanyUsersDone.remove()
    this._OffgetOfflineAuth.remove()
    clearInterval(countdown)
    // clearInterval(this.timer)
  }

  addUser(index,idx){
    var ids_array =[]
    this.addUserIndex=index
    this.addUserIdx = idx
    if (this.focuscompanyUserList[index][idx]) {
      this.focuscompanyUserList[index][idx]= false
    }else {
      this.focuscompanyUserList[index][idx] = true;
    }

    //本地存储选中ckeckbox状态
    // offlineUsers = this.focuscompanyUserList;

    this.setState({
      focuscompanyUserList:this.focuscompanyUserList
    },()=>{
      var num = 0;
      var temp_num=0;//中间存储变量
      var addCompanyUserList = []
      for (var i = 0; i < this.state.focuscompanyUserList.length; i++) {
        var data = this.state.focuscompanyUserList[i]
        for (var t = 0; t < data.length; t++) {
          if (data[t]) {

            if(this.state.companyUserList[i].data[t] && this.state.companyUserList[i].data[t].id){
              ids_array.push(this.state.companyUserList[i].data[t].id)
            }else {
              ids_array.push('')
            }


            addCompanyUserList.push(this.state.companyUserList[i].data[t])
            num = num + 1
            temp_num = num;
          }
        }
      }
      if (this.state.freeNum) {//有免费名额的时候先用免费名额抵扣，扣除免费名额再扣点或者次
        num = num - this.state.freeNum
        if (num < 0) {
          num = 0
        }
      }
      this.setState({
        addCompanyUserList:addCompanyUserList,
        checkNum: temp_num,
        usedNum: num * (this.state.authSingleCount)
      })
    })
    this.setState({
      ids_array: ids_array
    },()=>{
      if(this.state.authFlag !=1){
        Dispatcher.dispatch({
          actionType: 'getOfflineAuth',
          id:this.props.location.state.id,
          ids:this.state.ids_array,
        })
      }
    })
  }
  used(){
    this.setState({
      isShowUsed: true
    },()=>{
      countdown = setInterval(()=>{
          clearInterval(countdown);
          this.setState({
              isShowUsed: false
          });
      }, 1500);
    })
  }
  _check_invite(e){
    e.preventDefault();
    var v = e.target.value.trim();
    this.setState({
      keyWord: v
    })
  }
  search(){
    if (!this.state.keyWord) {
      // Dispatcher.dispatch({
      //   actionType: 'getCompanyUsers',
      //   resource_id: this.props.location.state.id,
      // })

      this.setState({
        companyUserList:this.state.companyUserList,
      })
      return false
    }
    var companyUserList = this.state.companyUserList || []
    var arr = [];
    for (var i = 0; i < companyUserList.length; i++) {
      var data = companyUserList[i].data
      var section = companyUserList[i].section
      var onlyData = []
      var onlyUser = {}
      for (var t = 0; t < data.length; t++) {
        if (data[t].name.indexOf(this.state.keyWord)>=0) {
          onlyData.push(data[t])
        }
      }
      if (onlyData.length > 0) {
        onlyUser.section = section
        onlyUser.data = onlyData
        arr.push(onlyUser)
      }
    }
    this.setState({
      companyUserList: arr
    },()=>{
      var companyUserList = this.state.companyUserList || []
      for (var i = 0; i < companyUserList.length; i++) {
        var data = companyUserList[i].data
        var onlyData = []
        for (var t = 0; t < data.length; t++) {
          onlyData[t] = false
        }
        this.focuscompanyUserList[i]=onlyData
      }
      this.setState({
        focuscompanyUserList: this.focuscompanyUserList
      })
    })
  }
  _labelScorll(re){
    if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
    }
  }

  _onChangeInput(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      phone:val,
    });
  }
  _onChangeEmail(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      email:val,
    });
  }
  _addPhone(){
    if(this.state.phone == '' || !isCellPhoneAvailable(this.state.phone)){
        this.setState({
          alert_display:'block',
          alert_title:'请输入合法的手机号',
          isShow:false,
          errStatus:0,
        },()=>{
          countdown = setInterval(()=>{
              clearInterval(countdown);
              this.setState({
                alert_display:'none',
              })
          }, 1000);
        })
        return false;
      }
      else{
        this.setState({
          isShow:false,
          isPhone:false,
        });
        this.state.companyUserList[this.addUserIndex].data[this.addUserIdx].phone = this.state.phone;
      }
   }

  _addEmail(){
    if(this.state.email == '' || !isEmailAvailable(this.state.email)){
      this.setState({
          alert_display:'block',
          alert_title:'请输入合法的邮箱',
          isShow:false,
          errStatus:0,
        },()=>{
          countdown = setInterval(()=>{
              clearInterval(countdown);
              this.setState({
                alert_display:'none',
              })
          }, 1000);
        })
        return false;
    }
    else{
      this.setState({
        isShow:false,
        isEmail:false,
      })
      this.state.companyUserList[this.addUserIndex].data[this.addUserIdx].email = this.state.email;
    }
  }

  _cancel(){
    this.setState({
      isShow:false,
      addCompanyUserList:[],
    })

    this.setState({
      isEmail:false,
    },()=>{
      this.setState({
        checkNum:this.state.checkNum - 1,
        usedNum: (this.state.checkNum-1) * this.state.authSingleCount
      })
    })

    this.setState({
      isPhone:false,
    },()=>{
      this.setState({
        checkNum:this.state.checkNum - 1,
        usedNum: (this.state.checkNum-1) * this.state.authSingleCount
      })
    })

    //取消勾选
    this.focuscompanyUserList[this.addUserIndex][this.addUserIdx] = false;
    this.setState({
      focuscompanyUserList: this.focuscompanyUserList,
    })
  }

  //关闭弹框
  _hideAlert(){
    this.setState({
      isAuthShow:false,
    },()=>{
      //取消勾选
      this.focuscompanyUserList = this.state.focuscompanyUserList
      this.focuscompanyUserList[this.addUserIndex][this.addUserIdx] = false;
      this.setState({
        focuscompanyUserList: this.focuscompanyUserList,
      })
    })
  }
  //联系客服
  _ApplyVoucher(){
    if(isWeiXin){
      this.props.history.push({pathname: `${__rootDir}/freeInvited`})
    }else {
      window.location.href='https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

  render(){
    var phoneAlert =(
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:25,fontSize:Fnt_Large,color:Common.Black}}>请输入手机号</div>
        <div>
          <input type='text' placeholder="请输入手机号" value={this.state.phone} style={styles.input_alert} onChange={this._onChangeInput.bind(this)} />
        </div>
				<div style={styles.alert_bottom}>
					<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._addPhone.bind(this)}>确定</div>
					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}}  onClick={this._cancel.bind(this)}>取消</div>
				</div>
			</div>
		)
    var emailAlert =(
      <div style={{...styles.white_alert,paddingTop:-1}}>
        <div style={{marginTop:25,fontSize:Fnt_Large,color:Common.Black}}>请输入邮箱</div>
        <div>
          <input type='text' placeholder="请输入邮箱" value={this.state.email} style={styles.input_alert} onChange={this._onChangeEmail.bind(this)} />
        </div>
        <div style={styles.alert_bottom}>
          <div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._addEmail.bind(this)}>确定</div>
          <div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}}  onClick={this._cancel.bind(this)}>取消</div>
        </div>
      </div>
    )
    //权益不足弹框
    var authAlert =(
      <div style={{display:this.state.isAuthShow ? 'block':'none' }}>
        <div style={{...styles.msk,}} onClick={this._hideAlert.bind(this)}></div>
        <div style={{...styles.white_alert,paddingTop:-1,}}>
         <div style={{paddingTop:10,fontSize:Fnt_Large,textAlign:'center',color:Common.Black}}>{this.state.title}</div>
         <div style={{ color: Common.Black,fontSize:Fnt_Normal,lineHeight:'20px',padding:'10px 12px 0 12px'}}>{this.state.msgInfo}</div>
         <div style={styles.alert_bottom}>
           <div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Activity_Text,borderRight:'solid 1px #d4d4d4',}} onClick={this._hideAlert.bind(this)}>知道了</div>
           <div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}} onClick={this._ApplyVoucher.bind(this)}>联系客服
           </div>
         </div>
       </div>
      </div>
    )

    var companyUserList = this.state.companyUserList.map((item,index)=>{
      if (!item) {
        return
      }
      var section = item.section || ''
      var data = item.data.map((it,idx)=>{
        //var focuscompanyUserList = this.state.focuscompanyUserList[index] || []

        var focuscompanyUserList = this.focuscompanyUserList[index] || [];

        // console.log('offlineUsers==',offlineUsers);

        var status = it.status || 0
        return(
          <div style={{...styles.companyUserDiv}} key={idx}>
            {
              it.status ?
              <div onClick={this.used.bind(this)}  style={{display:'flex',width:devWidth}}>
                <div style={{...styles.companyUsersInfoDiv,...styles.LineClamp,paddingLeft:12,paddingRight:5, width:83}}>
                  {it.name}
                </div>
                <div style={{...styles.companyUsersInfoDiv,...styles.LineClamp,width:130,}}>
                  {it.email}
                </div>
                <div style={{...styles.companyUsersInfoDiv,...styles.LineClamp,paddingLeft:10,width:88}}>
                  {it.phone}
                </div>
                <div style={{...styles.companyUsersInfoDiv,flex:0.5,}}>
                &nbsp;
                </div>
              </div>
              :
              <div style={{display:'flex',flex:1,width:devWidth}}>
                <div style={{...styles.companyUsersInfoDiv,color:'#333333',...styles.LineClamp,paddingLeft:12,paddingRight:5, width:83}}>
                  {it.name}
                </div>
                <div style={{...styles.companyUsersInfoDiv,color:'#333333',...styles.LineClamp,width:130,}}>
                  {it.email}
                </div>
                <div style={{...styles.companyUsersInfoDiv,color:'#333333',...styles.LineClamp,paddingLeft:10,width:88}}>
                  {it.phone}
                </div>
                <div onClick={this.addUser.bind(this,index,idx)} style={{...styles.companyUsersInfoDiv,flex:0.5,alignItems:'center'}}>
                  {focuscompanyUserList[idx] ?
                    <img src={Dm.getUrl_img('/img/v2/icons/offlineChooseed@2x.png')} width={12} height={12}/>
                    : <img src={Dm.getUrl_img('/img/v2/icons/offlineChoose@2x.png')} width={12} height={12}/>
                  }
                </div>
              </div>
            }
          </div>
        )
      })
      return(
        <div key={index}>
          {
            item.section !== '' ?
            <div style={{width:devWidth,height:20,paddingBottom:2}}>
              <span style={{fontSize:15,color:'#333333',marginLeft:12}}>{item.section}</span>
            </div>
            : ''
          }
          {data}
        </div>
      )
    })

    let alertProps ={
      alert_display:this.state.alert_display,
      alert_title:this.state.alert_title,
      isShow:this.state.isShow,
      errStatus:this.state.errStatus
    }

    return(
    <div
    onTouchEnd={() => {
      this._labelScorll(this.lessonList)
    }}
    style={{...styles.container}}>
    <ResultAlert {...alertProps}/>
    {authAlert}
    <div style={{height: devHeight, width: devWidth, backgroundColor: '#000', opacity: 0.5, position: 'absolute', zIndex: 1000,display:this.state.isShow ? 'block':'none' }} ></div>
      {this.state.isPhone ?
        phoneAlert
        :
        null
      }
      {this.state.isEmail ?
        emailAlert
        :
        null
      }
        {
          (this.state.authFlag !== 1 && this.state.authFlag !== 9 && this.state.authFlag !== 10) ?
          <div style={{...styles.freeDiv}}>
            <img style={{marginRight:10,marginLeft:15}} src={Dm.getUrl_img('/img/v2/icons/says@2x.png')} width={15} height={15}/>
              <span>
              {
                this.state.authUnit ?
                <span>
                {this.state.authFlag == 5 ?
                  <span style={{fontSize:12,color:'#ffffff'}}>
                    本课程剩余免费席位{this.state.freeNum}人，超出后价格{this.state.authSingleCount}点/人
                  </span>
                  :
                  <span style={{fontSize:12,color:'#ffffff'}}>
                    本课程价格{this.state.authSingleCount}点/人
                  </span>
                }
                </span>
                :
                <span>
                  {this.state.authFlag == 6 ?
                    <span style={{fontSize:12,color:'#ffffff'}}>
                      本课程剩余免费席位{this.state.freeNum}人，超出后价格{this.state.authSingleCount}次/人
                    </span>
                    :
                    <span style={{fontSize:12,color:'#ffffff'}}>
                      本课程价格{this.state.authSingleCount}次/人
                    </span>
                  }
                </span>
              }
              </span>
            </div>
          :
            <div style={{...styles.freeqiyeDiv}}>

              {(this.state.authFlag == 1 || this.state.authFlag ==9) ?

                <div style={{fontSize:12,color:'#666666',height:40,lineHeight:'40px',backgroundColor:'#f4f4f4'}}>  请提交本次参与员工信息，以便我们尽快联系您跟进后续报名事宜.</div>
                :
                <span>
                  {
                    this.state.authFlag ==  10 ?
                      <span style={{fontSize:12,color:'#ffffff'}}>
                        本课程剩余免费席位{this.state.freeNum}人
                      </span>
                    : null
                  }
                </span>
            }
            </div>
        }
      <div style={{...styles.top,}}>
        <div style={{...styles.input_box}}>
          <img src={Dm.getUrl_img('/img/v2/icons/searchTeacher@2x.png')} width={15} height={15}
          style={{float:'left',marginTop:7,marginLeft:13,marginRight:9,}}/>
          <input placeholder="请输入姓名" type='text' onChange={this._check_invite.bind(this)} style={{...styles.input}} value={this.state.keyWord}/>
        </div>
        <div onClick={this.search.bind(this)} style={{...styles.btn_search}}>{this.state.searchValue}</div>
        <div style={{clear:'both'}}></div>
      </div>
      <div style={{width:devWidth,height:41,backgroundColor:'#ffffff'}}>
        <Link to={{pathname: `${__rootDir}/PgOfflineAddEnroll`, query: null, hash: null, state: {authFlag:this.state.authFlag,freeNum:this.state.freeNum,authSingleCount:this.state.authSingleCount,authTotalCount:this.state.authTotalCount,authUnit:this.state.authUnit,id:this.props.location.state.id,dataList:this.list,focuscompanyUserList:this.focuscompanyUserList}}}>
          <div style={{width:130,marginLeft:(width-130)/2,}}>
            <img style={{marginRight:10,marginTop:8}} src={Dm.getUrl_img('/img/v2/icons/offlineAddEnroll@2x.png')} width={17} height={17}/>
            <span style={{fontSize:14,color:'#333333',marginTop:6}}>新增名单外报名</span>
          </div>
        </Link>
      </div>
      <div style={{...styles.content,backgroundColor:this.state.companyUserList.length > 0 ? '':'#ffffff'}} ref={(lessonList) => this.lessonList = lessonList}>
        {
          this.state.companyUserList.length > 0 ? companyUserList :
          <span style={{fontSize:12,color:'#333333',width:96,marginLeft:(width-96)/2,marginTop:15}}>未搜到该结果~</span>
        }
      </div>
      <div style={{...styles.bottomDiv}}>
        <div style={{...styles.bottomFirstDiv}}>
        {
          (this.state.authFlag !== 1 && this.state.authFlag !== 9 && this.state.authFlag !== 10) ?
            <div>
              <div style={{width:devWidth*0.63,float:'left',overflow:'auto'}}>
                <img style={{marginRight:10,}} src={Dm.getUrl_img('/img/v2/icons/unit@2x.png')} width={15} height={17} style={{float:'left',margin:'15px 8px 0 25px'}}/>
                <span style={{fontSize:14,color:'#2a2a2a'}}>
                  剩余
                  <span style={{fontSize:14,color:'#2196f3'}}>{this.state.authTotalCount}</span>{this.state.authUnit ? '点':'次'}，
                  本次应扣
                  <span style={{fontSize:14,color:'#2196f3'}}>{this.state.usedNum}</span>
                  {this.state.authUnit ? '点':'次'}
                </span>
              </div>
              <div style={{width:devWidth*0.37,float:'left',textAlign:'center',fontSize:14,color:'#333333',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',height:50}}>
                <img style={{marginRight:10,}} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18}/>
                已选<span style={{color:'red'}}>{this.state.checkNum || 0}</span>人
              </div>
            </div>
            :
            <div style={{width:devWidth,textAlign:'center',fontSize:14,color:'#333333',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',height:50}}>
              <img style={{marginRight:10,}} src={Dm.getUrl_img('/img/v2/icons/offline_people@2x.png')} width={18} height={18}/>
              已选<span style={{color:'#2196f3'}}>{this.state.checkNum || 0}</span>人
            </div>
        }
        </div>
        {
          this.state.addCompanyUserList.length > 0 ?
          <Link to={{pathname: `${__rootDir}/PgConfirmenrollment`, query: null, hash: null, state: {addCompanyUserList:this.state.addCompanyUserList,resource_id:this.props.location.state.id,outOfAuth:this.state.outOfAuth}}}>
            <div style={{width:devWidth-32,marginLeft:16,height:45,backgroundColor:'#2196f3',textAlign:'center',marginTop:11,borderRadius:'4px'}}>
              <span style={{fontSize:18,color:'#ffffff'}}>下一步</span>
            </div>
          </Link>
          :
          <div style={{width:devWidth-32,marginLeft:16,height:45,backgroundColor:'#D1D1D1',textAlign:'center',marginTop:11,borderRadius:'4px'}}>
            <span style={{fontSize:18,color:'#ffffff'}}>下一步</span>
          </div>
        }
      </div>
      <div style={{...styles.used,display:this.state.isShowUsed ? 'block' :'none'}}>
        <span style={{fontSize:14,color:'#ffffff'}}>该用户已报名~</span>
      </div>
    </div>
    )
  }
}
//PgConfirmenrollment
var styles ={
  container:{
    height:window.innerHeight,
  },
  top:{
    backgroundColor:'#fff',
    paddingTop:18,
    paddingBottom:18,
    paddingLeft:12,
    paddingRight:12,
  },
  input_box:{
    width:window.screen.width-67,
    height:30,
    borderStyle:'solid',
    borderWidth:1,
    borderColor:'#EAEAEA',
    borderRadius:15,
    float:'left',
  },
  input:{
    width:window.screen.width-120,
    height:20,
    lineHeight:'20px',
    marginTop:5,
    border:'none',
    float:'left',
    fontSize:Fnt_Small,
  },
  input2:{
    width:width-80,
    border:'none',
    height:20,
    padding:'2px',
    lineHeight:'20px',
    fontSize:12,
    color:'#333',
    textAlign:'right',
  },
  btn_search:{
    fontSize:Fnt_Normal,
    color:Common.Activity_Text,
    float:'right',
    border:'none',
    height:30,
    lineHeight:'30px',
    backgroundColor:Common.Bg_White,
  },
  content:{
    height:window.innerHeight-240,
    overflowY:'auto',
  },
  title:{
    color:'#000',
    fontSize:14,
    marginTop:30,
  },

  line:{
    width:window.screen.width-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  companyUserDiv:{
    width:devWidth,
    backgroundColor:'#ffffff',
    height:45,
    display:'flex',
    flex:1,
  },
  companyUsersInfoDiv:{
    // display:'flex',
    // flexDirection:'column',
    // flex:1,
    // justifyContent: 'center',
    height:45,
    lineHeight:'45px',
    fontSize:12,
    color:'#999999',
  },
  bottomDiv:{
    width:devWidth,
    height:114,
    backgroundColor:'#ffffff',
    position:'absolute',
    bottom:0,
    lineHeight:3
  },
  bottomFirstDiv:{
    height:50,
    width:devWidth,
    borderBottom:'solid 1px #e1e1e1',
    borderTop:'solid 1px #e1e1e1',
  },
  freeDiv:{
    width:devWidth,
    height:28,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#64BAFF',

  },
  freeqiyeDiv:{
    width:devWidth,
    height:28,
    lineHeight:1.5
  },
  used:{
    width:190,
    height:30,
    backgroundColor:'#000000',
    borderRadius:'5px',
    opacity:0.7,
    position:'absolute',
    top:254,
    zIndex:999,
    textAlign:'center',
    lineHeight:2,
    marginLeft:(width-190)/2
  },
  input_alert:{
    border:'solid 1px #d4d4d4',
    height:20,
    padding:'2px 2px 2px 5px',
    width:devWidth-167,
    marginTop:10,
    fontSize:Fnt_Normal,
    color:Common.Black,
  },
  white_alert:{
		width:devWidth-100,
		height:150,
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
  msk:{
    width: devWidth,
		height: devHeight,
		backgroundColor:'#000000',
		position:'absolute',
		zIndex: 999,
		opacity:0.2,
		top:0,
		textAlign:'center',
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    height:45,
    lineHeight:'45px'
  }
}

export default PgOfflineNewEnroll;
