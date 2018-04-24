<template>
  <div class="music-list">
    <div class="title">
      <div class="icon-back" @click="handleBackClick"></div>
      {{title}}
    </div>
    <div
      class="muscic-top"
      :style="'background-image:url('+bgimg+')'"
      ref="muscicTop">
      <div class="play-wrapper" v-show="playShow" @click="handlePlayAllClick">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="scrollContainer" ref="scrollContainer">
      <scroll
        class="scroll"
        :data="songList"
        ref="scroll"
        :listenScroll="listenScroll"
        @scroll="handleScroll"
        :probeType="probeType">
        <song-list :songList="songList"></song-list>
      </scroll>
      <div class="loading-container" v-show="!songList.length" ref="loading">
        <loading class="loading"></loading>
      </div>
    </div>
    <div class="scroll-cover" ref="scrollCover"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SongList from '@/base/song-list'
import Scroll from '@/base/scroll'
import Loading from '@/base/loading'
import { playListMixin } from 'common/js/mixin'

const TITLE_HEI = 44

export default {
  name: 'music-list',
  mixins: [playListMixin],
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    songList: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgimg: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.coverEl = this.$refs.scrollCover
    this.scrollContainerEl = this.$refs.scrollContainer
    this.muscicTop = this.$refs.muscicTop
    this.loading = this.$refs.loading
    this._setScrollHeight()
  },
  data () {
    return {
      listenScroll: true,
      probeType: 3,
      playShow: true
    }
  },
  computed: {
    topHei () {
      return this.$refs.muscicTop.offsetHeight
    }
  },
  methods: {
    ...mapActions(['randomPlay']),
    handleBackClick () {
      this.$router.go(-1)
    },
    handleScroll (pos) {
      let scale = 1 + pos.y / this.topHei
      if (scale > 1) {
        this.muscicTop.style.transform = `scale(${scale})`
      }
      if (-pos.y <= this.topHei - TITLE_HEI) {
        this.coverEl.style.zIndex = 1
        this.coverEl.style.top = this.topHei + pos.y + 'px'
        this.playShow = true
        this.muscicTop.style.paddingBottom = '70%'
        this.muscicTop.style.zIndex = 1
      } else {
        this.coverEl.style.top = TITLE_HEI + 'px'
        this.muscicTop.style.paddingBottom = TITLE_HEI + 'px'
        this.playShow = false
        this.muscicTop.style.zIndex = 9
      }
    },
    handlePlayAllClick () {
      this.randomPlay(this.songList)
    },
    _setScrollHeight () {
      this.scrollContainerEl.style.top = this.topHei + 'px'
      this.coverEl.style.top = this.topHei + 'px'
      this.loading.style.top = this.topHei + 'px'
    },
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? 60 : 0
      this.$refs.scrollContainer.style.bottom = bottom + 'px'
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .music-list
    position: fixed
    z-index: 4
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
    .title
      position: absolute
      z-index: 10
      top: 0
      width: 100%
      height: 44px
      line-height: 44px
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
      no-wrap()
      font-weight: bold
      .icon-back
        position absolute
        top: 0
        left: 6px
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .muscic-top
      position: relative
      height: 0
      padding-bottom: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        z-index: 10
        bottom: 20px
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .scrollContainer
      position: fixed
      z-index: 2
      top: 300px
      left: 0
      right: 0
      bottom: 0
      .scroll
        height: 100%
      .loading-container
        position: fixed
        bottom: 0
        left: 0
        right: 0
        .loading
          position: absolute
          top: 50%
          left: 0
          right: 0
          transform: translateY(-50%)
    .scroll-cover
      position: fixed
      left: 0
      right: 0
      bottom: 0
      background: $color-background
</style>
