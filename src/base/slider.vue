<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dot-container">
      <span
        class="dot"
        v-for="(item,index) in dot"
        :key="index"
        :class="{active: currentPageIndex===index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dot: [],
      currentPageIndex: 0
    }
  },
  methods: {
    setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.offsetWidth

      for (let el of this.children) {
        width += sliderWidth
        el.style.width = sliderWidth + 'px'
        addClass(el, 'slider-item')
      }

      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },

    initSlider () {
      this.scroll = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.1,
        snapSpeed: 400
      })

      if (this.autoplay) {
        this.play()
      }

      this.scroll.on('scrollEnd', () => {
        let index = this.scroll.getCurrentPage().pageX
        if (this.loop) {
          index -= 1
        }
        this.currentPageIndex = index

        if (this.autoplay) {
          clearTimeout(this.timer)
          this.play()
        }
      })
    },
    initDot () {
      this.dot = new Array(this.children.length)
    },
    play () {
      let index = this.scroll.getCurrentPage().pageX + 1
      this.timer = setTimeout(() => {
        this.scroll.goToPage(index, 0, 400)
      }, this.interval)
    },
    handleResize () {
      if (!this.scroll) {
        return
      }
      this.setSliderWidth(true)
      this.scroll.refresh()
    },
    bindResizeEvent () {
      this.handleResize = this.handleResize.bind(this)
      window.addEventListener('resize', this.handleResize)
    }
  },
  mounted () {
    this.setSliderWidth()
    this.initDot()
    this.initSlider()

    this.bindResizeEvent()
  },
  activated () {
    if (this.autoplay) {
      this.play()
    }
    this.bindResizeEvent()
  },
  deactivated () {
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped lang="stylus">
.slider
  position: relative
  overflow: hidden
  .slider-group
    white-space: nowrap
    .slider-item
      display: inline-block
  .dot-container
    position: absolute
    bottom: 10px
    width: 100%
    text-align: center
    .dot
      display: inline-block
      margin: 0 4px
      width: 6px
      height: 6px
      border-radius: 3px
      background: rgba(144, 144, 144, .8)
      &.active
        background: #fff
</style>
