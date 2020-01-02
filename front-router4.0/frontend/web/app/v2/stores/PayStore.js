import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

var countdown;
var count = 0
export function doisPayCompleteWeixin(action) {
  fetch(dm.getUrl_api(`/v2/isPayCompleteWeixin`,{order_id: action.order_id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json && json.result && json.result.isComplete) {
      count = 0
      clearTimeout(countdown)
      EventCenter.emit('isPayCompleteWeixinDone');
      return 'completed'
    }else{
      throw 'Not completed'
    }
  }).catch( (ex) => {
    if (ex) {
      if (count < 7) {
        countdown = setTimeout(()=>{
          count = count+1
          doisPayCompleteWeixin(action);
        }, 5000);
      }else {
        count = 0
        clearTimeout(countdown)
        EventCenter.emit('isPayCompleteWeixinError');
      }
    if(__DEBUG__) console.log('Fetch failed', ex);
    }
  });
}

//专题课微信支付
export function domakeOrderPayWeixin(action) {
  fetch(dm.getUrl_api(`/v2/makeOrderPayWeixin`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resource_type: 7,
      resource_id:action.resource_id,
      term: 1,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json.err) {
      EventCenter.emit('makeOrderPayWeixinDone', json);
      return false
    }
    if(json.result && json.result.signInfo){
      var signInfo = json.result.signInfo;
      var orderId = json.result.orderId
        // alert(signInfo);
        // assign(signInfo, {
        //     appId: dm.getWXAppId()
        // });
        function onBridgeReady(){
           WeixinJSBridge.invoke(
               'getBrandWCPayRequest',
               signInfo,
               function(res){
                   var last=JSON.stringify(res)
                   if(res.err_msg === "get_brand_wcpay_request:ok" ) { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                        //TODO: ajax check pay status from backend!!!
                        // alert('支付成功');
                        EventCenter.emit('makeOrderPayWeixinDone',
                            {status: true,orderId: orderId}
                        );
                   } else {
                        alert('支付失败');
                   }
                  //  EventCenter.emit('makeOrderPayWeixinDone', {status: true});
               }
           );
        }
        if (typeof WeixinJSBridge == "undefined"){
           if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
           }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
           }
        }else{
           onBridgeReady();
        }
    }
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const PayStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
