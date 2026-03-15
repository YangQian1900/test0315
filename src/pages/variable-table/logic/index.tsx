import { useDispatch, useSelector } from "react-redux";
import { columns } from "./table";
import type { AppDispatch, RootState } from "@/store";
import { addRow, deleteRow, updateRow, setTable } from "@/store/table-slice";
import { useState } from "react";
import type { ICusCellRenderColumnType, IFiled } from "@/interfaces/table";
import EditableCell from "../components/EditableCell";

const useVariableTableLogic = () => {
  const tableData = useSelector((state: RootState) => state.table.data);
  const dispatch = useDispatch<AppDispatch>();
  const mergedColumns: ICusCellRenderColumnType[] = columns.map((col) => {
    return {
      ...col,
      render: (text, record) => {
        return col.renderFormItem ? (
          <EditableCell
            dataIndex={col.dataIndex}
            record={record}
            renderFormItem={col.renderFormItem}
            onCellSave={(key: IFiled["index"], value: IFiled[keyof IFiled]) => {
              // handleCellSave(key, value, col.dataIndex)
            }}
          >
            {text}
          </EditableCell>
        ) : (
          <>{text}</>
        );
      },
    };
  });

  /** 当前选中行的key */
  const [selectedRowKey, setSelectedRowKey] = useState(-1);

  /** 新增一空白行 */
  const addTableEmptyRow = () => {
    dispatch(
      addRow({
        index: -1,
      }),
    );
  };

  /** 删除一行 */
  const deleteTableRow = () => {
    dispatch(deleteRow(selectedRowKey));
  };

  return {
    mergedColumns,
    tableData,
    selectedRowKey,
    setSelectedRowKey,
    addTableEmptyRow,
    deleteTableRow,
  };
};

export default useVariableTableLogic;
