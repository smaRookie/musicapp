import jsonp from './../common/js/jsonP'
import {comParam, options} from './config'

export function getSinger () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  let data = Object.assign({}, comParam, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

export function getSingerDetail (singerId) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let data = Object.assign({}, comParam, {
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}
