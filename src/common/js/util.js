function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 随机播放  打乱顺序
export function shuffle (arr) {
  let j, t
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    j = getRandomInt(0, i)
    t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}