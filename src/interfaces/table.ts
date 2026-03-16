import type { FormInstance } from "antd/es/form/Form";
import type { ColumnType } from "antd/es/table";
import type { ReactNode } from "react";

/** 字段定义 */
export interface IFiled {
  /** 新增一行时index固定传-1 序号从1自动自增  */
  index: number;
  /** 字段名称 */
  name?: string;
  /** 字段类型 */
  dataType?: IFiled_DataType;
  /** 默认值 */
  defaultValue?: IFiled_DefaultValue;
  /** 备注 */
  comment?: string;
}

export type IFiled_DataType = "BOOL" | "INT";
export type IFiled_DefaultValue = "false" | "FALSE" | "true" | "TRUE" | number;

/** 每一列自定义编辑方式 是input框还是select等等 */
export type RenderFormItemFuncType = (
  /** 当前行的form实例对象 */
  form: FormInstance<IFiled>,
  /** 该行数据 */
  record: IFiled,
  /** 保存该cell修改之后的数据 */
  save: () => void,
) => ReactNode;

export type ICusCellRenderColumnType = ColumnType<IFiled> & {
  /** 覆盖ColumnType中的dataIndex 让类型更准确 */
  dataIndex: keyof IFiled;
  /** 自定义列的渲染 */
  renderFormItem?: RenderFormItemFuncType;
  /** 当前单元格是否处于编辑中 */
  isEditing:boolean;
};

/** 保存单元格数据的方法声明  返回设置的值*/
export type HandleCellSaveFuncTyp = (rowKey: IFiled["index"], cellKey:keyof IFiled,value: IFiled[keyof IFiled]) => IFiled[keyof IFiled];
