import jsonp from './../common/js/jsonP'
import {comParam, options} from './config'
import axios from 'axios'

// 获取轮播图的数据
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, comParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  // jsonp 已经封装成了promise对象
  return jsonp(url, data, options)
}

// 歌单数据
export function getDiscList () {
  const url = '/api/getDiscList'
  let data = Object.assign({}, comParam, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
