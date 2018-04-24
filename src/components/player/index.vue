<template>
  <div class="player" v-show="playList.length">
    <normal-player
      v-if="fullScreen"
      :currentSong="currentSong"
      :playListLenth="playList.length"
      :isSongReady="isSongReady"
      :currentTime="currentTime"
      :precent="precent"
      :lyric="lyric"
      :currentLineNum="currentLineNum"
      :playingLyric="playingLyric"
      @close="handleCloseNormalPlayer"
      @play="canPlay(false)"
      @currentTimeChange="handleCurrentTimeChange">
    </normal-player>
    <mini-player
      v-show="!fullScreen"
      :currentSong="currentSong"
      :precent="precent"
      :playList="playList"
      @fullScreen="handleOpenNormalPlayer">
    </mini-player>
    <audio
      :src="currentSong.url"
      ref="audio"
      @play="canPlay(true)"
      @timeupdate="handleTimeupdate">
    </audio>
  </div>
</template>
<script>
import NormalPlayer from './normal-player'
import MiniPlayer from './mini-player'
import { mapGetters, mapMutations } from 'vuex'
import { shuffle } from 'common/js/util'
import axios from 'axios'
import { Base64 } from 'js-base64'
import LyricParser from 'lyric-parser'

export default {
  name: 'player',
  components: {
    NormalPlayer,
    MiniPlayer
  },
  data () {
    return {
      isSongReady: false,
      currentTime: 0,
      precent: 0,
      lyric: {},
      currentLineNum: 0,
      playingLyric: ''
    }
  },
  computed: {
    ...mapGetters(['fullScreen', 'currentSong', 'playList', 'playing', 'mode', 'sequenceList'])
  },
  mounted () {
    this.audio = this.$refs.audio
  },
  watch: {
    playing () {
      this.$nextTick(() => {
        if (this.playing) {
          this.audio.play()
          this.lyric.seek && this.lyric.seek(this.currentTime * 1000)
        } else {
          console.log(123123)
          this.audio.pause()
          this.lyric.stop()
        }
      })
    },
    mode (newMode) {
      const currentSongId = this.currentSong.id
      if (newMode === 0) {
        this.setPlayList(this.sequenceList)
        this.playList.forEach((item, index) => {
          if (currentSongId === item.id) {
            this.setCurrentIndex(index)
          }
        })
      } else if (newMode === 2) {
        this.setPlayList(shuffle(this.sequenceList))
        this.playList.forEach((item, index) => {
          if (currentSongId === item.id) {
            this.setCurrentIndex(index)
          }
        })
      }
    },
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.lyric.stop && this.lyric.stop()
      this.$nextTick(() => {
        if (this.playing) {
          this.audio.play()
        } else {
          this.setPlaying(true)
        }
      })
      this.getLyric(newSong)
    },
    currentTime (newCurrentTime) {
      this.precent = newCurrentTime / this.currentSong.duration
    }
  },
  methods: {
    ...mapMutations(['setFullScreen', 'setPlaying', 'setPlayList', 'setCurrentIndex']),
    handleCloseNormalPlayer () {
      this.setFullScreen(false)
    },
    handleOpenNormalPlayer () {
      this.setFullScreen(true)
    },
    handleTimeupdate (e) {
      this.currentTime = e.target.currentTime
    },
    handleCurrentTimeChange (currentTime) {
      this.audio.currentTime = currentTime
      this.lyric.seek && this.lyric.seek(currentTime * 1000)
    },
    handleGetLyricSucc (res) {
      res.data && (res = res.data)
      if (res.code === 0) {
        const lyric = Base64.decode(res.lyric)
        this.lyric = new LyricParser(lyric, this.handleLyric.bind(this))
        if (this.playing) {
          this.lyric.play()
        }
      } else {
        this.handleGetLyricErr()
      }
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      this.playingLyric = txt
    },
    handleGetLyricErr () {
      console.log('返回信息错误')
    },
    getLyric (newSong) {
      axios.get('/api/lyric', {
        params: {
          songmid: newSong.mid
        }
      })
        .then(this.handleGetLyricSucc.bind(this))
        .catch(this.handleGetLyricErr.bind(this))
    },
    canPlay (state) {
      this.isSongReady = state
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
</style>
