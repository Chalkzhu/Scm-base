import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom'
import config from './config';
import KeepAlive from 'react-activation';

// 路由处理方式
const changeRouter = (routers) => {
  return routers.map(item => {
    if (item.children) {
      item.children = changeRouter(item.children)
    }
    item.element = (
      <>
        <KeepAlive when={true} id={item.path} name={item.path}>
          <Suspense fallback={<div>加载中...</div>}>
            {/* 把懒加载的异步路由变成组件装载进去 */}
            <item.component />
          </Suspense>
        </KeepAlive>
      </>
    )
    return item

    // const obj = {
    //   path: item.path,
    //   element: <Suspense fallback={<div>加载中...</div>}><item.component /></Suspense>,
    // }
    // if (item.children) {
    //   obj.children = changeRouter(item.children)
    // }
    // return obj
  })
}


// 必须这样子，不然会报什么hook错误的问题
const Router = () => useRoutes(changeRouter(config))

export default Router
