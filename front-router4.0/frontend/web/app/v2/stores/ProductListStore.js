import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

let param = {}
var productListLoadMore = true
export function doOnProductList(action) {
  param = Object.assign({}, param, action);
  fetch(dm.getUrl_api(`/v2/productList`,{label_id: action.les_status.label_id,sort:action.les_status.sort, skip: action.les_status.skip, limit: action.les_status.limit}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('OnProductListDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doOnProductListLoadMore(action) {
  if (productListLoadMore) {
    productListLoadMore = false
  }else {
    return
  }
  var loadParam = {}
  loadParam = Object.assign({}, param, action.les_status);
  console.log("LOADPAR",loadParam)
  fetch(dm.getUrl_api(`/v2/productList`,{label_id: loadParam.label_id,sort:action.les_status.sort,skip: loadParam.skip, limit: loadParam.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('OnProductListLoadMoreDone', json);
    productListLoadMore = true
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doProductDetail(action) {
  // fetch((`http://localhost:8000/v2/onlineDetail`, {id: action.id}), {
  fetch(dm.getUrl_api(`/v2/productDetail/${action.id}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),

  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('ProductDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doaddProductRecord(action) {//取消报名
  fetch(dm.getUrl_api(`/v2/addProductRecord`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: action.product_id,
      learn_id: action.learn_id,
      learn_type: action.learn_type
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('addProductRecordDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}


function getParam(action) {
  var param = `?limit=${action.limit}`;

  if (action.skip !== undefined) {
    param = param + `&skip=${action.skip}`;
  }
  if (action.label_id !== undefined) {
    param = param + `&label_id=${action.label_id}`;
  }
  if (action.charge_type !== undefined) {
    param = param + `&charge_type=${action.charge_type}`;
  }
  if (action.online_id !== undefined) {
    param = param + `&online_id=${action.online_id}`;
  }
  return param;
}

export const ProductListStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
