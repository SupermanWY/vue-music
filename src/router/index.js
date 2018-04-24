import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank'
import Recommend from 'components/recommend'
import Search from 'components/search'
import Singer from 'components/singer'
import SingerDetail from 'components/singer-detail'
import Disc from 'components/disc'
import RankDetail from 'components/rank-detail/rank-detail'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/rank',
    component: Rank,
    children: [{
      path: 'rankdetail/:id',
      component: RankDetail
    }]
  }, {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: 'disc/:id',
      component: Disc
    }]
  }, {
    path: '/search',
    component: Search
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: 'singerdetail/:id',
      component: SingerDetail
    }]
  }]
})
