export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

// 添加类名
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let arr = []
  arr = el.className.split('')
  arr.push(className)
  el.className = arr.join(' ')
}

// 获取以'data-'开头的属性值或者设置以'data-'开头属性值
export function getData (el, name, val) {
  let prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}
