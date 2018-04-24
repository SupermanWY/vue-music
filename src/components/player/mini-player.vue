<template>
  <transition name="mini">
    <div class="mini-player" @click="handleMiniPlayerClick">
      <div class="icon">
        <img width="40" height="40" :src="currentSong.image" :class="canCdRotate">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control" @click.stop="handlePlayIconClick">
        <ProgressCircle :precent="precent" class="progress-circle">
          <i class="icon-mini" :class="playIcon"></i>
        </ProgressCircle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProgressCircle from './progress-circle'

export default {
  name: 'mini-player',
  components: {
    ProgressCircle
  },
  props: {
    currentSong: {
      type: Object
    },
    precent: {
      type: Number,
      default: 0
    },
    playList: {
      type: Array
    }
  },
  computed: {
    ...mapGetters(['playing']),
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    canCdRotate () {
      return this.playing ? 'play' : 'play pause'
    }
  },
  methods: {
    ...mapMutations(['setPlaying']),
    handleMiniPlayerClick () {
      this.$emit('fullScreen')
    },
    handlePlayIconClick () {
      this.setPlaying(!this.playing)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 50px
      width: 50px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .progress-circle
        position: relative
        .icon-mini
          font-size: 32px
          position: absolute
          left: 50%
          top: 50%
          transform: translate(-50%, -50%)
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
