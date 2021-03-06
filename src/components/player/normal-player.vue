<template>
  <transition
    name="normal"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <div class="normal-player">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="handleBackClick">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle">
        <slider :loop="false" :autoplay="false" style="height: 100%">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="canCdRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="scroll" :data="lyric && lyric.lines">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine"
                   class="text"
                   v-for="(line,index) in lyric.lines"
                   :key="index"
                   :class="{'current':index===currentLineNum}">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </slider>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :precent="precent"
              @precentChange="handlePrecentChange">
            </progress-bar>
          </div>
          <span class="time time-r">{{format(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="handleModeIconClick"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="handlePrevPlayClick"></i>
          </div>
          <div class="icon i-center">
            <i :class="cdPlayingIcon" @click="handlePlayIconClick"></i>
          </div>
          <div class="icon i-right" @click="handleaNextPlayClick">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Slider from 'base/slider'
import Scroll from 'base/scroll'
import ProgressBar from './progress-bar'
import animations from 'create-keyframe-animation'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'normal-player',
  components: {
    Slider,
    ProgressBar,
    Scroll
  },
  props: {
    currentSong: {
      type: Object
    },
    isSongReady: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: Number,
      default: 0
    },
    precent: {
      type: Number,
      default: 0
    },
    lyric: {
      type: Object,
      default: null
    },
    currentLineNum: {
      type: Number,
      default: 0
    },
    playingLyric: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['currentIndex']),
    ...mapGetters(['playing', 'playList', 'mode']),
    cdPlayingIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    canCdRotate () {
      return this.playing ? 'play' : 'play pause'
    },
    modeIcon () {
      return this.mode === 0 ? 'icon-sequence' : (this.mode === 1 ? 'icon-loop' : 'icon-random')
    }
  },
  watch: {
    currentLineNum (newLineNum) {
      if (newLineNum < 5) {
        this.$refs.scroll.scrollToElement(this.$refs.lyricLine[0])
      } else {
        this.$refs.scroll.scrollToElement(this.$refs.lyricLine[newLineNum - 5])
      }
    }
  },
  methods: {
    ...mapMutations(['setPlaying', 'setCurrentIndex', 'setMode']),
    handleBackClick () {
      this.$emit('close')
    },
    handlePlayIconClick () {
      this.setPlaying(!this.playing)
    },
    handlePrevPlayClick () {
      if (!this.isSongReady) {
        return
      }
      let currentIndex = this.currentIndex
      if (this.currentIndex === 0) {
        this.setCurrentIndex(this.playList.length - 1)
        return
      }
      this.setCurrentIndex(--currentIndex)

      this.$emit('play')
    },
    handleaNextPlayClick () {
      if (!this.isSongReady) {
        return
      }
      let currentIndex = this.currentIndex
      if (this.currentIndex === this.playList.length - 1) {
        this.setCurrentIndex(0)
        return
      }
      this.setCurrentIndex(++currentIndex)

      this.$emit('play')
    },
    handlePrecentChange (precent) {
      const currentTime = this.currentSong.duration * precent
      this.$emit('currentTimeChange', currentTime)
    },
    handleModeIconClick () {
      this.setMode((this.mode + 1) % 3)
    },
    format (time) {
      let minute = time / 60 | 0
      let secend = time % 60 | 0
      minute = minute < 10 ? '0' + minute : minute
      secend = secend < 10 ? '0' + secend : secend
      return minute + ':' + secend
    },
    _getPosAndScale () {
      const leftDif = 40
      const bottomDif = 30
      const targetWidth = 40
      const topDif = 80
      const width = window.innerWidth * 0.8
      const x = -(window.innerWidth / 2 - leftDif)
      const y = window.innerHeight - topDif - width / 2 - bottomDif
      const scale = targetWidth / width
      return {
        x,
        y,
        scale
      }
    },
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      const animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 600,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .normal-player
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 80vw
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
        .playing-lyric-wrapper
          position: absolute
          bottom: -50px
          width: 100%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        width: 100%
        height: 100vw
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
