/*
 * Joyce
 * */
import React from 'react';
import Dm from '../util/DmURL'

class GenderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      isSet: props.isSecret,
      gender:props.gender,
    }
    this.set = this.props.isSecret;
  }

  componentWillMount(){

  }

  componentDidMount() {
   
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      gender:nextProps.gender,
      isSet: nextProps.isSecret,
    })
  }

  componentWillUpdate(){
    
  }

  componentWillUnmount() {

  }

  _selected(item) {
    this.setState({
      gender:item,
    })
  }
  //设置性别是否保密
  _setGender() {
    this.setState({
      isSet:!this.state.isSet
    })
    // this.props.set(!this.state.isSet)
  }

  //确定设置性别
  _confirm(){
    this.props.confirm({"genderType":this.state.gender,"isSecret":this.state.isSet})
  }

  render() {
    return (
      <div style={{...styles.box,display:this.props.isShow ? 'block':'none'}} >
        <div style={styles.genderBox}>
          <div style={styles.selectedTitle}>请选择性别</div>
          <div style={styles.genderList} onClick={this._selected.bind(this,1)}>
            <div style={styles.text}>男</div>
            <div style={{ ...styles.textSelected, display:this.state.gender == 1 ? 'block':'none' }}>
              <img src={Dm.getUrl_img('/img/v2/icons/genderCheck.png')} width={16} height={11} />
            </div>
          </div>
          <div style={styles.genderList} onClick={this._selected.bind(this,2)}>
            <div style={styles.text}>女</div>
            <div style={{ ...styles.textSelected, display:this.state.gender == 2 ? 'block':'none' }}>
              <img src={Dm.getUrl_img('/img/v2/icons/genderCheck.png')} width={16} height={11} />
            </div>
          </div>
          <div style={styles.set}>
            <div style={styles.setText}>设性别对外保密</div>
            <div style={styles.setButton} onClick={this._setGender.bind(this)}>
              {
                this.state.isSet ?
                <img src={Dm.getUrl_img('/img/v2/icons/is_anonymous@3x.png')} width={41} height={24} />
                  :
                <img src={Dm.getUrl_img('/img/v2/icons/not_anonymous@3x.png')} width={41} height={24} />
              }
            </div>
          </div>
        </div>
        <div style={styles.btnOk} onClick={this._confirm.bind(this)}>确定</div>
      </div>
    )
  }
}
var styles = {
  box: {
    width: window.screen.width - 20,
    position: 'fixed',
    bottom: 10,
    left: 10,
    zIndex: 99,
  },
  genderBox: {
    borderRadius: 12,
    width: window.screen.width - 20,
    height: 214,
    backgroundColor: '#fff',
  },
  selectedTitle: {
    height: 45,
    lineHeight: '45px',
    borderBottom: 'solid 1px #dcdcdc',
    textAlign: 'center',
    fontSize: 13,
    color: '#8F8E94'
  },
  genderList: {
    width: window.screen.width - 20,
    height: 57,
    lineHeight: '57px',
    borderBottom: 'solid 1px #dcdcdc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  text: {
    fontSize: 20,
    color: '#0076FF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSelected: {
    width: 16,
    height: 11,
    position: 'absolute',
    right: 42,
    top: 0
  },
  set: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: 57,
  },
  setText: {
    fontSize: 16,
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: 45,
    width: window.screen.width - 101,
  },
  setButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: 40
  },
  btnOk: {
    width: window.screen.width - 20,
    height: 57,
    marginTop: 18,
    lineHeight: '57px',
    backgroundColor: '#fff',
    borderRadius: 12,
    color: '#0076FF',
    fontSize: 20,
    textAlign: 'center',
  }
};

export default GenderList;
