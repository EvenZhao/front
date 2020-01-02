/*
 * Author: Crane Leeon
 * */
import React from 'react';
const PropTypes = React.PropTypes;
import cx from 'classnames';

export class SvgIcoArrowBack extends React.Component {
	constructor(props) {
	    super(props);
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
		return (
			<svg width={this.props.width} height={this.props.height} viewBox="0 0 200 200" >
			<polyline fill="none" stroke={this.props.color} strokeWidth={this.props.strokeWidth}  strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="
				127.5,39.852 67,100.352 123.648,157 "/>
			</svg>
		);
	}
}
SvgIcoArrowBack.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	strokeWidth: PropTypes.number,
	color: PropTypes.string,
};
SvgIcoArrowBack.defaultProps = {
	width: 256,
	height: 256,
	color: 'black',
	strokeWidth: 24
};
export default SvgIcoArrowBack;
