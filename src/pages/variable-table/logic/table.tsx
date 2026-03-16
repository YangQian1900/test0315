import type { ICusCellRenderColumnType } from "@/interfaces/table";
import Input from "antd/es/input";
import Select from "antd/es/select";

export const ColName = {
  index: { title: "Index", dataIndex: "index" },
  name: { title: "Name", dataIndex: "name" },
  dataType: { title: "Data Type", dataIndex: "dataType" },
  defaultValue: {
    title: "Default Value",
    dataIndex: "defaultValue",
  },
  comment: {
    title: "Comment",
    dataIndex: "comment",
  },
};
export const columns: ICusCellRenderColumnType[] = [
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
    renderFormItem: (_form, _record, save) => (
      <Input onBlur={save} onPressEnter={save} />
    ),
  },
  {
    title: "Data Type",
    dataIndex: "dataType",
    width: 200,
    isEditing: false,
    renderFormItem: (_form, _record, save) => (
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
  },
  {
    title: "Comment",
    dataIndex: "comment",
    width: 200,
    isEditing: false,
  },
];
