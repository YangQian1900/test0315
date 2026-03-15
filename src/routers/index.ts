import coreRouter from "./core-router";

export default [
    // 默认路由到coreRouter中的第一个
    { path: '/', element: coreRouter[0].element },
    ... coreRouter
];