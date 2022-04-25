import { lazy } from 'react';
import { RadarChartOutlined } from '@ant-design/icons';
import Layout from '@/layouts';

// ts的定义
// export interface RouterBody {
//   name?: string,
//   path: string,
//   exact?: Boolean,
//   component?: any,
//   element?: any,
//   children?: Array<RouterBody>,
// }

const Router = [
  {
    path: '/',
    name: '组件',
    icon: <RadarChartOutlined />,
    component: Layout,
    children: [
      {
        path: '/filter',
        name: '过滤',
        icon: <RadarChartOutlined />,
        component: lazy(() => import('@/pages/Filter'))
      },
      {
        path: '/demo/easy',
        name: '简易表格',
        icon: <RadarChartOutlined />,
        component: lazy(() => import('@/pages/Demo/easy'))
      },
    ]
  },

]
export default Router
