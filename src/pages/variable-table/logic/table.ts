import type { ICusCellRenderColumnType } from "@/interfaces/table";

export const columns: ICusCellRenderColumnType[] = [
  {
    title: "Index",
    dataIndex: "index",
    width: 100,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "Data Type",
    dataIndex: "dataType",
    width: 200,
  },
  {
    title: "Default Value",
    dataIndex: "defaultValue",
    width: 200,
  },
  {
    title: "Comment",
    dataIndex: "comment",
    width: 200,
  },
];
