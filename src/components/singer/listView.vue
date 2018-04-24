<template>
  <div>
    <loading  v-show="!singerList.length"></loading>
    <div class="fixedTitle" ref="fixedTitle" v-show="fixedTitleShow">{{fixedTitle}}</div>
    <div class="scroll-container" ref="scrollContainer">
      <scroll
        :data="singerList"
        class="scroll"
        ref="scroll"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="handleScroll"
      >
        <ul class="list">
          <li
            class="item"
            v-for="(item,index) in singerList"
            :key="index"
            ref="singerItem">
            <h2 class="title">{{item.title}}</h2>
            <div
              class="singer"
              v-for="innerItem in item.list"
              :key="innerItem.id"
              @click="onLinkToDetail(innerItem)">
              <div class="img-con">
                <img v-lazy="innerItem.imgurl" alt="" class="img">
              </div>
              <div class="singer-name">{{innerItem.name}}</div>
            </div>
          </li>
        </ul>
        <ul class="list-nav" @touchmove="handleNavListTouchmove" ref="navList">
          <li
            v-for="(item,index) in navList"
            :key="index"
            class="item needsclick"
            @click="handleNavItemClick"
            :data-index="index"
            ref="navItem"
            :class="{'current': currentIndex === index}">{{item}}</li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin'

export default {
  mixins: [playListMixin],
  name: 'list-view',
  components: {
    Scroll,
    Loading
  },
  props: {
    singerList: {
      type: Array
    }
  },
  created () {
    this.listenScroll = true
    this.probeType = 3
  },
  data () {
    return {
      currentIndex: 0,
      fixedTitle: '热门',
      fixedTitleShow: true
    }
  },
  computed: {
    navList () {
      return this.singerList.map((item) => {
        return item.title.substring(0, 1)
      })
    },
    navItemOneTop () {
      const navHeight = this.$refs.navList.offsetHeight
      return this.$refs.navList.offsetTop + 108 - navHeight / 2
    },
    navItemHeight () {
      return this.$refs.navItem[0].offsetHeight
    },
    singerListHeight () {
      const arr = []
      let height = 0
      this.$refs.singerItem.forEach((item, index) => {
        height += item.offsetHeight
        arr.push(height)
      })
      return arr
    }
  },
  watch: {
    currentIndex () {
      this.fixedTitle = this.singerList[this.currentIndex].title
    }
  },
  methods: {
    handleNavItemClick (e) {
      this.currentIndex = parseInt(e.target.getAttribute('data-index'), 10)
      const el = this.$refs.singerItem[this.currentIndex]
      this.$refs.scroll.scrollToElement(el, 500)
    },
    handleNavListTouchmove (e) {
      let diff = e.touches[0].pageY - this.navItemOneTop
      let index = Math.floor(diff / this.navItemHeight)
      if (index < 0 || index >= this.singerList.length) {
        return
      }
      this.currentIndex = Math.min(this.$refs.navItem.length, Math.max(0, index))
      const el = this.$refs.singerItem[this.currentIndex]
      this.$refs.scroll.scrollToElement(el)
    },
    handleScroll (pos) {
      for (let i = 0; i < this.singerListHeight.length; i++) {
        let item = this.singerListHeight[i]
        if (item > -pos.y) {
          this.currentIndex = i
          break
        }
      }

      let dif = pos.y + this.singerListHeight[this.currentIndex]
      if (dif > 0 && dif < 30) {
        this.$refs.fixedTitle.style.top = 88 - 30 + dif + 'px'
      } else {
        this.$refs.fixedTitle.style.top = 88 + 'px'
      }

      if (pos.y > 0) {
        this.fixedTitleShow = false
      } else {
        this.fixedTitleShow = true
      }
    },
    ...mapMutations(['changeSinger']),
    onLinkToDetail (singer) {
      this.$router.push('/singer/singerdetail/' + singer.id)

      this.changeSinger(singer)
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
  @import "~common/stylus/variable"
  .fixedTitle
    position: absolute
    z-index: -1
    top: 88px
    left: 0
    right: 0
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
  .scroll-container
    position: fixed
    top: 88px
    left: 0
    right: 0
    bottom: 0
    .scroll
      height: 100%
      overflow: hidden
      .list
        .item
          .title
            height: 30px
            line-height: 30px
            padding-left: 20px
            font-size: $font-size-small
            color: $color-text-l
            background: $color-highlight-background
          .singer
            display: flex
            align-items: center
            padding: 20px 0 0 30px
            .img
              width: 50px
              height: 50px
              border-radius: 50%
            .singer-name
              margin-left: 20px
              color: $color-text-l
              font-size: $font-size-medium
      .list-nav
        position: absolute
        z-index: 30
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 20px
        padding: 20px 0
        border-radius: 10px
        text-align: center
        background: $color-background-d
        font-family: Helvetica
        .item
          padding: 3px
          line-height: 1
          color: $color-text-l
          font-size: $font-size-small
          &.current
            color: $color-theme
</style>
