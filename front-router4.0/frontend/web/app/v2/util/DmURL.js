var util =  require('util'),
    f = util.format;
var URL = require('url');
var querystring = require('querystring');
var _P_HTTP = 'http://';
var _P_HTTPS = getCurrentUrlProtocal() == 'https:' ? 'https://' : 'http://';

export function getCurrentUrlProtocal() {
	var url = URL.parse(location.href, true);
  console.log('protocal: ', url.protocol);
  return url.protocol;
}

function getCurrentUrlWithNocache() {
	var url = URL.parse(location.href, true);
	var q = getUrlQueryFromSearch(url.search) || {};
	url.search = '?'+querystring.stringify(Object.assign({}, q, {
		ts_nocache: Date.now()
	}));
	return URL.format(url);
}

export function makeSureCurrentUrlSaveForWeixinShare() {
	var url = URL.parse(location.href, true);
	var q = getUrlQueryFromSearch(url.search) || {};
  if (q.from || q.isappinstalled) {
    // delete q.from
    // delete q.isappinstalled
    // let str_q = querystring.stringify(q)
    url.search = ''//str_q.length > 0 ? `?${str_q}` : '' ;
    document.location.href = URL.format(url)
  }
}

function getWXAppId(){
	return 'wx340b3ed76d012992';
}

function getUrlQueryFromSearch(queryStr){
    return querystring.parse(queryStr.replace('?', ''));
}

function getCurrentUrlQuery() {
    return getUrlQueryFromSearch(location.search || '');
}

var credentials;
function saveCredentials(new_credt){
    var _credentials = {};
    var q = getCurrentUrlQuery();
    if(!new_credt){
        if(q.openid && q.code){
        	new_credt = q;
        }
    }
    if(new_credt){
        if(new_credt.code) {
            _credentials.code = new_credt.code;
        }
        if(new_credt.openid){
            _credentials.openid = new_credt.openid;
        }
        localStorage.setItem("credentials.code", _credentials.code);
        localStorage.setItem("credentials.openid", _credentials.openid);
    }
    return _credentials;
}

var specialCode;
function getSpecialCode(){
	specialCode = localStorage.getItem("specialCode") || '';
	return {'specialCode': specialCode};
}

function getCredentials(){
	if(!credentials) {
		credentials = saveCredentials();
	}
    credentials.code = localStorage.getItem("credentials.code") || (isWeiXin ? '' : ""); //For Not login user
    credentials.openid = localStorage.getItem("credentials.openid") || (isWeiXin ? '' : ""); //For Not login user
    return credentials;
}

function clearCredentials(){
	credentials = null;
  //localStorage.clear()
  localStorage.removeItem('resourceId');
  localStorage.removeItem('specialCode');
  localStorage.removeItem('user_image');
  localStorage.removeItem('user');
  localStorage.removeItem('phash_before_auth');
  localStorage.removeItem('psearch_before_auth');
  localStorage.removeItem('credentials.code');
  localStorage.removeItem('credentials.openid');
  localStorage.removeItem('weixinUser');
  localStorage.removeItem('DownloadAppTime');
  localStorage.removeItem('wailian');
  localStorage.removeItem('ts_sw_last');
  localStorage.removeItem('dWTime');
  localStorage.removeItem('addressName');
  localStorage.removeItem('citydefaultCity');
  localStorage.removeItem('headersCity');
  localStorage.removeItem('bolueClient');
  localStorage.removeItem('UUIDIMEI')
  localStorage.removeItem('devToken')
  localStorage.removeItem('bindInfo')
  localStorage.removeItem('newbieTaskIndex')
  localStorage.removeItem('perfectInfo')
  localStorage.removeItem('auditKeyWordData')
  localStorage.removeItem('addressNameData')
  localStorage.removeItem('CatalogIdx')
  localStorage.removeItem('lawSearchKeWord')
  localStorage.removeItem('splitWords')
  localStorage.removeItem('AndroidNoMoreAlert')
	localStorage.removeItem('myKeyWordData')
}

function getHttpHeadMyAuth(){
  return {
    MyAuth: JSON.stringify(getCredentials())
  };
}

var _DOMAIN_ROOT = 'bolue.cn';
var _DOMAIN_API = 'apim.bolue.cn';
var domainDist = {
	protocal: _P_HTTP,
	protocal_3w: _P_HTTP,
	protocal_rs: _P_HTTP,
	protocal_api: _P_HTTPS,
	protocal_home: _P_HTTPS,
	protocal_img: _P_HTTPS,
	dm_root: _DOMAIN_ROOT,
	dm_home: `mb.${_DOMAIN_ROOT}`,
	dm_3w: `www.bolue.cn`,
	dm_rs: `mb.${_DOMAIN_ROOT}`,
	dm_img: `mb.${_DOMAIN_ROOT}`,
	dm_api: `apim.${_DOMAIN_ROOT}`,
	subdir_api: ''
}

//var _LOCAL_HOST = '10.10.30.78';
//本地ip
// var _LOCAL_HOST = '192.168.3.218';
var _LOCAL_HOST = 'localhost';
var domainDev = {
	protocal: _P_HTTP,
	protocal_3w: _P_HTTP,
	protocal_rs: _P_HTTP,
	// protocal_api: 'https://',
  protocal_api: _P_HTTP,
	protocal_home: _P_HTTP,
	protocal_img: _P_HTTP,
	dm_root: _LOCAL_HOST,
	dm_home: _LOCAL_HOST+':8080',
	dm_3w: `www.bolue.cn`,
	dm_rs: _LOCAL_HOST+':8080',
	dm_img : _LOCAL_HOST+':8080',
  //dm_api: '10.10.20.132:8010',
  // dm_api: '10.10.88.80:8000',
	// dm_api: 'localhost:8000',//改为本机IP
  // dm_api: '10.10.88.17:8010',//改为本机IP
  // dm_api: `api.${_DOMAIN_ROOT}/alpha`,
	dm_api: `apim.${_DOMAIN_ROOT}/test`,
	// dm_api: `10.10.30.221:8000`,
  // dm_api: `10.10.30.180:8010`,
  // dm_api: 'apim.bolue.cn',
	subdir_api: ''
}

var domainTest = {
	protocal: _P_HTTP,
	protocal_3w: _P_HTTP,
	protocal_rs: _P_HTTP,
	protocal_api: _P_HTTPS,
	protocal_home: _P_HTTPS,
	protocal_img: _P_HTTPS,
	dm_root: _DOMAIN_ROOT,
	dm_home: `mb.${_DOMAIN_ROOT}/test`,
	dm_3w: `10.10.30.95`,
	dm_rs: `mb.${_DOMAIN_ROOT}`,
	dm_img: `mb.${_DOMAIN_ROOT}/test`,
	dm_api: `apim.${_DOMAIN_ROOT}/test`,

	subdir_api: ''

}
var domainAlpha = {
	protocal: _P_HTTP,
	protocal_3w: _P_HTTP,
	protocal_rs: _P_HTTP,
	protocal_api: _P_HTTPS,
	protocal_home: _P_HTTPS,
	protocal_img: _P_HTTPS,
	dm_root: _DOMAIN_ROOT,
	dm_home: `mb.${_DOMAIN_ROOT}/alpha`,
	dm_3w: `www.bolue.cn`,
	dm_rs: `mb.${_DOMAIN_ROOT}`,
	dm_img: `mb.${_DOMAIN_ROOT}/alpha`,
	dm_api: `apim.${_DOMAIN_ROOT}/alpha`,

	subdir_api: ''
}

let NODE_ENV = process.env.NODE_ENV || 'dev';
global.__DEBUG__ = NODE_ENV !== 'production';

function getDomain(){
	switch(NODE_ENV) {
		case 'production': return domainDist; break;
		case 'test': return domainTest; break;
		case 'alpha': return domainAlpha; break;
		case 'dev':
		default: return domainDev;
	}
}

function formatUrl(path, params){
    if(!params){
      return URL.format(path);
    }
    var url = URL.parse(path, true);
    var q = getUrlQueryFromSearch(url.search) || {};
    url.search = '?'+querystring.stringify( Object.assign({}, q, params || {} ) );
    return URL.format(url);
}

export const dm = Object.assign({}, getDomain(), {
	surPath: function(path){
		return (path ? path : '');
	},
	//get path in api domain
	getUrl_api: function(path, params){
		return formatUrl( this.protocal_api + this.dm_api + this.subdir_api + this.surPath(path), params);
	},
	//get path in root domain
	getUrl_dm: function(path, params){
		return formatUrl( this.protocal + this.dm_root + this.surPath(path), params );
	},
	getUrl_home: function(path, params){
		return formatUrl( this.protocal_home + this.dm_home + this.surPath(path), params);
	},
	//get path in www domain
	getUrl_3w: function(path, params){
		return formatUrl( this.protocal_3w + this.dm_3w + this.surPath(path), params);
	},
	//get path in rs domain
	getUrl_rs: function(path, params){
		return formatUrl( this.protocal_rs + this.dm_rs + this.surPath(path), params);
	},
	//get path in img domain
	getUrl_img: function(path, params){
		return formatUrl( this.protocal_img + this.dm_img + this.surPath(path), params);
	},
	getUrlQueryFromSearch: getUrlQueryFromSearch,
	getCurrentUrlQuery: getCurrentUrlQuery,
	saveCredentials: saveCredentials,
	getCredentials: getCredentials,
	clearCredentials: clearCredentials,
	getHttpHeadMyAuth: getHttpHeadMyAuth,
	getWXAppId: getWXAppId,
	formatUrl: formatUrl

});
export default dm;
