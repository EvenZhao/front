var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var patterns = require('../patterns.js');
var MEPanelSearchResult = require('./MEPanelSearchResult.jsx');
var AppDispatcher = require('../../dispatcher/AppDispatcher.js');
var STLContainer = require('../../components/STLContianer.jsx')(AppDispatcher);


function getTheState(){
    return {
        isShowLoadingMoreMark: false,
        isSwapUpLoadable: false,
        isPanelSearchResult: false,
        live_collect_Results: [],
        live_reserve_Results: [],
        live_join_Results: [],
        online_collect_Results: [],
        online_join_Results: [],
        offline_collect_Results: [],
        offline_enroll_Results: [],
        product_collect_Results: [],
        product_study_Results: [],
        coursetype: 'live',
        livetype: 'collection',
        onlinetype: 'collection',
        offlinetype:'collection',
        producttype : 'collection'

    };
}
var ListNum;
var MECenter = React.createClass({
	propTypes: {
		// data: React.PropTypes.array.isRequired,
		// title: React.PropTypes.string
	},
	getInitialState: function(){
        return getTheState();
    },
    _ChangeMyBook:function(){//我要预约
        this.setState({
            livetype:'book'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'live_info',
            action_type:'reserve'
        });
    },
    _ChangeMyCollection:function(){//直播客我的收藏
        this.setState({
            livetype:'collection'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'live_info',
            action_type:'collect'
        });
    },
    _ChangeMySee:function(){//直播客我看过的
        this.setState({
            livetype:'mysee'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'live_info',
            action_type:'join'
        });
    },
     _ChangeMyCollection2:function(){//视频课我的收藏
        this.setState({
            onlinetype: 'collection'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'online_info',
            action_type:'collect'
        });
    },
    _ChangeMyStudy:function(){//我学过的
        this.setState({
            onlinetype: 'book'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'online_info',
            action_type:'join'
        });

    },
    _ChangeProductMyStudy:function(){//我学过的
        this.setState({
            producttype: 'book'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'product',
            action_type:'join'
        });

    },

    _ChangeMyCollection3:function(){//线下课我收藏的
        this.setState({
            offlinetype: 'collection'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'offline_info',
            action_type:'collect'
        });
    },
     _ChangeMyCollection4:function(){//视频课我的收藏
        this.setState({
            producttype: 'collection'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'product',
            action_type:'collect'
        });
    },
    _ChangeMyRegistration:function(){
        // ChangeMyRegistration();//我的报名
        this.setState({
            offlinetype: 'registration'
        });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'offline_info',
            action_type:'enroll'
        });
    },
    _ChangeMyJoin:function(){//我参加的
        this.setState({
            offlinetype: 'join'
        });
    },
     _handleGET_MyCENTER: function(re){
        ListNum=0;
        var live_info_collect=[];//直播客我的收藏
        var live_info_reserve=[];//直播客我的预约
        var live_info_join=[];//直播客我看过的
        var online_info_collect=[];//视频课我的收藏
        var online_info_join=[];//视频课我看过的
        var offline_info_collect=[];//线下课我的收藏
        var offline_info_enroll=[];//线下课我的报名
        var product_collect = [];
        var product_study = [];
        
        if (re.result.reserve) {
            live_info_reserve=re.result.reserve;
            if (re && re.result.reserve && (re.result.reserve.length) < MeStore.LIMIT){

                    this.setState({
                        isSwapUpLoadable:false
                    });
            }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
        }
        if (re.result.collect) {
            if (re.result.collect[0].type==='live_info') {
                live_info_collect=re.result.collect;
                if (re && re.result.collect && (re.result.collect.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                } 
            }
            if (re.result.collect[0].type==='online_info') {
                online_info_collect=re.result.collect;
                if (re && re.result.collect && (re.result.collect.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
            }
            if (re.result.collect[0].type==='product') {
                product_collect = re.result.collect;
                if (re && re.result.collect && (re.result.collect.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
            }
            if (re.result.collect[0].type==='offline_info') {
                offline_info_collect=re.result.collect;
                if (re && re.result.collect && (re.result.collect.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
            }
        }
        if (re.result.enroll) {
            offline_info_enroll=re.result.enroll;
            if (re && re.result.enroll && (re.result.enroll.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
            }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
        }
        if (re.result.join) {
            if (re.result.join[0].type==='live_info') {
                live_info_join=re.result.join;
                if (re && re.result.join && (re.result.join.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
            }
            if (re.result.join[0].type==='online_info') {
                online_info_join=re.result.join;
                if (re && re.result.join && (re.result.join.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
            }
            if (re.result.join[0].type==='product') {
                product_study = re.result.join;
                if (re && re.result.join && (re.result.join.length) < MeStore.LIMIT){
                    this.setState({
                        isSwapUpLoadable:false
                    });
                }else{
                    this.setState({
                        isSwapUpLoadable:true
                    });
                }
            }
        }
        this.setState({
            live_collect_Results: live_info_collect,
            live_reserve_Results: live_info_reserve,
            live_join_Results: live_info_join,
            online_collect_Results:online_info_collect,
            online_join_Results:online_info_join,
            offline_collect_Results:offline_info_collect,
            offline_enroll_Results:offline_info_enroll,
            product_collect_Results:product_collect,
            product_study_Results:product_study,
            isShowLoadingMoreMark:false,
            searchResults:''
        });
    },
     _handleSEARCH_RESULT_CHANGED: function(re){
        if (re.result.length>MeStore.LIMIT && re.result>ListNum) {
            ListNum=re.result.length;
            var isSwapUpLoadable=true;
            this.setState({
                    isSwapUpLoadable: isSwapUpLoadable
                });
        }else{
            var isSwapUpLoadable = false;
            this.setState({
                    isSwapUpLoadable: isSwapUpLoadable
                });
        }
        if (re.actionType==='live_info') {//直播客
            if (re.listType==='collect') {
                this.setState({
                    live_collect_Results: re.result
                });
            }
            if (re.listType==='reserve') {
                this.setState({
                    live_reserve_Results: re.result
                });
            }
            if (re.listType==='join') {
                this.setState({
                    live_join_Results: re.result
                });
            }
        }
        if (re.actionType==='online_info') {//视频课
            if (re.listType==='collect') {
                this.setState({
                    online_collect_Results: re.result
                });
            }
            if (re.listType==='join') {
                this.setState({
                    online_join_Results: re.result
                });
            }  
        }
        if (re.actionType==='offline_info') {//线下课
            if (re.listType==='collect') {
                this.setState({
                    offline_collect_Results: re.result
                });
            }
            if (re.listType==='enroll') {
                this.setState({
                    offline_enroll_Results: re.result
                });
            }
        }
        if (re.actionType==='product') {//视频课
            if (re.listType==='collect') {
                this.setState({
                    product_collect_Results: re.result
                });
            }
            if (re.listType==='join') {
                this.setState({
                    product_study_Results: re.result
                });
            }  
        }

    },
     _handleREQUEST_START: function(act){
        switch (act.actionType) {
            case ActionTypes.SEARCH_MORE:
                this.setState({
                    isShowLoadingMoreMark: true,
                    isSwapUpLoadable:false
                });
                break;
        }
    },
     _handleREQUEST_END: function(act){
        switch (act.actionType) {
            case ActionTypes.SEARCH_MORE:
                this.setState({
                    isShowLoadingMoreMark: false,
                    isSwapUpLoadable:true
                });
                break;
        }
    },
    _handleChangeType_live: function(re){
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'live_info',
            action_type:'collect'
        });
        this.setState({
            coursetype: 'live',
            livetype:'collection'

        });
    },
    _handleChangeType_online: function(re){
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'online_info',
            action_type:'collect'
        });
        this.setState({
            coursetype: 'online',
            onlinetype: 'collection'
        });
    },
    _handleChangeType_offilne: function(re){
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'offline_info',
            action_type:'collect'
        });
        this.setState({
            coursetype: 'offline',
            offlinetype: 'collection'
        });
    },
    _handleChangeType_product: function(re){
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'product',
            action_type:'collect'
        });
        this.setState({
            coursetype: 'product',
            producttype: 'collection'
        });
    },
    componentDidMount: function() {
        MeStore.addEventListener(MeStore.Events.GET_LATEST_MyCENTER,  this._handleGET_MyCENTER);
        MeStore.addEventListener(MeStore.Events.REQUEST_START,  this._handleREQUEST_START);
        MeStore.addEventListener(MeStore.Events.REQUEST_END,  this._handleREQUEST_END);
        MeStore.addEventListener(MeStore.Events.SEARCH_RESULT_CHANGED,  this._handleSEARCH_RESULT_CHANGED);
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SEARCH_MyCENTER_RESULT,
            type:'live_info',
            action_type:'collect'
        });
    },
    componentWillUnmount: function() {
        MeStore.removeEventListener(MeStore.Events.CHANGE_PWD,  this._handleGET_MyCENTER);
        MeStore.addEventListener(MeStore.Events.REQUEST_START,  this._handleREQUEST_START);
        MeStore.addEventListener(MeStore.Events.REQUEST_END,  this._handleREQUEST_END);
        MeStore.addEventListener(MeStore.Events.SEARCH_RESULT_CHANGED,  this._handleSEARCH_RESULT_CHANGED);
    },
    _showlive: function(){
        var collection_div ='';
        var book_div = '';
        var mysee_div = '';
        var collection_top = '';
        var book_top = '';
        var mysee_top = '';
        switch(this.state.livetype){
            case "collection":
                collection_div = (
                    <div className="ME_center_div" id="MyCollectionDiv">
                        <div className="ME_center_div_width">
                            <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>
                                <MEPanelSearchResult data={this.state.live_collect_Results} keyWord={this.state.keyWord}/>
                                {this.state.isSwapUpLoadable ? '':
                                    <div className="bottom-remind-info">
                                        <h5 className="row"> ~ 我的收藏共 {this.state.live_collect_Results.length} 条 ~ </h5>
                                    </div>
                                }
                            </STLContainer>
                        </div>
                    </div>
                );
                collection_top = (
                    <div className="">
                        <a className="ME_div_top_a ME_div_top_a1 ME_top_title" onClick={this._ChangeMyCollection} id="MyCollection">我的收藏</a>
                        <a className="ME_div_top_a ME_div_top_a2 " onClick={this._ChangeMyBook} id="MyBook">我的预约</a>
                        <a className="ME_div_top_a ME_div_top_a3" onClick={this._ChangeMySee} id="MySee">我看过的</a>
                    </div>
                );
            break;
            case "book":
                book_div = (
                    <div className="ME_center_div" id="MyBookDiv">
                        <div className="ME_center_div_width">
                            <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>
                                <MEPanelSearchResult data={this.state.live_reserve_Results} keyWord={this.state.keyWord}/>
                                {this.state.isSwapUpLoadable ? '':
                                    <div className="bottom-remind-info">
                                        <h5 className="row"> ~ 我的预约共 {this.state.live_reserve_Results.length} 条 ~ </h5>
                                    </div>
                                }
                            </STLContainer>
                        </div>
                    </div>
                );
                book_top = (
                    <div className="">
                        <a className="ME_div_top_a ME_div_top_a1" onClick={this._ChangeMyCollection} id="MyCollection">我的收藏</a>
                        <a className="ME_div_top_a ME_div_top_a2 ME_top_title" onClick={this._ChangeMyBook} id="MyBook">我的预约</a>
                        <a className="ME_div_top_a ME_div_top_a3" onClick={this._ChangeMySee} id="MySee">我看过的</a>
                    </div>
                );
            break;
            case "mysee":
                mysee_div = (
                    <div className="ME_center_div" id="MySeeDiv">
                        <div className="ME_center_div_width">
                            <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>  
                                    <MEPanelSearchResult data={this.state.live_join_Results} keyWord={this.state.keyWord}/>
                                    {this.state.isSwapUpLoadable ? '':
                                        <div className="bottom-remind-info">
                                            <h5 className="row"> ~ 我看过的共 {this.state.live_join_Results.length} 条 ~ </h5>
                                        </div>
                                    }       
                            </STLContainer>
                        </div>
                    </div>
                );
                mysee_top = (
                    <div className="">
                        <a className="ME_div_top_a ME_div_top_a1 " onClick={this._ChangeMyCollection} id="MyCollection">我的收藏</a>
                        <a className="ME_div_top_a ME_div_top_a2 " onClick={this._ChangeMyBook} id="MyBook">我的预约</a>
                        <a className="ME_div_top_a ME_div_top_a3 ME_top_title" onClick={this._ChangeMySee} id="MySee">我看过的</a>
                    </div>
                );
            break;
        }

        return(
            <div className="Me_center_div_height" id="live_div">
                <div className="ME_div_top">
                    {collection_top}
                    {book_top}
                    {mysee_top}
                </div>
                {collection_div}
                {book_div}
                {mysee_div}
            </div>
        );
    },
    _showonline:function(){
        var collection_div = '';
        var mybook_div = '';
        var collection_top = '';
        var mybook_top = '';
        switch(this.state.onlinetype){
            case "collection":
                collection_div = (
                     <div className="ME_center_div" id="MyCollectionDiv2">
                         <div className="ME_center_div_width">
                             <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>                                
                                    <MEPanelSearchResult data={this.state.online_collect_Results} keyWord={this.state.keyWord}/>
                                    {this.state.isSwapUpLoadable ? '':
                                        <div className="bottom-remind-info">
                                            <h5 className="row"> ~ 我的收藏共 {this.state.online_collect_Results.length} 条 ~ </h5>
                                        </div>
                                    }                    
                             </STLContainer>
                         </div>
                    </div>
                );
                collection_top = (
                    <div className="">
                        <a className="ME_div_top_online_a ME_div_top_online_a1 ME_top_title" id="MyCollection2" onClick={this._ChangeMyCollection2}>我的收藏</a>
                        <a className="ME_div_top_online_a ME_div_top_online_a2" id="MyStudy" onClick={this._ChangeMyStudy}>我学过的</a>
                    </div>
                );
            break;
            case "book":
            mybook_div = (
                <div className="ME_center_div" id="MyStudydiv">
                    <div className="ME_center_div_width">
                        <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}> 
                                <MEPanelSearchResult data={this.state.online_join_Results} keyWord={this.state.keyWord}/>
                                {this.state.isSwapUpLoadable ? '':
                                    <div className="bottom-remind-info">
                                        <h5 className="row"> ~ 我学过的共 {this.state.online_join_Results.length} 条 ~ </h5>
                                    </div>
                                }
                        </STLContainer>
                    </div>
                </div> 
            );
            mybook_top = (
                <div className="">
                    <a className="ME_div_top_online_a ME_div_top_online_a1" id="MyCollection2" onClick={this._ChangeMyCollection2}>我的收藏</a>
                    <a className="ME_div_top_online_a ME_div_top_online_a2 ME_top_title" id="MyStudy" onClick={this._ChangeMyStudy}>我学过的</a>
                </div>
            );
            break;
        }
        return(
            <div className="Me_center_div_height" id="online_div">
                <div className="ME_div_top">
                    {collection_top}
                    {mybook_top}
                </div>
                {collection_div}
                {mybook_div}
            </div>
        );
    },
    _showoffline:function(){
        var collection_div = '';
        var registration_div = '';
        var join_div = '';
        var collection_top = '';
        var registration_top = '';
        var join_top = '';
        switch(this.state.offlinetype){
            case "collection":
                collection_div = (
                    <div className="ME_center_div" id="MyCollectionDiv3">
                        <div className="ME_center_div_width">
                            <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}> 
                                    <MEPanelSearchResult data={this.state.offline_collect_Results} keyWord={this.state.keyWord}/>
                                    {this.state.isSwapUpLoadable ? '':
                                        <div className="bottom-remind-info">
                                            <h5 className="row"> ~ 我的收藏共 {this.state.offline_collect_Results.length} 条 ~ </h5>
                                        </div>
                                    }
                            </STLContainer>
                        </div>
                    </div>
                );
                collection_top = (
                    <div className="">
                        <a className="ME_div_top_a ME_div_top_a1  ME_top_title" id="MyCollection3" onClick={this._ChangeMyCollection3}>我的收藏</a>
                        <a className="ME_div_top_a ME_div_top_a2" id="MyRegistration"  onClick={this._ChangeMyRegistration}>我的报名</a>
                        <a className="ME_div_top_a ME_div_top_a3" id="MyJoin" onClick={this._ChangeMyJoin} >我参加过</a>
                    </div>
                );
            break;
            case "registration":
            registration_div = (
                <div className="ME_center_div" id="MyRegistrationDiv">
                    <div className="ME_center_div_width">
                        <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>          
                                <MEPanelSearchResult data={this.state.offline_enroll_Results} keyWord={this.state.keyWord}/>
                                {this.state.isSwapUpLoadable ? '':
                                    <div className="bottom-remind-info">
                                        <h5 className="row"> ~ 我的报名共 {this.state.offline_enroll_Results.length} 条 ~ </h5>
                                    </div>
                                }       
                        </STLContainer>
                    </div>
                </div>
            );
            registration_top = (
                <div className="">
                    <a className="ME_div_top_a ME_div_top_a1 " id="MyCollection3" onClick={this._ChangeMyCollection3}>我的收藏</a>
                    <a className="ME_div_top_a ME_div_top_a2 ME_top_title" id="MyRegistration"  onClick={this._ChangeMyRegistration}>我的报名</a>
                    <a className="ME_div_top_a ME_div_top_a3" id="MyJoin" onClick={this._ChangeMyJoin} >我参加过</a>
                </div>
            );
            break;
            case "join":
            join_div = (
                <div className="ME_center_div" id="MyJoinDiv">
                    <div className="ME_center_div_width">
                          <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>
                            <div className="bottom-remind-info">
                                <h5 className="row"> ~ 工程师正在努力开发中 ~ </h5>
                            </div>
                         </STLContainer>
                    </div>
                </div>
            );
            join_top = (
                <div className="">
                    <a className="ME_div_top_a ME_div_top_a1" id="MyCollection3" onClick={this._ChangeMyCollection3}>我的收藏</a>
                    <a className="ME_div_top_a ME_div_top_a2" id="MyRegistration"  onClick={this._ChangeMyRegistration}>我的报名</a>
                    <a className="ME_div_top_a ME_div_top_a3 ME_top_title" id="MyJoin" onClick={this._ChangeMyJoin} >我参加过</a>
                </div>
            );
            break;
        }
        return(
             <div className="Me_center_div_height" id="offline_div">
                <div className="ME_div_top">
                    {collection_top}
                    {registration_top}
                    {join_top}
                </div>
                {collection_div}
                {registration_div}
                {join_div}      
            </div>
        );
    },
    _showproduct:function(){
        var collection_div = '';
        var mybook_div = '';
        var collection_top = '';
        var mybook_top = '';
        switch(this.state.producttype){
            case "collection":
                collection_div = (
                     <div className="ME_center_div" id="MyCollectionDiv2">
                         <div className="ME_center_div_width">
                             <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>                                
                                    <MEPanelSearchResult data={this.state.product_collect_Results} keyWord={this.state.keyWord}/>
                                    {this.state.isSwapUpLoadable ? '':
                                        <div className="bottom-remind-info">
                                            <h5 className="row"> ~ 我的收藏共 {this.state.product_collect_Results.length} 条 ~ </h5>
                                        </div>
                                    }                    
                             </STLContainer>
                         </div>
                    </div>
                );
                collection_top = (
                    <div className="">
                        <a className="ME_div_top_online_a ME_div_top_online_a1 ME_top_title" id="MyCollection2" onClick={this._ChangeMyCollection4}>我的收藏</a>
                        <a className="ME_div_top_online_a ME_div_top_online_a2" id="MyStudy" onClick={this._ChangeProductMyStudy}>我学过的</a>
                    </div>
                );
            break;
            case "book":
            mybook_div = (
                <div className="ME_center_div" id="MyStudydiv">
                    <div className="ME_center_div_width">
                        <STLContainer actionType={MeStore.ActionTypes.SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}> 
                                <MEPanelSearchResult data={this.state.product_study_Results} keyWord={this.state.keyWord}/>
                                {this.state.isSwapUpLoadable ? '':
                                    <div className="bottom-remind-info">
                                        <h5 className="row"> ~ 我学过的共 {this.state.product_study_Results.length} 条 ~ </h5>
                                    </div>
                                }
                        </STLContainer>
                    </div>
                </div> 
            );
            mybook_top = (
                <div className="">
                    <a className="ME_div_top_online_a ME_div_top_online_a1" id="MyCollection2" onClick={this._ChangeMyCollection4}>我的收藏</a>
                    <a className="ME_div_top_online_a ME_div_top_online_a2 ME_top_title" id="MyStudy" onClick={this._ChangeProductMyStudy}>我学过的</a>
                </div>
            );
            break;
        }
        return(
            <div className="Me_center_div_height" id="online_div">
                <div className="ME_div_top">
                    {collection_top}
                    {mybook_top}
                </div>
                {collection_div}
                {mybook_div}
            </div>
        );
    },
    _showCenter: function(){
        var live_div = '';
        var online_div ='';
        var offline_div = '';
        var product_div = '';
        var bottom_div = '';
        switch(this.state.coursetype){
            case "live":
                live_div =this._showlive();
                bottom_div = (
                    <div className="">
                        <a className="ME_div_bottom_a2" id="liveinfo" onClick={this._handleChangeType_live}>直播课</a>
                        <a className="ME_div_bottom_a"  id="onlineinfo" onClick={this._handleChangeType_online}>视频课</a>
                        <a className="ME_div_bottom_a"  id="offlineinfo" onClick={this._handleChangeType_offilne}>线下课</a>
                        <a className="ME_div_bottom_a"  id="product" onClick={this._handleChangeType_product}>专题课</a>
                    </div>

                );
                break;
            case "online":
                online_div = this._showonline();
                bottom_div = (
                    <div className="">
                        <a className="ME_div_bottom_a" id="liveinfo" onClick={this._handleChangeType_live}>直播课</a>
                        <a className="ME_div_bottom_a2"  id="onlineinfo" onClick={this._handleChangeType_online}>视频课</a>
                        <a className="ME_div_bottom_a"  id="offlineinfo" onClick={this._handleChangeType_offilne}>线下课</a>
                        <a className="ME_div_bottom_a"  id="product" onClick={this._handleChangeType_product}>专题课</a>
                    </div>
                );
                break;
            case "offline":
                offline_div = this._showoffline();
                bottom_div = (
                    <div className="">
                        <a className="ME_div_bottom_a" id="liveinfo" onClick={this._handleChangeType_live}>直播课</a>
                        <a className="ME_div_bottom_a"  id="onlineinfo" onClick={this._handleChangeType_online}>视频课</a>
                        <a className="ME_div_bottom_a2"  id="offlineinfo" onClick={this._handleChangeType_offilne}>线下课</a>
                        <a className="ME_div_bottom_a"  id="product" onClick={this._handleChangeType_product}>专题课</a>
                    </div>
                );
                break;
            case "product":
                product_div = this._showproduct();
                bottom_div = (
                    <div className="">
                        <a className="ME_div_bottom_a" id="liveinfo" onClick={this._handleChangeType_live}>直播课</a>
                        <a className="ME_div_bottom_a"  id="onlineinfo" onClick={this._handleChangeType_online}>视频课</a>
                        <a className="ME_div_bottom_a"  id="offlineinfo" onClick={this._handleChangeType_offilne}>线下课</a>
                        <a className="ME_div_bottom_a2"  id="product" onClick={this._handleChangeType_product}>专题课</a>
                    </div>
            );
            break;
        }
        return(
            <div className="change_div panel register">
                {live_div}
                {online_div}
                {offline_div}
                {product_div}
                <div className="Me_center_div_bottom navbar-fixed-bottom">
                    <div className="">
                        <div className="Me_center_div_height_bottom" id="live_div">
                            {bottom_div}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
	render: function(){
        var c = this._showCenter();
		return (
            <div>
                {c}
            </div>
		);
	}
});
module.exports = MECenter;

