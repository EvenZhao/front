import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

//积分商店列表
export function doPointShopList(action) {

  fetch(dm.getUrl_api(`/v2/pointShopList`),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('PointShopListDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//积分明细
export function doAccountPointDetail(action) {

  fetch(dm.getUrl_api(`/v2/accountPointDetail`,
    {
      skip:action.skip,
      limit:action.limit,//累加值20 本次为每20条数据为一分页
    }),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if(action.LoadMore){
      EventCenter.emit('AccountPointDetailLoadMoreDone', json);
    }
    else {
      EventCenter.emit('AccountPointDetailDone', json);
    }
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}
//积分兑换详情
export function doPointExchange(action) {

  fetch(dm.getUrl_api(`/v2/pointExchange`,
    {
      skip:action.skip,
      limit:action.limit,//累加值20 本次为每20条数据为一分页
    }),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if(action.LoadMore){
      EventCenter.emit('PointExchangeLoadMoreDone', json);
    }
    else {
      EventCenter.emit('PointExchangeDone', json);
    }
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//兑换商品
export function doExchangeGoods(action) {
  fetch(dm.getUrl_api(`/v2/exchangeGoods`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goodsId:action.goodsId,//商品ID
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('ExchangeGoodsDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//积分商品详情
export function doGoodsDetail(action) {

  fetch(dm.getUrl_api(`/v2/goodsDetail`,
    {
      id:action.id,//商品ID
    }),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('GoodsDetailDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//分享任务接口
export function doPostShareTask(action) {
  fetch(dm.getUrl_api(`/v2/postShareTask`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type:action.type,//8 视频课 / 9 直播课 / 10 线下课 / 11 专题课
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('PostShareTaskDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export const PointStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
