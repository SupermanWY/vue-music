<template>
  <div class="progress-bar" @click="handleInnerBarClick">
    <div class="outer-bar" ref="outerBar">
      <div class="inner-bar" ref="innerBar">
      </div>
      <div
        class="progress-btn"
        ref="progressBtn"
        @touchmove="handleProgressBtnTochmove"
        @touchend="handleProgressBtnTochend"></div>
    </div>
  </div>
</template>

<script>
const PRGRESSBTN_WIDTH = 16

export default {
  name: 'progress-bar',
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    this.outerBar = this.$refs.outerBar
    this.innerBar = this.$refs.innerBar
    this.progressBtn = this.$refs.progressBtn
  },
  data () {
    return {
      isMoving: false
    }
  },
  computed: {
    leftDif () {
      return (window.innerWidth - this.outerBar.offsetWidth) / 2
    }
  },
  watch: {
    precent (newPrecent) {
      if (!this.isMoving) {
        const width = this.outerBar.offsetWidth - PRGRESSBTN_WIDTH
        this.innerBar.style.width = width * newPrecent + 'px'
        this.progressBtn.style.left = width * newPrecent + 'px'
      }
    }
  },
  methods: {
    handleInnerBarClick (e) {
      const dif = e.pageX - this.leftDif
      const precent = dif / this.outerBar.offsetWidth
      this.$emit('precentChange', precent)
    },
    handleProgressBtnTochmove (e) {
      this.isMoving = true
      const difWidth = e.touches[0].pageX - this.leftDif
      const maxWidth = this.outerBar.offsetWidth - PRGRESSBTN_WIDTH
      if (difWidth < 0 || difWidth > maxWidth) {
        return
      }
      this.innerBar.style.width = difWidth + 'px'
      this.progressBtn.style.left = difWidth + 'px'
      this.newPrecent = difWidth / maxWidth
    },
    handleProgressBtnTochend (e) {
      this.isMoving = false
      this.$emit('precentChange', this.newPrecent)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .progress-bar
    position: relative
    height: 30px
    margin: 10px
    .outer-bar
      position: absolute
      top: 50%
      transform: translateY(-50%)
      width: 100%
      height: 4px
      background: rgba(0, 0, 0, .3)
      .inner-bar
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn
        position: absolute
        top: -6px
        box-sizing: border-box
        width: 16px
        height: 16px
        border-radius: 15px
        border: 3px solid $color-text
        background: $color-theme
</style>
