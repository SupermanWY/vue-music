<template>
  <music-list
    :title="disc.dissname"
    :bgimg="disc.imgurl"
    :songList="songList">
  </music-list>
</template>

<script>
import MusicList from '@/base/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommend'
import { createSong } from '@/api/singerDetail'

export default {
  name: 'disc',
  components: {
    MusicList
  },
  created () {
    this._getSongList()
  },
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters(['disc'])
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }

      getSongList(this.disc.dissid)
        .then(this.handleGetSongListSucc)
        .catch(this.handleGetSongListErr)
    },
    handleGetSongListSucc (res) {
      res.data.cdlist[0].songlist.forEach((item) => {
        if (item.songid && item.albumid) {
          this.songList.push(createSong(item))
        }
      })
    },
    handleGetSongListErr (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'

  .disc
    position: fixed
    z-index: 10
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>
