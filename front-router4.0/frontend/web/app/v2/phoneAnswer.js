/*电话答疑*/
import './modulesTop'
import "babel-polyfill";
import './util/funcs';
import React, { PropTypes } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Match,
    withRouter,
    IndexRoute,
    Link,
} from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
// 注册所有store
export * from './stores/PhoneAnswerStore'
import PhoneAnswerUser from './pages/PhoneAnswerUser'
import PhoneAnswerUserDet from './pages/PhoneAnswerUserDet'
import PhoneAnswerTeacher from './pages/PhoneAnswerTeacher'
import PhoneAnswerUserRecords from './pages/PhoneAnswerUserRecords'
import PhoneAnswerEvaluation from './pages/PhoneAnswerEvaluation'
import {render } from 'react-dom'; 
class PgIndex extends React.Component {
    componentWillMount() {

    }
    componentDidMount() {

    }
    // componentDidUpdate (prevProps) {
    // }
    componentWillUnmount() {

    }

    render() {
        return (
            <div>
          <Router>
            <div>
              <Route render={({ location }) => (
                <CSSTransitionGroup
                  transitionName="AnimNavTrans"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                >
                <Route location={location} key={location.key}>
                  <Switch>
                    <Route exact path={`${__rootDir}/PhoneAnswerUser`} component={withRouter(PhoneAnswerUser)}></Route>
                    <Route exact path={`${__rootDir}/PhoneAnswerUserDet/:id`} component={withRouter(PhoneAnswerUserDet)}></Route>
                    <Route exact path={`${__rootDir}/PhoneAnswerTeacher`} component={withRouter(PhoneAnswerTeacher)}></Route>
                    <Route exact path={`${__rootDir}/PhoneAnswerUserRecords`} component={withRouter(PhoneAnswerUserRecords)}></Route>
                    <Route exact path={`${__rootDir}/PhoneAnswerEvaluation`} component={withRouter(PhoneAnswerEvaluation)}></Route>
                  </Switch>
                </Route>
                </CSSTransitionGroup>
              )} />
            </div>
          </Router>
        </div>
        )
    }
}

import './modulesFooter'


if (!renderFromApp) {
    render(<PgIndex />, document.getElementById('react'));
    localStorage.removeItem("navigationDisplay")
} else {
    // 如果是APP调用显示，则需要显示公共头部（返回按钮和title）
    localStorage.setItem("navigationDisplay", true)
    // APP 会将登录信息放在header中带过来，故用headersDatas接收，然后存在localStorage
    if (headersDatas) {
        setParametersForApp(headersDatas.openid, headersDatas.code, headersDatas.bolueclient, headersDatas.boluever, "", "", headersDatas.params)
        render(<PgIndex />, document.getElementById('react'));
    }
}