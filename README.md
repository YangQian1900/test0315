1、如何运行项目
  - 拉取代码
  - 在根文件夹下执行命令 pnpm install
  - 在根文件夹下执行命令  运行代码：pnpm run dev 运行测试：pnpm run test

2、项目结构描述
src/
 ├─ assets/                 # 静态资源
 ├─ components/             # 公共组件
 │   ├─ EditableCell/         # 可编辑单元格组件
 │   │   ├─ index.tsx             # 组件代码
 │   │   ├─ EditableCell.spec.tsx #组件单元测试          
 ├─ context/                # 全局上下文
 ├─ interface/              # 接口定义
 ├─ pages/                  # 页面
 │   ├─ VariableTable/        # 变量表页面
 │   │   ├─ logic/                 # 页面相关逻辑 其中index文件为主逻辑
 │   │   ├─ index.module.scss      # 页面样式
 │   │   ├─ index.tsx              # 页面代码
 │   │   ├─ VariableTable.spec.tsx #页面测试代码
 ├─ routers/                # 路由
 │   ├─ index.ts               # 全局所有路由
 │   ├─ core-router.tsx        # 每个模块的路由
 │   ├─ lazy.ts                # 懒加载组件(组件包了一层lazy)
 ├─ store/                  # 全局状态管理
 ├─ types/                  # 全局类型声明
 ├─ App.jsx
 └─ main.jsx
  