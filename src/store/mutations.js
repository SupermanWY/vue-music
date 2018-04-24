const mutations = {
  changeSinger (state, singer) {
    state.singer = { ...singer }
  },
  setPlaying (state, playing) {
    state.playing = playing
  },
  setFullScreen (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setPlayList (state, playList) {
    state.playList = [...playList]
  },
  setMode (state, mode) {
    state.mode = mode
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setSequenceList (state, list) {
    state.sequenceList = [...list]
  },
  setDisc (state, disc) {
    state.disc = {...disc}
  },
  setTopInfo (state, topInfo) {
    state.topInfo = {...topInfo}
  }
}

export default mutations
