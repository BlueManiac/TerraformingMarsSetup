import { RouteRecordRaw } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes'
import BoardView from './Board/BoardView.vue'
import { exampleRoutes } from './Examples/routes'
import HomeView from './Home/HomeView.vue'
import NotFound from '/Components/Views/NotFound.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    id?: string
    parentId?: string
    fullPath?: string
    centered?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/board',
    component: BoardView,
    meta: { title: 'Board' }
  },
  ...exampleRoutes,
  ...autoRoutes,
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
  }
]