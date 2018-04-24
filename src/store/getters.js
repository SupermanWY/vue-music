const getters = {
  playing (state) {
    return state.playing
  },
  fullScreen (state) {
    return state.fullScreen
  },
  playList (state) {
    return [...state.playList]
  },
  mode (state) {
    return state.mode
  },
  currentSong (state) {
    return state.playList[state.currentIndex] || {}
  },
  sequenceList (state) {
    return state.sequenceList
  },
  disc (state) {
    return state.disc
  },
  topInfo (state) {
    return state.topInfo
  }
}

export default getters
