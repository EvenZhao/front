import React from 'react';
class BigLoading extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
    }
    componentWillMount() {
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }

    render() {
        return (
            <div className="loader loader4" style={{display: this.props.isShow ? 'block' : 'none'}}>
              <div> <div> <div> <div> <div> <div> <div> <div> <div> <div></div> </div> </div> </div> </div> </div> </div> </div> </div> </div>
            </div>
        )
    }
    
}
export default BigLoading;