/*
 * Author: Crane Leeon
 * */
import React from 'react';
const PropTypes = React.PropTypes;
import cx from 'classnames';
import * as icons from './index';

export class SvgIcon extends React.Component {
	constructor(props) {
	    super(props);
	}
  componentWillMount() {
  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
    const Icon = icons[this.props.name]
    return (
      <Icon {...this.props}/>
    )
	}
}
SvgIcon.propTypes = {
  name: PropTypes.string.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	color: PropTypes.string,
};
SvgIcon.defaultProps = {
	width: 256,
	height: 256,
	color: 'black'
};
export default SvgIcon;
