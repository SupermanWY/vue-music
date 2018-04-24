import { getRandomInt } from 'common/js/util'

const actions = {
  selectPlay ({state, commit}, {list, index}) {
    commit('setPlayList', list)
    commit('setSequenceList', list)
    commit('setCurrentIndex', index)
    commit('setFullScreen', true)
  },
  randomPlay ({state, commit}, list) {
    commit('setCurrentIndex', getRandomInt(0, list.length))
    commit('setSequenceList', list)
    commit('setFullScreen', true)
    commit('setMode', 2)
  }
}

export default actions
