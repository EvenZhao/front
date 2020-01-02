/*
 * Author: Crane Leeon
 * */
import React from 'react';
const PropTypes = React.PropTypes;
import cx from 'classnames';
import Dm from '../util/DmURL'

export class SvgIconStar extends React.Component {
	constructor(props) {
	    super(props);
	}
	componentDidMount() {

	}
	componentWillUnmount() {
	}
	render(){
    if (this.props.status == 'all') {
      return (
        // <svg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height}  stroke={this.props.color} fill={this.props.color} viewBox="0 0 24 24">
        //   <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        // </svg>
				<img src={Dm.getUrl_img("/img/v2/icons/Star_full@2x.png")} width={this.props.width} height={this.props.height}/>
  		);
    } else if (this.props.status == 'half') {
      return (
        // <svg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height} stroke={this.props.color} fill={this.props.color} viewBox="0 0 24 24">
        //   <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        // </svg>
				<img src={Dm.getUrl_img("/img/v2/icons/half-star@2x.png")} width={this.props.width} height={this.props.height}/>
      );
    } else {
      return (
        // <svg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height} stroke={this.props.color} fill={this.props.color} fillRule="nonzero" viewBox="0 0 24 24">
        //   <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        // </svg>
				<img src={Dm.getUrl_img("/img/v2/icons/Star_null@2x.png")} width={this.props.width} height={this.props.height}/>
      );
    }

	}
}
SvgIconStar.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	strokeWidth: PropTypes.number,
	color: PropTypes.string,
  status: PropTypes.string,
};
SvgIconStar.defaultProps = {
	width: 256,
	height: 256,
	color: 'black',
	strokeWidth: 1,
  status: 'none',
};
export default SvgIconStar;

// export function SvgIcoMap() {
//   return (
//   <svg width={this.props.width} height={this.props.height} viewBox="0 0 20 20" >
//       <g >
//         stroke={this.props.color} strokeWidth={this.props.strokeWidth} ></path>
//       </g>
//   </svg>
// );
// }
// export default SvgIcoMap
