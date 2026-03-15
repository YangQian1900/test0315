import { useDispatch, useSelector } from "react-redux";
import { getColumns } from "./table";
import type { AppDispatch, RootState } from "@/store";
import { addRow, deleteRow, updateRow, setTable } from "@/store/table-slice";
import { useState } from "react";

const useVariableTableLogic = () => {
  const tableData = useSelector((state: RootState) => state.table.data);
  const dispatch = useDispatch<AppDispatch>();
  const columns = getColumns();
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
    columns,
    tableData,
    selectedRowKey,
    setSelectedRowKey,
    addTableEmptyRow,
    deleteTableRow,
  };
};

export default useVariableTableLogic;
