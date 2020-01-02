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

class PgPositionList extends React.Component {
	constructor(props) {
	    super(props);
		this.weixinUser = JSON.parse(localStorage.getItem("weixinUser"));
		this.state = {
			title: 'PgHome',
			positionList: [],
			listChangeNum: this.weixinUser.position_id || ''
  		};

			this.key = this.props.location.state.key;
	}
	_handlegetPositionDone(re){

			this.setState({
				positionList: re.result.length >0 ? re.result : [],
			})
	}
	_setPosition(re,key){
		// Dispatcher.dispatch({
		// 	actionType: 'updAccountBasicInfo',
		// 	position: key || '',
		// 	updtype:'position',
		// 	positionId: re
		// })

		Dispatcher.dispatch({
			actionType: 'updAccountBasicInfo',
			position: key || '',
			positionId: re,
		});
		completeFlag = true;
		companyFlag = true;
		setTimeout( function(){ window.history.back(); } , 200);

	}
	componentWillMount() {
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getPosition'
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-职位选择')
		this._getPositionDone = EventCenter.on('getPositionDone', this._handlegetPositionDone.bind(this))
	}
	componentWillUnmount() {
		completeFlag = true;
		companyFlag = true;
		this._getPositionDone.remove()

	}
	render(){
		var length = this.state.positionList.length || 0;
    var positionList = this.state.positionList.map((item,index)=>{
			var count = index+1;
			var display;
			 if (this.state.listChangeNum && this.state.listChangeNum == item.id && length != count) {
					display = 'block'
			 }else {
				 	display='none'
			 }

			//去除中括号
			 var position_name=item.position_name.replace(/\[|]/g,'');

      return(
				<div  key={index}>
					{/* { (length == count)?
						<Link to={{pathname:`${__rootDir}/PgSetPosition`,query: null, hash: null, state:{key:this.key}}}>
							<div style={{...styles.positionDiv,borderBottomColor:null,borderBottomStyle:null,borderBottomWidth:0,}}>
								<span style={{fontSize:15,color:'#666666'}}>{position_name}</span>
								<img style={{float:'right',marginTop:16,display:display}} src={Dm.getUrl_img('/img/v2/icons/ok@2x.png')} width="19" height="13"/>
								<div style={{float:'right',marginRight:20,}}>
									<img src={Dm.getUrl_img('/img/v2/icons/more.png')}/>
								</div>
							</div>
						</Link>
						:
						<div style={{...styles.positionDiv}} key={index} onClick={this._setPosition.bind(this,item.id,item.position_name)}>
							<span style={{fontSize:15,color:'#666666'}}>{item.position_name}</span>
							<img style={{float:'right',marginTop:16,display:display}} src={Dm.getUrl_img('/img/v2/icons/ok@2x.png')} width="19" height="13"/>
						</div>
					} */}
						<div style={{...styles.positionDiv}} key={index} onClick={this._setPosition.bind(this,item.id,item.position_name)}>
							<span style={{fontSize:15,color:'#666666'}}>{item.position_name}</span>
							<img style={{float:'right',marginTop:16,display:display}} src={Dm.getUrl_img('/img/v2/icons/ok@2x.png')} width="19" height="13"/>
						</div>
				</div>
      )
    })
		return (
			<div style={{...styles.container}}>
        {positionList}
			</div>
		);
	}
}
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
		height: devHeight,
    width: devWidth,
		overflow:'auto',
		overflowX: 'hidden',
  },
  positionDiv:{
    width:devWidth-15,
    marginLeft:15,
    borderBottomColor:'#dddddd',
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    height:46,
    lineHeight:3
  }
};
export default PgPositionList;
