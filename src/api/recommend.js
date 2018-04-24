import axios from 'axios'
import { commonParams } from 'common/js/config'

export const getSliderInfo = () => {
  return axios.get('/api/slider', {
    params: {
      uin: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1518406420214,
      ...commonParams
    }
  })
}

export const getDiscList = () => {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
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
  })
}

export function getSongList (disstid) {
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })

  return axios.get('/api/getSongList', {
    params: data
  })
}
