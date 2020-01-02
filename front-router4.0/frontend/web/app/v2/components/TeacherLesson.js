import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class TeacherLesson extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
      live_lesson: this.props.live_lesson
		};

	}

	componentDidMount() {
    console.log(this.props)
	}
	componentWillUnmount() {

	}
	render(){

		return (
      <div>
        <div style={{padding: '12px 0px', width: window.screen.width, height: 18}}>
          {/*<div style={{...styles.logo}}></div>*/}
          <img src={Dm.getUrl_img('/img/v2/icons/online_lesson@2x.png')} style={{...styles.logo}}/>
          <span style={{...styles.logo_title}}>视频课</span>
          <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15}}/>
        </div>
        {/*{t_lesson}*/}
      </div>
		);
	}
}

var styles = {
  logo: {
		marginLeft: 12,
		width: 18,
		height: 18,
		borderColor: 'red',
		display: 'inline-block',
		marginRight: 9
	},
  logo_title: {
		color: '#333',
		fontSize: 15,
    position: 'relative',
    top: -3
	},
};
export default TeacherLesson;
