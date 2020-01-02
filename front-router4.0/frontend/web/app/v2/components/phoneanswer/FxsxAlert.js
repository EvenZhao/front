import React from 'react';

export default class FxsxAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

        this.direction = [{ name: '全部方向', value: 0 }, { name: '财务方向', value: 1 }, { name: '税务方向', value: 2 }]
    }

    render() {
        return (
            <div style={styles.div_container}>
                <div style={styles.div_bg} onClick={() => {
                    this.props.dismiss();
                }} />
                <div style={{
                    width: devWidth,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute', top: 0
                }}>
                    {this.direction.map((item, i) => {
                        return (
                            <div onClick={()=>{
                                this.props.dismiss();
                                this.props.confirm(item)
                            }} style={{
                                width: devWidth, height: 40,
                                backgroundColor: '#F9F9F9', display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderTopWidth: 1,
                                borderTopColor: '#ffffff',
                                borderTopStyle: 'solid'
                            }}>
                                <span style={{ color: '#333333', fontSize: 14, marginLeft: 14 }}>{item.name}</span>
                            </div>
                        )
                    })}
                </div>

            </div>
        )
    }
}
var styles = {
    div_container: {
        width: devWidth,
        height: devHeight - 80,
        position: 'absolute',
        top: 80,
        zIndex: 999999
    },
    div_bg: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#000000',
        width: devWidth,
        height: devHeight - 80,
        opacity: 0.3,
    },
}
