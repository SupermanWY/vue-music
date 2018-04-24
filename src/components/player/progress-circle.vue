<template>
  <div class="progress-circle">
    <canvas width="50" height="50" ref="canvas" class="canvas"></canvas>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'progress-circle',
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    this._initCanvas()
  },
  watch: {
    precent () {
      this._drawCircle()
    }
  },
  methods: {
    _initCanvas () {
      this.canvas = this.$refs.canvas
      this.context = this.canvas.getContext('2d')
      this.centerX = this.canvas.width / 2
      this.centerY = this.canvas.height / 2 + 1
    },
    _drawCircle () {
      const deg = this.precent * Math.PI * 2
      const endDeg = deg - Math.PI / 2
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.beginPath()
      this.context.arc(this.centerX, this.centerY, 15, -Math.PI / 2, endDeg, false)
      this.context.strokeStyle = '#ffcd32'
      this.context.lineWidth = 2
      this.context.stroke()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-circle
    .canvas
      position: relative
      z-index: 1
</style>
