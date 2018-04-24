<template>
  <div>
    <list-view :singerList="singerListComputed"></list-view>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import ListView from './listView'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',
  components: {
    ListView
  },
  data () {
    return {
      singerList: []
    }
  },
  computed: {
    singerListComputed () {
      const map = {
        hot: {
          title: HOT_NAME,
          list: []
        }
      }
      this.singerList.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.list.push({
            id: item.Fsinger_mid,
            imgurl: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
            name: item.Fsinger_name
          })
        }

        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            list: []
          }
        }
        map[key].list.push({
          id: item.Fsinger_mid,
          imgurl: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
          name: item.Fsinger_name
        })
      })

      const arr = []
      for (let key in map) {
        if (key === 'hot' || !key.match('[a-zA-Z]')) {
          continue
        }
        arr.push(map[key])
      }
      arr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      arr.unshift(map.hot)
      return arr
    }
  },
  methods: {
    _getSinerList () {
      getSingerList()
        .then(this.handleGetSingerListSucc.bind(this))
    },
    handleGetSingerListSucc (res) {
      if (res.code === 0) {
        res.data && (res = res.data)
        res.list && (this.singerList = res.list)
      } else {
        this.handleGetSingerListErr()
      }
    },
    handleGetSingerListErr () {
      console.log('获取信息错误')
    }
  },
  created () {
    this._getSinerList()
  }
}
</script>

<style scoped lang="stylus">

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  .scroll
    position: absolute
    top: 88px
    left: 0
    rigth: 0
    bottom: 0
</style>
