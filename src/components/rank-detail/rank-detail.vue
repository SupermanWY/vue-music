<template>
  <div class="rank-detail">
    <music-list :title="topInfo.topTitle" :bgimg="topInfo.picUrl" :songList="songList"></music-list>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSong } from '@/api/singerDetail'
import { getMusicList } from '@/api/rank'
import MusicList from '@/base/music-list'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['topInfo'])
  },
  created () {
    this._getMusicList()
  },
  data () {
    return {
      songList: []
    }
  },
  methods: {
    _getMusicList () {
      if (!this.topInfo.id) {
        this.$router.push('/rank')
        return
      }

      getMusicList(this.topInfo.id)
        .then(this.handleGetMusicListSucc.bind(this))
    },
    handleGetMusicListSucc (res) {
      res.songlist.forEach((item) => {
        this.songList.push(createSong(item.data))
      })
      console.log(this.songList)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'

  .rank-detail
    position: fixed
    z-index: 4
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>
