export const addClass = (el, className) => {
  if (hasClass(el, className)) {
    return
  }

  el.className += ' ' + className
}

export const hasClass = (el, className) => {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
