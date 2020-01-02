import React from 'react';
import WeUI from 'react-weui';

const {Button} = WeUI;

class PgWeui extends React.Component {
	_handleAppUrl(e) {
        e.preventDefault();
        window.open("com.linked-f.app://lesson/online_info/636");
    }

    render() {
			console.log(this.props.match.params.id)
        return (
            // <Button>hello wechat</Button>
        	<div className="container">
	            <button className="weui_btn weui_btn_primary">按钮</button>
	            <a href="com.linked-f.app://lesson/online_info/636">{this.props.location.query.qr}AppLink</a>
            </div>
        );
    }
}

export default PgWeui;
