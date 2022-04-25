# SCM-Web

> 软件配置管理：执行对相关程序的管理控制

## Build Setup

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ npm run start
$ yarn run start

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```



## 编码规范

> 涉及的技术栈均采用当前最新的版本和语法：

1. 涉及的技术栈均采用当前最新的版本和语法

   - 采用create-react-app版本V5.0 构建
   - 遵循ES6 + Eslit 语法
   - React版本V17.0.2
   - React-router-dom版本V6.2.1
   - Antd版本V4.18.2

2. 命名

   - css选择器名以 `_` 分割

   - `components` & `pages`  **下首个文件夹名** ：大驼峰

     **其之内** 的文件/文件夹命名：小驼峰



## React项目创建流程

> 使用 create-react-app 脚手架创建
>
> 全局安装脚手架：npm i -g create-react-app

1. `npx create-react-app <项目名>` 

   或者`yarn create react-app <项目名>`

2. 使用 yarn 包管理器

   必须 **Node >= 14** 如遇报错: `The engine "node" is incompatible with this module`

   执行：`yarn config set ignore-engines true` 忽略版本不兼容的问题

3. 依赖包对应版本

   ```js
   // 最新版本对应
   "dependencies": {
       "@craco/craco": "^6.4.3",
       "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
       "@testing-library/user-event": "^13.5.0",
    "antd": "^4.18.2",
       "craco-antd": "^1.19.0",
       "craco-less": "^2.0.0",
       "react": "^17.0.2",
       "react-dom": "^17.0.2",
       "react-router-dom": "^6.2.1",
       "react-scripts": "5.0.0",
       "web-vitals": "^2.1.3"
     },
   devDependencies： {
       "less": "^4.1.2",
       "less-loader": "^10.2.0",
     }
       
   ```
   



# 表格组件：Ck-Table

> 表格组件介绍

| 参数        | 说明           | 类型    | 可选                   | 默认值  |
| ----------- | -------------- | ------- | ---------------------- | ------- |
| data        | 行数据         | Array   |                        |         |
| columns     | 列数据         | Array   |                        |         |
| size        | 尺寸: 64/48/36 | String  | 'large'/'small'/'mini' | 'small' |
| resizable   | 是否可调整列宽 | Boolean |                        |         |
| height      | 表格高度       | Number  |                        |         |
| toolbar     | 工具栏         | Object  | setting/               |         |
| showFooter  | 是否显示表尾   | Boolean |                        |         |
| filterTypes | 过滤拓展       | Object  |                        |         |



> Ref获取表实例

| 属性               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| getCheckboxRecords | 获取当前已选中的行数据                                       |
| * tableInstance    | 表示实例对象,自定义操作时可能会用到（使用不当会造成表结构破坏） |
|                    |                                                              |



#### Column

| 参数     | 说明             | 类型       | 可选                        | 默认值 |
| -------- | ---------------- | ---------- | --------------------------- | ------ |
| Header    | 标题             | String/Jsx |                             |        |
| Cell     | 单元格           | String/Jsx |                             |        |
| Footer   | 页脚             | String/Jsx |                             |        |
| accessor | 键值             | String     |                             |        |
| width    | 宽度             | Number     |                             | 250    |
| minWidth | 最小宽度         | Number     |                             | 60     |
| maxWidth | 最大宽度         | Number     |                             |        |
| fixed    | 固定位置         | String     | 'left'/'right'              |        |
| type     | 基础类型         | String     | 'checkbox'/'seq'            |        |
| visible  | 默认是否显示     | Boolean    |                             | true   |
| sort     | 是否启用排序     | Boolean    |                             |        |
| filter   | 过滤类型         | String     | 'checkbox'/'select'/'input' |        |
| Filter   | 自定义过滤器     | JSX        |                             |        |
| ellipsis | 是否超出省略代替 | Boolean    |                             |        |
| align    | 对齐方式         | String     | 'left'/'center'/'right'     |        |
|          |                  |            |                             |        |



#### 高级指引

> 你可以自定义全局方法

```js
/* filterTypes
  自定义过滤类型及方法，为了避免不必要的渲染，请使用memoized
  默认内置模糊文本和数组过滤：text/fuzzyText/checkbox
  接收参数：行数据/列键值/筛选的内容
*/
filterTypes: {
    methodName: (rows, columnIds, filterValue) => Boolean
}

/* Filter
  自定义筛选框
*/
Filter: ({column}) => JSX


```

