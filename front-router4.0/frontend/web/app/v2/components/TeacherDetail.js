import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import CatalogList from '../components/CatalogList';
import Star from '../components/star';
import CommentList from '../components/CommentList';
import Dm from '../util/DmURL'

class TeacherDetail extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
		};

	}

	componentDidMount() {

	}
	componentWillUnmount() {

	}
	render(){
    var t_detail = this.props.t_detail.map((item, index) => {
      var hrStyle
			var top
      if(this.props.t_detail > 1) {
        if(index === this.props.t_detail.length-1) {
          hrStyle = styles.teacher_hr
        } else {
          hrStyle = styles.teacher_hr_margin
        }
      } else {
        hrStyle = styles.teacher_hr
      }
      let teacher = {
        t_detail: this.props.t_detail
      }
			if(item.title) {
				top = -14
			} else {
				top = -25
			}
			var id =item.account_id;
      return(
        <Link to={`${__rootDir}/LecturerHomePage/${id}`} key={index}>
	        <div style={{paddingLeft: 12, paddingRight: 12, height: 60, marginTop: 12}}>
							<div style={{float:'left',position:'relative',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/lec_big@2x.png')} width={14} height={14} style={{...styles.tag,}}/>
                <img src={item.photo} style={{...styles.teacher_img}} />
              </div>
	            <div style={{float:'left',width:window.screen.width-114,marginTop:5,}}>
	              <div style={{fontSize: 16, color: '#333'}}>{item.name}</div>
								<div style={{fontSize: 14, color: '#999'}}>{item.title}</div>
	            </div>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{...styles.logo, width: 7, height: 12, float: 'right',marginTop:25}}/>
	        </div>
        </Link>
      )
    })
		return (
      <div>
        {t_detail}
      </div>
		);
	}
}

var styles = {
  teacher_img: {
		width: 60,
		height: 60,
		borderRadius: '50%',
		marginRight: 10,
		float:'left',
	},
  teacher_hr_margin: {
		backgroundColor: '#f3f3f3',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15,
		marginLeft: 12,
		marginRight: 12
	},
  teacher_hr: {
		backgroundColor: '#e5e5e5',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15
	},
	tag:{
		position:'absolute',
		zIndex:2,
		bottom:0,
		right:15,
	},
};
export default TeacherDetail;
