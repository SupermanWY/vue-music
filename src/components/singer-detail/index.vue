<template>
  <music-list :songList="songList" :title="singer.name" :bgimg="singer.imgurl"></music-list>
</template>

<script>
import { mapState } from 'vuex'
import { getSingerDetail, createSong } from '@/api/singerDetail'
import MusicList from '@/base/music-list'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  created () {
    this._getDetail()
  },
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapState(['singer'])
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }

      getSingerDetail(this.singer.id)
        .then(this.handleGetSingerDetailSucc)
        .catch(this.handleGetSingerDetailErr)
    },
    handleGetSingerDetailSucc (res) {
      if (res.code === 0) {
        this.songList = res.data.list.map((item) => {
          return createSong(item.musicData)
        })
      } else {
        this.handleGetSingerDetailErr()
      }
    },
    handleGetSingerDetailErr () {
      console.log('返回信息错误')
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'

  .singer-detail
    position: fixed
    z-index: 4
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>
