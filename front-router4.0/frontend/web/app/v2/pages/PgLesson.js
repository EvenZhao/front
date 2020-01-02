/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from './ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';

class PgLessonList extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}
	render(){
		let les = {les: this.props.match.params.type}
		return (
			<div>
				<ListFilterPanel {...les}/>
			</div>
		)
	}
}

export default PgLessonList;
