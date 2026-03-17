import type { ICusCellRenderColumnType } from "@/interfaces/table-common";
import Input from "antd/es/input";
import Select from "antd/es/select";

/** 字段定义 */
export interface IFiled {
  /** 新增一行时index固定传-1 序号从1自动自增  */
  index: number;
  /** 字段名称 */
  name: string;
  /** 字段类型 */
  dataType: string;
  /** 默认值 */
  defaultValue: string;
  /** 备注 */
  comment: string;
}

export const columns: ICusCellRenderColumnType<IFiled>[] = [
  {
    title: "Index",
    dataIndex: "index",
    width: 100,
    isEditing: false,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
    isEditing: false,
    renderFormItem: (_record, save) => (
      <Input onBlur={save} />
    ),
  },
  {
    title: "Data Type",
    dataIndex: "dataType",
    width: 200,
    isEditing: false,
    renderFormItem: (_record, save) => (
      <Select
        options={[
          { label: "BOOL", value: "BOOL" },
          { label: "INT", value: "INT" },
        ]}
        onChange={save}
      />
    ),
  },
  {
    title: "Default Value",
    dataIndex: "defaultValue",
    width: 200,
    isEditing: false,
    renderFormItem: (_record, save) => (
      <Input onBlur={save} />
    ),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    width: 200,
    isEditing: false,
    renderFormItem: (_record, save) => (
      <Input onBlur={save} />
    ),
  },
];

/** 允许的类型 */
export const DATA_TYPES = ["BOOL", "INT"] as const;
type DataType = (typeof DATA_TYPES)[number];

export const isDataType = (str: string): str is DataType => {
  return DATA_TYPES.some((x) => x === str?.toLocaleUpperCase());
};

/** 数据类型对应的默认值 */
export const DefaultValueMap: Record<string, string> = {
  BOOL: "TRUE",
  INT: "0",
};

/** 数据类型对应的可选值 */
export const checkValues = (dataType: string,defaultValue:string) => {
  const dataTypeUpperCase = dataType?.toLocaleUpperCase();
  const defaultValueUpperCase = defaultValue?.toLocaleUpperCase();
  if (dataTypeUpperCase === "BOOL") {
    return ["TRUE", "FALSE"].includes(defaultValueUpperCase);
  } else {
    const num = Number(defaultValueUpperCase);
    return Number.isInteger(num) && num >= -2147483648 && num <= 2147483647;
  }
};
