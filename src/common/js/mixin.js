import { mapGetters } from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList () {
      this.handlePlayList(this.playList)
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('handlePlayList methods notdefind')
    }
  }
}
