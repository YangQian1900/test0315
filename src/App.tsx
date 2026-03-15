import { Routes, Route, type RouteObject } from 'react-router-dom'
import routeList from './routers'
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';


function renderRoutes(routes:RouteObject[]) {
  return routes.map((r) => (
      <Route key={r.path} path={r.path} element={r.element}>
      {r.children && renderRoutes(r.children)}
    </Route>
  ))
}

function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>{renderRoutes(routeList)}</Routes>
      </Suspense>
    </Provider>
  );
}

export default App;