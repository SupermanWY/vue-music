<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(song, index) in songList"
        :key="song.id"
        @click="handleSongClick(index)">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}}-{{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'song-list',
  props: {
    songList: {
      type: Array
    }
  },
  methods: {
    ...mapActions(['selectPlay']),
    handleSongClick (index) {
      this.selectPlay({
        list: this.songList,
        index
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .song-list
    padding: 20px
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
