/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import CatalogList from '../components/CatalogList';
import Star from '../components/star';
import CommentList from '../components/CommentList';
import TeacherDetail from '../components/TeacherDetail';
import Dm from '../util/DmURL'

class PgPriceIntroduction extends React.Component {
	constructor(props) {
    super(props);
		this.state = {

		};

	}


	componentWillMount() {

	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-参课须知')
	}
	componentWillUnmount() {

	}
	render(){
    console.log(this.props.location.state.html)
		return (
			<div style={{backgroundColor: '#fff', height: devHeight}}>
        <div style={{height: 47}}>
          {/*<div style={{...styles.logo}}></div>*/}
					<img src={Dm.getUrl_img('/img/v2/icons/icon_description@2x.png')} style={{...styles.logo, width: 14, height: 17, position: 'relative', top: 3}}/>
          <span style={{...styles.logo_title}}>参课须知</span>
        </div>
        <hr style={{...styles.t_hr}}></hr>
        <div dangerouslySetInnerHTML={{__html: this.props.location.state.price}} style={{fontSize: 14, color: '#333', padding: '0px 12px', backgroundColor: '#fff'}}></div>
			</div>
		)
	}
}

var styles = {
  logo_title: {
		color: '#333',
		fontSize: 15,
    lineHeight: '47px'
	},
  logo: {
		marginLeft: 12,
		// border:'1px solid',
		width: 16,
		height: 16,
		// borderColor: 'red',
		display: 'inline-block',
		marginRight: 9
	},
  t_hr: {
		backgroundColor: '#e5e5e5',
		border: 'none',
		height: 1,
		marginBottom: 12,
	},
}

export default PgPriceIntroduction;
