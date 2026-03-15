import { useDispatch, useSelector } from "react-redux";
import { columns } from "./table";
import type { AppDispatch, RootState } from "@/store";
import { addRow, deleteRow, updateRow, setTable } from "@/store/table-slice";
import { useState } from "react";
import type {
  HandleCellSaveFuncTyp,
  ICusCellRenderColumnType,
  IFiled,
} from "@/interfaces/table";
import EditableCell from "../components/EditableCell";

const useVariableTableLogic = () => {
  const tableData = useSelector((state: RootState) => state.table.data);
  const dispatch = useDispatch<AppDispatch>();
  /** 当前选中行的key */
  const [selectedRowKey, setSelectedRowKey] = useState(-1);
  /** 当前正在编辑的单元格key */
  const [editingCellKey, setEditingCellKey] = useState<"" | keyof IFiled>();
  const mergedColumns: ICusCellRenderColumnType[] = columns.map((col) => {
    return {
      ...col,
      onCell: () => ({
        onClick: () => {
          setEditingCellKey(col.dataIndex);
        },
      }),
      render: (text, record) => {
        return col.renderFormItem ? (
          <EditableCell
            isEditing={col.dataIndex === editingCellKey}
            cellKey={col.dataIndex}
            record={record}
            renderFormItem={col.renderFormItem}
            onCellSave={(rowKey, cellKey, value) => {
              handleCellSave(rowKey, cellKey, value);
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

  /** 更新单元格数据 */
  const handleCellSave: HandleCellSaveFuncTyp = (rowKey, cellKey, value) => {
    dispatch(
      updateRow({
        ...tableData[rowKey],
        [cellKey]: value,
      }),
    );
    // 当前没有编辑单元格
    setEditingCellKey("");
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
