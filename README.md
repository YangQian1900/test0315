1、如何运行项目
  - 拉取代码
  - 在文件夹下执行命令 pnpm install
  - 在文件夹下执行命令 pnpm run dev 

2、项目结构描述
src/
 ├─ __tests__/              # 单元测试
 ├─ api/                    # 接口请求
 ├─ assets/                 # 静态资源
 ├─ components/             # 公共组件
 ├─ hooks/                  # 公共钩子
 ├─ interface/              # 接口声明
 ├─ pages/                  # 页面
 │   ├─ variable-table/    
 │   │   ├─ index.tsx
 │   │   ├─ index.scss
 ├─ routers/                # 路由
 │   ├─ index.ts               # 全局所有路由
 │   ├─ core-router.tsx        # 每个模块的路由
 │   ├─ lazy.ts                # 懒加载组件(组件包了一层lazy)
 ├─ store/                  # 全局状态管理
 ├─ hooks/                  # 自定义 Hook
 ├─ utils/                  # 工具函数
 ├─ App.jsx
 └─ main.jsx
  