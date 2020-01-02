import {dm} from './util/DmURL.js'

let w3 = dm.getUrl_3w()

const urlsMapMb2Pc = {
  "/list/online": "/onlines/list/1",
  "/list/live": "/lives",
  "/list/offline": "/offlines/list/1",
  "/PgProductList": "/products/list/1",
  "/lesson/online": "/onlines",
  "/lesson/live": "/lives",
  "/lesson/offline": "/offlines",
  "/productDetail": "/products",
  "/activity/cwdzz20170330": "/html/cwexcel.html",
  "/activity/PgNonTrade20170516": "/html/fmfh.html",
  "/activity/RemittanceActivity20171102": "/html/hsqj.html",
  "/activity/PgPlatinumBrand20170504": "/html/linkedPage.html",
  "/activity/zrdj20170330": "/html/zrdj.html",
  "/activity/CimaIndex20170621": "/html/cgma.html",
  "/activity/CimaIndex20170621": "/html/CGMA/index.html",
  "/activity/PgActivityApp": "/html/apptg.html",
  "/activity/PgCimaPromotion": "/html/xuecima.html",
  "/resourceShare":"/resourceShare",
  "/PgOfflineJoinCodeDetail":"/PgOfflineJoinCodeDetail",
  "/TeacherCenter":"/teacher/list",
  "/LecturerHomePage":"/teacher/main/",
  "/Qa":"/question/list/1",
  "/QaDetail":"/question/toquestion",
}

export function jumpToPC(location) {
  let p = location.pathname.replace('/test', '').split('/')
  // console.log('jumpToPC-----',p);
  if (p.length <= 1 || p[1] == '') {
    location.assign(w3)
  }
  // let params = new URLSearchParams(location.search.slice(1))
  // params.append('fromMB', 1)
  let params =location.search.slice(1)
  //params.append('fromMB', 1)
  params += '&fromMB=1'
  for(var k in urlsMapMb2Pc){
   var kp = k.split('/')
   if(kp.length <= p.length && p.slice(0, kp.length).join('/') == kp.join('/')){
    let i_sub = p.length - kp.length
    let id = i_sub > 0 ? '/' + p[kp.length] : ''
    let pcurl = new URL(urlsMapMb2Pc[k] + id + '?' + params, w3)
    console.log('JUMP!!', pcurl.href)
    location.assign(pcurl)
    return
   }
  }
  // location.assign(w3)
}
