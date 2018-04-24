<template>
  <div class="loading">
    <img :src="require('common/img/loading.gif')" class="img">
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在加载...'
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'

  .loading
    text-align: center
    .img
      width: 24px
      height: 24px
    .title
      line-height: 20px
      font-size: $font-size-small
      color: $text-color-l
</style>
