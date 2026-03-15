/** 字段定义 */
export interface IFiled {
  /** 序号从1自增 */
  index: number;
  /** 字段名称 */
  name: string;
  /** 字段类型 */
  dataType: IFiled_DataType;
  /** 默认值 */
  defaultValue: IFiled_DefaultValue;
  /** 备注 */
  comment: string;
}

export type IFiled_DataType = 'BOOL'| 'INT';
export type IFiled_DefaultValue = 'false'|'FALSE'|'true'|'TRUE' | number;