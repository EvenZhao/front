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


class Participants extends React.Component {

  constructor(props) {
    super(props);

    console.log('this.props',this.props);

    this.participants = this.props.location.state.participants;
    this.participantsByInviteeId = this.props.location.state.participantsByInviteeId;
    this.isMain = this.props.location.state.isMain;
  }

  componentWillMount() {


  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-参课人员名单');

  }

  componentWillUnmount() {
    this.e_TaskList.remove()
  }

  render(){

    var participants = this.participants.map((item,index)=>{
      return(
	        <div style={{...styles.enrollPerson}} key={index} onClick={this._goParticipantsDetail.bind(this,item.enrollId)}>
					{
						this.isMain ?
						<div style={{height:45,lineHeight:'45px',}}>
							<div style={{width:window.screen.width -24}}>
								<span style={{...styles.people_info}}>{item.name}</span>
								<span style={{...styles.people_info}}>
									{item.phone}
								</span>
								<span style={{...styles.people_info}}>
									{item.email}
								</span>
							</div>
							<hr style={{width:window.screen.width, border: 'none', height: 1, backgroundColor: '#f3f3f3',}}/>
						</div>
						:
						<div style={{height:45,lineHeight:'45px'}}>
							<div style={{width:window.screen.width -24}}>
								<span style={{...styles.people_info}}>{item.name}</span>
								<span style={{...styles.people_info}}>
									{item.position}
								</span>
								<span style={{...styles.people_info}}>
									{item.phone}
								</span>
							</div>
							<hr style={{width:window.screen.width, border: 'none', height: 1, backgroundColor: '#f3f3f3',}}/>
						</div>
					}
	    </div>
      )
    })

    var participantsByInviteeId = this.participantsByInviteeId.map((item,index)=>{
      return(
	        <div style={{...styles.enrollPerson}} key={index} onClick={this._goParticipantsDetail.bind(this,item.enrollId)}>
					{
						this.isMain ?
						<div style={{height:45,lineHeight:'45px',}}>
							<div style={{width:window.screen.width -24}}>
								<span style={{...styles.people_info}}>{item.name}</span>
								<span style={{...styles.people_info}}>
									{item.phone}
								</span>
								<span style={{...styles.people_info}}>
									{item.email}
								</span>
							</div>
							<hr style={{width:window.screen.width, border: 'none', height: 1, backgroundColor: '#f3f3f3',}}/>
						</div>
						:
						<div style={{height:45,lineHeight:'45px'}}>
							<div style={{width:window.screen.width -24}}>
								<span style={{...styles.people_info}}>{item.name}</span>
								<span style={{...styles.people_info}}>
									{item.position}
								</span>
								<span style={{...styles.people_info}}>
									{item.phone}
								</span>
							</div>
							<hr style={{width:window.screen.width, border: 'none', height: 1, backgroundColor: '#f3f3f3',}}/>
						</div>
					}
	    </div>
      )
    })

    return(
      <div style={styles.container}>
          {participants}
          {participantsByInviteeId}
      </div>
    )
  }
  _goParticipantsDetail(re){
		this.props.history.push({pathname: `${__rootDir}/PgEnrollPerson/${re}`})
	}

}

var styles ={
  container:{
    width:window.screen.width,
    height:window.innerHeight,
  },
  enrollPerson:{
    width: window.screen.width -12,
    height: 'auto',
    paddingLeft: 12,
    backgroundColor:'#fff',
    paddingBottom:10,
  },
  people_info:{
		fontSize:12,
		color:'#333',
		display:'inline-block',
		width:(window.screen.width-24)/3,
	},

}


export default Participants;
