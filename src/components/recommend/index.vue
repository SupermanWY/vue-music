<template>
  <div class="scroll-container" ref="scrollContainer">
    <scroll :data="discList" class="scroll" ref="scroll">
      <div>
        <slider v-if="sliderList.length" class="slider">
          <div v-for="item in sliderList" :key="item.id">
            <a :href="item.linkUrl">
              <img
                :src="item.picUrl"
                alt=""
                class="slider-img needsclick"
                @load="handleImgOnload">
            </a>
          </div>
        </slider>
        <div class="recommend-list">
          <h2 class="recommend-title">热门推荐</h2>
          <ul>
            <li
              class="item"
              v-for="item in discList"
              :key="item.id"
              @click="onLinkToDisc(item)">
              <div class="img-con">
                <img v-lazy="item.imgurl" class="img">
              </div>
              <div class="text">
                <div class="name">{{item.creator.name}}</div>
                <div class="desc">{{item.dissname}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getDiscList, getSliderInfo } from '@/api/recommend'
import Slider from 'base/slider'
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      sliderList: [],
      discList: [],
      checkLoaded: false
    }
  },
  methods: {
    ...mapMutations(['setDisc']),
    getSliderInfo () {
      getSliderInfo()
        .then(this.handleGetSliderInfoSucc.bind(this))
        .catch(this.handleGetSliderInfoErr.bind(this))
    },
    getDiscList () {
      getDiscList().then(this.handleGetDiscListSucc.bind(this))
    },
    handleGetSliderInfoSucc (res) {
      res.data && (res = res.data)
      if (res.code === 0) {
        res.data && (res = res.data)
        res.slider && (this.sliderList = res.slider)
      } else {
        this.handleGetSliderInfoErr()
      }
    },
    handleGetSliderInfoErr () {
      console.log('获取数据错误')
    },
    handleGetDiscListSucc (res) {
      let data = {}
      res.data && (data = res.data)
      if (data.code === 0) {
        this.discList = data.data.list
      }
    },
    handleImgOnload () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? 60 : 0
      this.$refs.scrollContainer.style.bottom = bottom + 'px'
      this.$refs.scroll.refresh()
    },
    onLinkToDisc (item) {
      this.setDisc(item)
      this.$router.push('/recommend/disc/' + item.dissid)
    }
  },
  created () {
    this.getSliderInfo()
    this.getDiscList()
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.scroll-container
  position: fixed
  top: 88px
  left: 0
  right: 0
  bottom: 0
  .slider
    height: 0
    padding-bottom: 40%
    overflow: hidden
    .slider-img
      width: 100%
  .scroll
    height: 100%
    overflow: hidden
  .recommend-list
    .recommend-title
      line-height: 65px
      text-align: center
      font-size: $font-size-medium
      color: $color-theme
    .item
      display: flex
      padding: 0 20px 20px
      .img-con
        padding-right: 20px
        .img
          display: block
          width: 60px
          height: 60px
      .text
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        line-height: 20px
        font-size: $font-size-medium
        overflow: hidden
        .name
          margin-bottom: 10px
          color: $color-text
          no-wrap()
        .desc
          color: $color-text-d
          no-wrap()
    .loading-container
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
</style>
