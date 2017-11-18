import originjsonp from 'jsonp'

//  封装jsonp
/*
*  @url: 请求地址
*  @data: 请求参数
*  @option: 为原来的jsonp库的参数
* */
export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originjsonp(url, option, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function param (data) {
  let url = ''
  let value = ''
  for (let k in data) {
    value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
