import type { RouteObject } from "react-router-dom";
import { VariableTableLazy } from "./lazy";



const routes: RouteObject[] = [
  /* 变量表页 */
  { path: '/table', element: <VariableTableLazy /> }
];

export default routes;