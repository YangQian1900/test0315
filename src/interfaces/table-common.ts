import type { ColumnType } from "antd/es/table";
import type { ReactNode } from "react";

/** 每一列自定义编辑方式 是input框还是select等等 */
export type RenderFormItemFuncType<T extends object> = (
  /** 该行数据 */
  record: T,
  /** 保存该cell修改之后的数据 */
  save: () => void,
) => ReactNode;

export type ICusCellRenderColumnType<T extends object> = ColumnType<T> & {
  /** 自定义列的渲染 */
  renderFormItem?: RenderFormItemFuncType<T>;
  /** 当前单元格是否处于编辑中 */
  isEditing: boolean;
};

/** 保存单元格数据的方法声明  返回设置的值*/
export type HandleCellSaveFuncType<T extends object, K extends keyof T> = (
  rowId: T[K],
  cellKey: keyof T,
  cellValue: T[keyof T],
) => T[keyof T] | undefined;