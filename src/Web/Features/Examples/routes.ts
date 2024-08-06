import { RouteRecordRaw } from 'vue-router'
import ComponentsView from './Components/ComponentsView.vue'
import IconView from './Icons/IconView.vue'
import ModalsView from './Modals/ModalsView.vue'
import TableView from './Tables/TableView.vue'

export const exampleRoutes: RouteRecordRaw[] = [
  {
    path: '/examples',
    meta: { title: 'Examples' },
    children: [
      {
        path: 'tables',
        component: TableView,
        meta: { title: 'Tables' }
      },
      {
        path: 'components',
        component: ComponentsView,
        meta: { title: 'Components' }
      },
      {
        path: 'icons',
        component: IconView,
        meta: { title: 'Icons' }
      },
      {
        path: 'modals',
        component: ModalsView,
        meta: { title: 'Modals' }
      },
    ]
  }
]