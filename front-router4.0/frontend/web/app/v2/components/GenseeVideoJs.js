import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'

class GenseeVideoJs extends Component {
  render() {
    return null
  }
}

export default scriptLoader(
  [
    'http://static.gensee.com/webcast/static/sdk/js/gssdk.js'
  ],
)(GenseeVideoJs)
