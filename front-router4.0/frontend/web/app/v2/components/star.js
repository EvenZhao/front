import React from 'react';
import WeUI from 'react-weui';
import { SvgIcoMap, SvgIcoArrowBack, SvgIcoBulb,SvgIconStar } from '../icons';
import Dm from '../util/DmURL'

const {Button} = WeUI;

class star extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
      width: this.props.width,
      height: this.props.height,
      star: this.props.star,
      chose: 'all',
      score: this.props.score,
      right: this.props.right,
      scoreShow: this.props.scoreShow,
      // propScore: this.props.propScore, //外部传数 （固定分数）
      canChange: this.props.canChange, //外部传数 （能否点击）
    }

    this.starButton = [
      {
        id: 1,
        select: ''
      }, {
        id: 2,
        select: ''
      }, {
        id: 3,
        select: ''
      }, {
        id: 4,
        select: ''
      }, {
        id: 5,
        select: ''
      },
    ]

  }

    _index(idx) {
      if(this.state.canChange == false) {
        return
      }
      if(this.state.chose == 'all' && this.state.star == idx) {
        this.setState({
          star: idx,
          score: idx-0.5,
          chose: 'half'
        })
        this.props.StarCheck(idx-0.5)
      } else {
        this.setState({
          star: idx,
          score: idx,
          chose: 'all'
        })
        this.props.StarCheck(idx)
      }
    }

  render() {
    var star = this.starButton.map((item,index) => {
      var right
      var dis
      if(this.state.canChange == false) {
        if(item.id <= this.props.propScore) {
          item.select = 'all'
        } else if(this.props.propScore+1 - item.id >= 0.5) {
          item.select = 'half'
        } else {
          item.select = 'unselect'
        }
      } else {
        if(item.id < this.state.star) {
          item.select = 'all'
        } else if(item.id == this.state.star && this.state.chose == 'all') {
          item.select = 'all'
        } else if(item.id == this.state.star && this.state.chose == 'half') {
          item.select = 'half'
        } else {
          item.select = 'unselect'
        }
      }
      if(this.state.canChange == false && item.select == 'unselect') {
        // dis = 'none'
        dis = 'inline-block'
      } else {
        dis = 'inline-block'
      }
      let iconStyle = {
        width: this.state.width,
        height: this.state.height,
        color: '#2196f3',
        status: item.select,//all half none
      }

      return(
        <div key={index} style={{...styles.star, marginRight: this.state.right, display: dis}}
        onClick={() => {
          this._index(item.id)
        }}
          >
           <SvgIconStar {...iconStyle}/>
        </div>
      )
    })

    return (
      <div style={{display: 'inline-block'}}>
      	<div style={{display: 'inline-block', position: 'relative', top: 3}}>
          {star}
        </div>
        <span style={{fontSize: 20,color:'#F37633', display: this.state.scoreShow ? 'inline-block' : 'none'}}>{this.state.score}分</span>
      </div>
    );
  }
}

var styles = {
  star: {
    display: 'inline-block'
  }
}

export default star;
