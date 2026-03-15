import { Routes, Route, type RouteObject } from 'react-router-dom'
import routeList from './routers'
import { Suspense } from 'react';


function renderRoutes(routes:RouteObject[]) {
  return routes.map((r) => (
      <Route key={r.path} path={r.path} element={r.element}>
      {r.children && renderRoutes(r.children)}
    </Route>
  ))
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{renderRoutes(routeList)}</Routes>
    </Suspense>
  );
}

export default App;