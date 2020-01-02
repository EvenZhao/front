import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import {Dialog, Button, Input} from 'react-weui';

class AnswerList extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			answer: [],
			labels: []
		};
	}

  componentDidMount() {
		console.log('canAdopted',this.props);
  }

  componentWillUnmount() {
  }

	removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
    }
    return str2;
	}

  render() {
    if(this.props.answer && this.props.answer.length > 0) {
      var answer = this.props.answer.map((item, index) => {
        var hr
        if(index+1 == this.props.answer.length) {
          hr = 'none'
        } else {
          hr = 'block'
        }
				var title = this.removeHtmlTag(item.content)
				console.log("TITLE", title)
        return(
          <div key={index}>
              <div style={{margin: '0px 12px 10px 12px'}}>
              <Link to={{pathname: `${__rootDir}/answerDetail/${item.id}`, query: null, hash: null, state: {answer: item, title: this.props.title, isMyQuestion: this.props.isMyQuestion, canAdopted: this.props.canAdopted, questionId: this.props.questionId}}}>
							<div>
								<img src={item.user.photo} style={{width: 26, height: 26, borderRadius: 50}}/>
                <div style={{...styles.nick_name}}>{item.user.nick_name}</div>
								<div style={{display: item.status == 1 ? 'inline-block' : 'none', position: 'relative', float: 'right'}}>
									<img src={Dm.getUrl_img('/img/v2/icons/adopt@2x.png')} style={{width: 15, height: 15, marginRight: 3, position: 'relative', top: 2}}/>
        					<span style={{color: '#2196f3', fontSize: 13}}>已采纳</span>
								</div>
                <div style={{...styles.span}}>{title}</div>
							</div>
              </Link>
                <div style={{...styles.comment}}>{item.answer_comment_num} 评论</div>
                {/*<div style={{marginRight: 10, display: 'inline-block'}}>.</div>*/}
                <img src='../img/v2/icons/circle@2x.png' style={{width: 6, height: 6, borderRadius: 50}}/>
							<Link to={{pathname: this.props.isLogin == true ? `${__rootDir}/addAnswerComment` : `${__rootDir}/login`, query: null, hash: null, state: {answer_id: item.id, parent_id: 0, isLogin: this.props.isLogin}}}>
								<div style={{...styles.bottom_label ,display: 'inline-block', marginLeft: 10}}>回复</div>
							</Link>
                <div style={{...styles.bottom_label, float: 'right'}}>{new Date(item.last_time).format('yyyy-MM-dd')}</div>
              </div>
              <hr style={{...styles.tab_hr, marginBottom: 10, display: hr}}></hr>
          </div>
        )
      })
    } else {
      <div></div>
    }


    return(
      <div style={{backgroundColor: '#fff'}}>
        {answer}
      </div>
    )
  }
}

var styles = {
  span: {
		fontSize: 14,
		color: '#666',
		marginBottom: 10,
    marginLeft: 35,
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3,
		lineHeight: '22px'
	},
	nick_name: {
		display: 'inline-block',
    fontSize: 14,
    color: '#000',
    position: 'relative',
    top: -7,
    marginLeft: 6
	},
	comment: {
		fontSize: 14,
    color: '#999',
    marginRight: 10,
    display: 'inline-block',
    marginLeft: 35
	},
	bottom_label: {
		fontSize: 14,
    color: '#999',
	},
	tab_hr: {
    height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3'
  },
}


export default AnswerList;
