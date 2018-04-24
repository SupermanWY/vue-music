import originJsonp from 'jsonp'

export const jsonp = (url, data, option) => {
  url += (url.indexOf('?') > -1 ? '&' : '?') + params(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export const params = (data) => {
  let url = ''
  for (let key in data) {
    if (data.hasOwnProperty) {
      let value = data[key] !== undefined ? data[key] : ''
      url += `&${key}=${encodeURIComponent(value)}`
    }
  }
  return url ? url.substring(1) : ''
}
