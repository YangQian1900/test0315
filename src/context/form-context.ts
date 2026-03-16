import type { FormInstance } from "antd";
import { createContext } from "react";

/** 编辑单元格时共享该行的表格实例 */
const FormContext = createContext<FormInstance>({} as FormInstance);

export default FormContext;