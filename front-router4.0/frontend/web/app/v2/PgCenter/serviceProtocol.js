import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';




class serviceProtocol extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      taskTab: true,

		};

	}


  componentWillMount() {

  }

	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-法律协议');

	}
	componentWillUnmount() {
	}
  taskTab(e){
    this.setState({
        taskTab: (e == 1) ? true : false,
    })
  }
	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{...styles.taskTab}}>
          <div style={{...styles.tabDiv}} onClick={this.taskTab.bind(this,1)}>
            <span style={{fontSize:14,color: this.state.taskTab ? '#1FB6C4':'#000000'}}>版权声明</span>
            {
              this.state.taskTab ?
                <div style={{...styles.tabLine}}></div>
                : null
            }
          </div>
          <div style={{...styles.tabDiv}} onClick={this.taskTab.bind(this,2)}>
            <span style={{fontSize:14,color: !this.state.taskTab ? '#1FB6C4':'#000000'}}>服务协议</span>
            {
              !this.state.taskTab ?
                <div style={{...styles.tabLine}}></div>
                : null
            }
          </div>
        </div>
        <div style={{...styles.textDiv,display: this.state.taskTab ? 'block':'none'}}>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:16,color:'#333'}}>
              衷心感谢您关注和支持铂略，如果您需要转载铂略企业管理咨询(上海)有限公司（以下称“铂略”）的视频、资料、新 闻与资讯等内容信息,请仔细阅读本版权声明：
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              1.铂略对所提供的教学视频、教学成果、服务及本服务所使用的软件、资料、源代码等均受知识产权法或其他法律保护的资料享有相应的权利，包括但不限于受到著作权法及其实施细则、商标法及其实施细则、专利法及其实施细则或其他法律的保护
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              2.本网（www.bolue.cn）提供的内容，铂略拥有版权或有权使用，包括但不限于全部的视频文件、文字、图像、声音文件、源代码、网站设计等。未经铂略授权许可，用户不得进行传播（包括转载、转贴等）、修改、出租、散布或演绎衍生其他作品，任何组织或个人不得复制或在非铂略所属的服务器上做镜像。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              3.铂略VI标识、设计以及产品及服务名称等，均为铂略所享有，只用于铂略及经许可的授权合作机构。非经授权，任何人不得使用、复制或作其他用途。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              4.与为用户提供评论和提问等服务时，对于本版内用户所发布的内容所引发的有关版权、著作权等知识产权的异议、纠纷及诉讼不承担任何责任。提交者发言纯属个人行为，与立场无关。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              5.本网所有内容，所有文字、图片和音频、视频资料，铂略拥有版权或有权使用。任何媒体、网站或个人未经本网协议书面授权，不得转载、链接、转贴或以其他方式复制发布或发表。已经本网协议授权的媒体、网站，在下载使用时必须注明”“稿件来源：铂略财务培训"”，违者本网将依法追究责任。非铂略来源的文/图等稿件，本网转载出于传递更多信息之目的，并不意味着赞同其观点或证实其内容的真实性。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              6.除注明来源为“铂略”的内容外，本网以下内容亦不可在未经同意的情况下转载：
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              1)本网所指向的非本网内容的相关链接内容；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              2)作出不得转载或未经许可不得转载声明的内容；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              3)本网中特有的图形、标志、页面风格、编排方式、程序等；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              4)本网中必须具有特别授权或具有注册用户资格方可知晓的内容；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              5)其他法律不允许或本网认为不适合转载的内容。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              7.转载或引用本网内容必须是以新闻性为使用目的的合理、善意引用，不得对本网内容原意进行曲解、修改，同时必须保留本网注明的“稿件来源：铂略财务培训”，并自负版权等法律责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              8.转载或引用本网内容不得进行如下活动：
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              1)损害本网或他人利益；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              2)任何违法行为；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              3)任何可能破坏公秩良俗的行为；
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              4)擅自同意他人继续转载、引用本网内容；
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              9.转载或引用本网版权所有之内容须注明“转自（或引自）铂略财务培训”字样。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              10.转载或引用本网中的署名文章用于商业行为的，请按规定向作者支付稿酬。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              11.对于不当转载或引用本网内容而引起的民事纷争、行政处理或其他损失，本网不承担责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#666'}}>
              12.对不遵守本声明或其他违法、恶意使用本网内容者，本网将依法追究其法律责任的权利。本网授权版权律师负责处理本网的一切版权事务。
            </span>
          </div>
          <div style={{...styles.fontDiv,marginBottom:36}}>
            <span style={{fontSize:14,color:'#666'}}>
              13.本版权声明的解释权归铂略。
            </span>
          </div>
        </div>
        <div style={{...styles.textDiv,display: !this.state.taskTab ? 'block':'none'}}>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              本用户协议双方为铂略咨询（www.bolue.cn）所有者铂略企业管理咨询(上海)有限公司（以下简称“铂略咨询”）与铂略咨询的注册用户及学员（以下简称“学员”），本协议具有合同效力。本用户协议内容包括协议正文及所有铂略咨询已经发布的或将来可能发布的各类规则，所有规则为协议不可分割的一部分，与协议正文具有同等法律效力。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              一、铂略咨询服务条款的确认和接受
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              铂略咨询的各项网络服务的所有权、运作权归铂略咨询所有。铂略咨询提供的服务将完全按照其发布的章程、服务条款和操作规则执行。只要学员点击协议正本下方的“确认”按钮并按照铂略咨询在线注册程序成功注册为铂略咨询学员，学员的行为即表示其在注册之前认真阅读了本用户协议，同意并签署了本用户协议。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              二、学员的账号，密码和安全性
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              学员务必确保注册用户名及密码的安全性。如果丢失，造成的损失将由本人承担全部后果。学员对利用该用户名及密码所进行的一切课程负全部责任；因此所衍生的任何损失或损害，铂略咨询不承担任何责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              学员不得将账号借予他人或多人共同使用一个账号。如果发现或者有正当的理由怀疑多人共用一个帐号的现象，铂略咨询保留结束或终止该账号的权利。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              铂略咨询不对学员所发布信息的删除或储存失败负责。铂略咨询有判定学员的行为是否符合铂略咨询服务条款的要求的保留权利，如果学员违背了服务条款的规定，铂略咨询有中断对其提供网络服务的权利。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              三、铂略咨询的权利和义务
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              铂略咨询有义务在现有技术上维护整个在线平台的正常运行，并努力提升和改进技术，使学员的网络教育课程得以顺利进行。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              铂略咨询提供的网络服务内容包括：文字、软件、声音、图片、录像、图表、邮件及广告中的全部内容，铂略咨询拥有以上内容的完全版权，严禁任何个人或单位在未经铂略咨询许可的情况下对这些内容进行翻版、复制、转载、篡改等一切用于商业课程的行为。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              对于学员在铂略咨询平台上的不当行为或其它任何铂略咨询认为应当终止服务的情况，铂略咨询有权随时作出删除相关信息、终止服务提供等处理，而无须征得学员的同意；铂略咨询应本着诚实信用的原则向学员提供远程教育服务，不得随意中断或停止提供该项服务。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              四、开始、结束服务
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              学员注册完成后，享受铂略咨询提供的各类咨询、信息查询、试听等多重免费服务。如需使用铂略咨询的其他网络课程，付费经确认后，铂略咨询会开通相应的服务权限（服务权限是指学员享受所购买服务的资格）。具体服务内容开通的时间和进度以网站的最新公告或课件更新记录为准。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              结束服务后，学员使用相应服务权限的权利马上终止。从那时起，学员没有权利，铂略咨询也没有义务传送任何未处理的信息或未完成的服务给学员或第三方。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              五、关于网络课程的说明
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              1、铂略咨询所有产品一经购买（包括网上注册、邮局汇款、银行电汇、报名点缴费等各种购买方式），都不允许任何形式的退换。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              2、学员缴费为铂略咨询在线网络课堂的教育信息费，不包含学员的上网电话费、上网信息费等。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              3、如果学员选择的账户类型是畅享卡形式，那么学员可以在账户有效期间无限制的访问账户对应的课程内容。如果学员选择的账户类型是充值卡形式，当学员使用铂略咨询提供的账号和密码登录注册后，网络课程中的金额将自动注入学员账号。转入学员账号中的金额仅能作为在铂略咨询在线网络课堂中听课使用，不找零，不兑换现金或其他产品和服务。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              4、所有类型的网络课程账号都有截止登录时间，学员应在指定日期前登录并学习。如果学员没有在最后期限之前登录网络课程，账号权限将作自动作废处理，学员自己应对此承担全部责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              六、学员承担的责任
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              1、铂略咨询所有学员需自备上网所需要的设备，自行承担上网产生的各项费用。使用自己的电脑能够顺利地接入国际互联网，并能访问本网站主页。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              2、学员需提供详尽、准确的个人资料并及时更新。若学员提供任何错误、不实、过时或不完整的资料为铂略咨询所知，或者铂略咨询有合理理由怀疑资料为错误、不实、过时或不完整，铂略咨询保留结束或终止其注册学员资格的权利。铂略咨询承诺不对外透露学员信息，除以下情况外：
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
            （1）学员授权铂略咨询透露这些信息。
            </span>
          </div>
          <div style={{...styles.fontSecontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
            （2）相应的法律及程序要求铂略咨询提供学员的个人资料。如果学员提供的资料包含有不正确的信息，铂略咨询保留结束学员使用网络服务资格的权利。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              3、学员必须遵守中华人民共和国的法律、法规、规章、条例、以及其他具有法律效力的规范，不使用网络服务做任何非法用途。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              4、不得干扰或混乱网络服务。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
                5、不得侵犯铂略咨询所有著作权、版权。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
            6、不得将广告、促销资料等，通过上载、张贴、发送电子邮件或以其他方式传送，供前述目的使用的专用区域除外。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              7、不得在铂略咨询内发布违法信息，用户对其发布的内容单独承担法律责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              8、严禁发表、散布、传播任何反动、色情及违反国家安全、扰乱社会秩序等有害信息，学员需对自己在网上的行为承担法律责任。学员若在铂略咨询上散布和传播反动、色情或其他违反国家法律的信息，铂略咨询的系统记录将作为学员违反法律的证据
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              七、免责条款
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              1、铂略咨询不保证（包括但不限于）：（1）服务不受干扰，及时、安全、可靠或不出现任何错误；（2）用户经由本服务取得的任何产品、服务或其他材料符合用户的期望。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              2、学员使用经由铂略咨询服务下载或取得的任何资料，其风险自行负担。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              3、由于地震、台风、洪水、火灾、战争、政府禁令以及其他不能预见并且对其发生和后果不能防止或避免的不可抗力或互联网上的黑客攻击事件，致使影响铂略咨询服务履行的，铂略咨询不承担责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              4、当铂略咨询以链接形式推荐其他网站内容时，由于铂略咨询并不控制相关网站和资源，因此访问者需理解并同意，铂略咨询并不对这些网站或资源的可用性负责，且不保证从这些网站获取的任何内容、产品、服务或其他材料的真实性、合法性，对于任何因使用或信赖从此类网站或资源上获取的内容、产品、服务或其他材料而造成（或声称造成）的任何直接或间接损失，铂略咨询均不承担任何责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              5、任何由于黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的个人资料泄露、丢失、被盗用、被窜改或不能正常看课等，铂略咨询均得免责。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              6、铂略咨询如因系统维护或升级而需暂停服务时，将事先公告。若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，铂略咨询不负任何责任。
            </span>
          </div>
          <div style={{...styles.fontDiv}}>
            <span style={{fontSize:14,color:'#333'}}>
              7、铂略咨询使用者因违反本声明的规定而触犯中华人民共和国法律的，一切后果自己负责，本网站不承担任何责任。
            </span>
          </div>
          <div style={{...styles.fontDiv,marginBottom:36}}>
            <span style={{fontSize:14,color:'#333'}}>
              本用户协议根据现行中华人民共和国法律法规制定。如发生协议条款与中华人民共和国法律法规相抵触时，则这些条款将完全按法律法规的规定重新解释，本用户协议的其它条款仍对铂略咨询和学员具有法律约束力。
            </span>
          </div>
        </div>
			</div>
    )
  }
}
/**
<div style={{...styles.fontDiv}}>
  <span style={{fontSize:14,color:'#333'}}>

  </span>
</div>
*/
var styles = {
  div:{
    width:devWidth,
    height: devHeight,
    backgroundColor:'#FFFFFF'
  },
  taskTab:{
    // display: 'flex',
    height: 46,
    backgroundColor:'#FFFFFF',
    position:'relative',
    borderBottomWidth:1,
    borderBottomColor:'#D8D8D8',
    borderBottomStyle:'solid',
	// 	display: '-webkit-box', /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
	// 	display: '-moz-box',/* Firefox 17- */
	// 	display: '-webkit-flex', /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
	// 	display: '-moz-flex', /* Firefox 18+ */
	// 	display: '-ms-flexbox', /* IE 10 */
	// 	display: 'flex', /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
  },
  tabDiv:{
    // flex: 1,
		float:'left',
    // justifyContent: 'center',
    alignItems:'center',
    width: devWidth/2,
    textAlign:'center',
    marginTop: 13,
		// '-webkit-box-flex': 1;
		// -ms-flex: 1;
		// flex: 1;
		// display: block;
  },
  tabLine:{
    width:80,
    height:1,
    backgroundColor:'#1FB6C4',
    marginLeft: (devWidth/2 - 80)/2,
    position:'absolute',
    top: 45
  },
  textDiv:{
    height:devHeight-46,
    width: devWidth,
    overflowX:'hidden',
    overflowY:'scroll',
  },
  fontDiv:{
    width:devWidth-24,
    marginLeft: 12,
    marginTop: 12
  },
  fontSecontDiv:{
    width:devWidth-48,
    marginLeft: 24,
    marginTop: 8
  }
}

export default serviceProtocol;
