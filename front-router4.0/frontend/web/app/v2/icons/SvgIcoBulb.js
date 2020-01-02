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
			<svg width={this.props.width} height={this.props.height} stroke={this.props.color} fill={this.props.color} viewBox="0 0 209 209" >
			<g>
				<circle fill="none" strokeWidth="8" strokeMiterlimit="10" cx="103.5" cy="103.5" r="59.5"/>
				<path d="M103,5c3.314,0,6,2.686,6,6v15c0,3.314-2.686,6-6,6s-6-2.686-6-6V11C97,7.686,99.686,5,103,5z"/>
				<path d="M96,192h15c3.314,0,6,2.686,6,6s-2.686,6-6,6H96c-3.314,0-6-2.686-6-6S92.686,192,96,192z"/>
				<path d="M82,172h44c3.314,0,6,2.686,6,6s-2.686,6-6,6H82c-3.314,0-6-2.686-6-6S78.686,172,82,172z"/>
				<path d="M11,90h15c3.314,0,6,2.686,6,6s-2.686,6-6,6H11c-3.314,0-6-2.686-6-6S7.686,90,11,90z"/>
				<path d="M183,90h15c3.314,0,6,2.686,6,6s-2.686,6-6,6h-15c-3.314,0-6-2.686-6-6S179.686,90,183,90z"/>
				<path d="M177.546,34.954c2.343,2.343,2.343,6.142,0,8.485l-10.607,10.607c-2.343,2.343-6.142,2.343-8.485,0 c-2.343-2.343-2.343-6.142,0-8.485l10.607-10.607C171.404,32.611,175.203,32.611,177.546,34.954z"/>
				<path d="M30.798,34.767c-2.385,2.385-2.385,6.252,0,8.637l10.798,10.798c2.385,2.385,6.252,2.385,8.637,0 c2.386-2.386,2.386-6.253,0-8.638L39.436,34.767C37.051,32.381,33.184,32.381,30.798,34.767z"/>
			</g>
			</svg>
		);
	}
}
SvgIcoArrowBack.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	color: PropTypes.string,
};
SvgIcoArrowBack.defaultProps = {
	width: 256,
	height: 256,
	color: 'black'
};
export default SvgIcoArrowBack;
