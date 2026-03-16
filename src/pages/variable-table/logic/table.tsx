import type { ICusCellRenderColumnType } from "@/interfaces/table";
import Input from "antd/es/input";

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


