import type { IFiled } from "@/interfaces/table";
import type { FormInstance } from "antd";
import { createContext } from "react";

/** 编辑单元格时共享该行的表格实例 */
const EditableRowContext = createContext<FormInstance<IFiled>>({} as FormInstance);

export default EditableRowContext;