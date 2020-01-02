import React from 'react';
import WeUI from 'react-weui';
import Star from '../components/star';
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

const {Button} = WeUI;

class CommentList extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
      w_width: window.screen.width,
    }

    this.lab = 0

  }

  componentWillMount() {
  }

  componentDidMount() {
  }
  removeHtmlTag(str) {
		if(str) {
			var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
		}
		return str2;
	}
  render() {
    if(this.props.comList && this.props.isList && this.props.comList.length > 0) {
      var commitList = this.props.comList.map((item, index) => {
        this.star = item.star
        let starUserScore = {
          right: 4,
          star: item.star,
          canChange: false,
          score: item.star,
          propScore: item.star, //外部传数 （固定分数）
    			scoreShow: false,
    			width: 11,
    			height: 11
        }
        this.lab = item.labels.length
        if(item.labels) {
          var lab = item.labels.map((lab, idx) => {
            return(
              <div key={idx} style={{display: 'inline-block'}}>
                <div style={{...styles.com_lab}}>{lab}</div>
              </div>
            )
          })
        }
        var hrStyle
        var top
        var hrDis
        if(this.props.space) {
          if(index == 0) {
            top = 12
            hrStyle = false
            hrDis = true
          } else if(this.props.comList.length-1 === index) {
            top = 0
            hrStyle = false
            hrDis = false
          } else {
            top = 0
            hrStyle = false
            hrDis = true
          }
        } else {
          if(this.props.comList.length < 2) {
            hrStyle = true
            hrDis = true
          } else {
            if(index == 1) {
              hrStyle = true
              hrDis = true
            } else {
              hrStyle = false
              hrDis = true
            }
          }
        }

        var toLink ='';
        if(item.is_teacher){
          toLink = `${__rootDir}/LecturerHomePage/${item.user_id}`;
        }else {
          toLink = `${__rootDir}/PersonalPgHome/${item.user_id}`
        }

      var content = this.removeHtmlTag(item.content)
  			return(
          <div key={index} style={{marginTop: top}}>
  					<div style={{paddingLeft: 12, paddingRight: 12, display: 'flex', marginBottom: 6}}>
            <Link to={toLink}>
  						<img src={item.photo} style={{...styles.teacher_img}}/>
            </Link>
              <div style={{flex: 1}}>
    						<div style={{verticalAlign: 'super'}}>
  								<div style={{...styles.item_nick_name}}>{item.nick_name}</div>
    						</div>
                <div style={{...styles.star_div}}>
                  <Star {...starUserScore}/>
                </div>
              </div>
  						<div style={{...styles.time_div}}>{new Date(item.add_time).format("yyyy-MM-dd")}</div>
  					</div>
            <div style={{...styles.item_content}}>{content}</div>
            <div style={{...styles.label, display: this.lab > 0 ? 'block' : 'none'}}>
              <img src={Dm.getUrl_img('/img/v2/icons/label@2x.png')} style={{width: 14, height: 14, marginRight: 9, position: 'relative', top: 3.5}}/>
              {lab}
            </div>
            {
              this.props.detail && index == 1 ?
              <Link to={`${__rootDir}/commentList/${this.props.id}`}>
                <div style={{...styles.have_comment_div,backgroundColor:'#ffffff', display: this.props.isList ? 'block' : 'none'}}>
                  <div style={{...styles.no_comment_txt}}>
                  查看所有评价
                  </div>
                </div>
              </Link>
              :
              null
            }
  					<hr style={{...styles.teacher_hr_margin, marginLeft: hrStyle ? 0 : 12, marginRight: hrStyle ? 0 : 12, display: hrDis ? 'block' : 'none', backgroundColor: hrStyle ? '#e5e5e5' : '#f3f3f3'}}></hr>
          </div>
  			)
  		})
    }


    return (
      <div style={{backgroundColor: '#fff'}}>
        <Link to={this.props.isLogin ? `${__rootDir}/comment/${this.props.id}` : `${__rootDir}/login`}>
        <div style={{...styles.no_comment_div,backgroundColor:'#2196f3', display: this.props.isList ? 'none' : 'block'}}>
          {/*<div style={{width: 15, height: 15, border: '1px solid', display: 'inline-block', marginTop: 5}}></div>*/}
          <img src={Dm.getUrl_img('/img/v2/icons/white-comment@2x.png')} style={{width: 20, height: 18,float:'left',marginTop:4}}/>
          <div style={{...styles.no_comment_txt,marginLeft:5,float:'left',color:'#fff'}}>
          写第一条评价
          </div>
        </div>
        </Link>
        <hr style={{...styles.teacher_hr, display: this.props.isList ? 'none' : 'block'}}></hr>
        {commitList}

      </div>
    );
  }
}

var styles = {
  no_comment_txt: {
    color:'#2196f3',
    fontSize: 12,
    height:27,
    lineHeight:'27px',
    textAlign:'center',
  },
  no_comment_div: {
    width: 100,
    height: 27,
    borderRadius: 4,
    padding: '3px 14px',
    margin: '0 auto',
  },
  have_comment_div: {
    width: 90,
    height: 24,
    border: '1px solid #2196f3',
    borderRadius: 4,
    borderColor: '#666',
    padding: '0px 14px',
    margin: '0 auto',
    borderColor:'#2196f3',
    marginTop:18
  },
  item_content: {
    fontSize: 14,
    color: '#333',
    marginTop: -9,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    textOverflow:'ellipsis',
    overflow: 'hidden',
    marginLeft: 68,
    marginRight: 12
  },
  time_div: {
    textAlign: 'end',
    marginTop: 2,
    color: '#999',
    fontSize: 11,
    flex: 0.5
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
  teacher_img: {
		width: 43,
		height: 43,
		borderRadius: 50,
		display: 'inline-block',
		marginRight: 10
	},
  teacher_hr: {
		backgroundColor: '#e5e5e5',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15
	},
  label: {
    width: window.screen.width-75,
    // top: -20,
    // position: 'relative',
    // display: 'inline-block',
    marginLeft: 65,
	},
  com_lab: {
    fontSize: 11,
    color: '#333',
    backgroundColor: '#e3f1fc',
    borderRadius: 4,
    display: 'inline-block',
    padding: '1px 10px 1px 10px',
    marginRight: 12
  },
  item_nick_name: {
    fontSize: 12,
    color: '#666',
    lineHeight: '13px',
    display: 'inline-block',
    width: 60,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  star_div: {
    display: 'inline-block',
    textAlign: 'start',
    position: 'relative',
    top: -8
  }
}

export default CommentList;
