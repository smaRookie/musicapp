import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer.vue'
import Rank from '@/components/rank/rank.vue'
import Search from '@/components/search/search.vue'
import Disc from '@/components/disc/disc.vue'
import SingerDetail from '@/components/singer-detail/singerDetail'
import TopList from '@/components/top-list/top-list'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Recommend',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
